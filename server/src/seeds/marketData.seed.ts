export interface ReferenceMarketPeriod {
  source: string;
  sourceUrl: string;
  collectedAt: string;
  period: string;
  totalRecords: number;
  records: Array<{
    skill: string;
    mentions: number;
  }>;
}

export const REFERENCE_MARKET_DATASETS: ReferenceMarketPeriod[] = [
  // 2026-Q1 Dataset
  {
    source: 'SkillCompass Reference Dataset (Imported)',
    sourceUrl: 'https://skillcompass.io/data/reference-2026q1.json',
    collectedAt: '2026-03-31T00:00:00Z',
    period: '2026-Q1',
    totalRecords: 1000,
    records: [
      { skill: 'React.js', mentions: 180 },       // 18.0%
      { skill: 'NodeJS', mentions: 150 },         // 15.0%
      { skill: 'Python', mentions: 220 },         // 22.0%
      { skill: 'SQL', mentions: 310 },            // 31.0%
      { skill: 'TypeScript', mentions: 140 },     // 14.0%
      { skill: 'Docker', mentions: 110 },         // 11.0%
      { skill: 'PostgreSQL', mentions: 130 },     // 13.0%
      { skill: 'Git', mentions: 420 },            // 42.0%
      { skill: 'RAG', mentions: 40 },             // 4.0%
    ],
  },
  // 2026-Q2 Dataset
  {
    source: 'SkillCompass Reference Dataset (Imported)',
    sourceUrl: 'https://skillcompass.io/data/reference-2026q2.json',
    collectedAt: '2026-06-30T00:00:00Z',
    period: '2026-Q2',
    totalRecords: 1000,
    records: [
      { skill: 'React', mentions: 185 },          // 18.5% (stable)
      { skill: 'Node.js', mentions: 165 },        // 16.5% (increasing)
      { skill: 'Python', mentions: 235 },         // 23.5% (increasing)
      { skill: 'SQL', mentions: 305 },            // 30.5% (stable)
      { skill: 'TypeScript', mentions: 160 },     // 16.0% (increasing)
      { skill: 'Docker', mentions: 125 },         // 12.5% (increasing)
      { skill: 'PostgreSQL', mentions: 145 },     // 14.5% (increasing)
      { skill: 'Git', mentions: 415 },            // 41.5% (stable)
      { skill: 'RAG', mentions: 65 },             // 6.5% (increasing)
    ],
  },
  // 2026-Q3 Dataset (Current Period)
  {
    source: 'SkillCompass Reference Dataset (Imported)',
    sourceUrl: 'https://skillcompass.io/data/reference-2026q3.json',
    collectedAt: '2026-09-26T00:00:00Z',
    period: '2026-Q3',
    totalRecords: 1000,
    records: [
      { skill: 'ReactJS', mentions: 190 },        // 19.0% (stable)
      { skill: 'Node.js', mentions: 185 },        // 18.5% (increasing)
      { skill: 'Python', mentions: 250 },         // 25.0% (increasing)
      { skill: 'SQL', mentions: 300 },            // 30.0% (stable)
      { skill: 'TypeScript', mentions: 180 },     // 18.0% (increasing)
      { skill: 'Docker', mentions: 140 },         // 14.0% (increasing)
      { skill: 'Postgres', mentions: 160 },       // 16.0% (increasing)
      { skill: 'Git', mentions: 410 },            // 41.0% (stable)
      { skill: 'RAG', mentions: 90 },             // 9.0% (increasing)
    ],
  },
];
