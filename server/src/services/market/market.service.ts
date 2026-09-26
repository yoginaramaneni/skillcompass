import { skillNormalizer } from './skill-normalizer';
import { trendService } from './trend.service';
import { REFERENCE_MARKET_DATASETS } from '../../seeds/marketData.seed';
import { skillsRepository, STATIC_SKILLS_REFERENCE } from '../../repositories/skill.repository';
import { careersRepository, STATIC_CAREERS_REFERENCE } from '../../repositories/career.repository';
import { profileRepository } from '../../repositories/profile.repository';
import { levelToNumber, numberToLevel } from '../../utils/skillLevel';
import {
  MarketSkillSignal,
  CareerMarketSignalItem,
  PersonalizedMarketItem,
} from '../../types/market';
import { ApiError } from '../../utils/apiError';

export class MarketService {
  getAllSkillSignals(): MarketSkillSignal[] {
    // Map datasets chronologically
    const latestDataset = REFERENCE_MARKET_DATASETS[REFERENCE_MARKET_DATASETS.length - 1];
    const signals: MarketSkillSignal[] = [];

    for (const record of latestDataset.records) {
      const canonical = skillNormalizer.getCanonicalName(record.skill);
      const matchSkill = STATIC_SKILLS_REFERENCE.find((s) => s.slug === canonical.slug);

      // Collect historical time points for this skill across periods
      const history = REFERENCE_MARKET_DATASETS.map((ds) => {
        const found = ds.records.find((r) => skillNormalizer.normalizeToSlug(r.skill) === canonical.slug);
        const mentions = found ? found.mentions : 0;
        const rate = Math.round((mentions / ds.totalRecords) * 100 * 100) / 100;
        return {
          timePeriod: ds.period,
          mentions,
          totalRecords: ds.totalRecords,
          mentionRate: rate,
        };
      });

      const trendRes = trendService.calculateTrend(history);
      const freshness = trendService.calculateFreshness(latestDataset.collectedAt);
      const mentionRate = Math.round((record.mentions / latestDataset.totalRecords) * 100 * 100) / 100;

      signals.push({
        skillId: matchSkill ? matchSkill.id : `sk-${canonical.slug}`,
        skillName: canonical.name,
        slug: canonical.slug,
        category: matchSkill?.category || 'General',
        mentions: record.mentions,
        totalRecords: latestDataset.totalRecords,
        mentionRate,
        trendDirection: trendRes.trendDirection,
        absoluteChange: trendRes.absoluteChange,
        relativeChange: trendRes.relativeChange,
        source: latestDataset.source,
        sourceUrl: latestDataset.sourceUrl,
        timePeriod: latestDataset.period,
        collectedAt: latestDataset.collectedAt,
        freshness,
        history,
      });
    }

    return signals.sort((a, b) => b.mentionRate - a.mentionRate);
  }

  getSkillDetails(skillIdOrSlug: string): MarketSkillSignal {
    const slug = skillNormalizer.normalizeToSlug(skillIdOrSlug);
    const allSignals = this.getAllSkillSignals();
    const match = allSignals.find((s) => s.skillId === skillIdOrSlug || s.slug === slug);

    if (!match) {
      const canonical = skillNormalizer.getCanonicalName(skillIdOrSlug);
      return {
        skillId: `sk-${canonical.slug}`,
        skillName: canonical.name,
        slug: canonical.slug,
        category: 'General',
        mentions: 0,
        totalRecords: 1000,
        mentionRate: 0,
        trendDirection: 'insufficient_data',
        source: 'SkillCompass Reference Dataset (Imported)',
        timePeriod: '2026-Q3',
        collectedAt: new Date().toISOString(),
        freshness: 'fresh',
        history: [],
      };
    }

    return match;
  }

  async getCareerMarketView(careerIdOrSlug: string): Promise<{
    career: { id: string; name: string; slug: string };
    signals: CareerMarketSignalItem[];
  }> {
    let role = await careersRepository.findRoleById(careerIdOrSlug);
    if (!role) {
      role = STATIC_CAREERS_REFERENCE.find((r) => r.slug === careerIdOrSlug || r.id === careerIdOrSlug) || STATIC_CAREERS_REFERENCE[0];
    }

    const roleSkills = await careersRepository.findRoleSkills(role.id);
    const allMarketSignals = this.getAllSkillSignals();

    const items: CareerMarketSignalItem[] = roleSkills.map((rs) => {
      const marketSignal = allMarketSignals.find((ms) => ms.slug === rs.slug);
      return {
        skillId: rs.skillId,
        skillName: rs.skillName,
        slug: rs.slug,
        category: rs.category || 'General',
        careerImportance: rs.importance,
        minimumLevel: rs.minimumLevel,
        marketSignal,
      };
    });

    return {
      career: { id: role.id, name: role.name, slug: role.slug },
      signals: items,
    };
  }

  async getPersonalizedMarketView(userId: string): Promise<{
    targetCareer: { id: string; name: string };
    items: PersonalizedMarketItem[];
  }> {
    const profile = await profileRepository.findByUserId(userId);
    const userSkills = await skillsRepository.getUserSkills(userId);
    const targetCareerId = profile?.target_career_id || 'role-fsd';

    let role = await careersRepository.findRoleById(targetCareerId);
    if (!role) role = STATIC_CAREERS_REFERENCE[0];

    const requiredSkills = await careersRepository.findRoleSkills(role.id);
    const allMarketSignals = this.getAllSkillSignals();

    const items: PersonalizedMarketItem[] = await Promise.all(
      requiredSkills.map(async (rs) => {
        const userMatch = userSkills.find((us) => us.skill_id === rs.skillId);
        const dbSkill = await skillsRepository.findSkillById(rs.skillId);
        const canonicalSlug = dbSkill ? dbSkill.slug : rs.slug;

        const selfNum = userMatch ? levelToNumber(userMatch.self_reported_level) : 0;
        const verNum = userMatch?.verified_level ? levelToNumber(userMatch.verified_level) : undefined;
        const userCurrentLevel = verNum ?? selfNum;
        const gap = Math.max(0, rs.minimumLevelNumber - userCurrentLevel);

        const marketSignal = allMarketSignals.find((ms) => ms.slug === canonicalSlug);

        return {
          skillId: rs.skillId,
          skillName: rs.skillName,
          slug: canonicalSlug,
          category: rs.category || 'General',
          careerImportance: rs.importance,
          userCurrentLevel,
          userSelfReportedLevel: userMatch?.self_reported_level || undefined,
          userVerifiedLevel: userMatch?.verified_level || undefined,
          requiredLevelNumber: rs.minimumLevelNumber,
          requiredLevelName: rs.minimumLevel,
          gap,
          marketSignal,
        };
      })
    );

    return {
      targetCareer: { id: role.id, name: role.name },
      items,
    };
  }
}

export const marketService = new MarketService();
