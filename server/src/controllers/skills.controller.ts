import { Request, Response } from 'express';
import { skillService } from '../services/skill.service';
import { skillsRepository } from '../repositories/skill.repository';
import { AuthenticatedRequest } from '../types/auth.types';

export const getSkills = async (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;

  const skills = await skillService.getSkills(search, category);
  return res.status(200).json({
    success: true,
    data: skills,
  });
};

export const getUserSkills = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const userSkills = await skillsRepository.getUserSkills(req.user.userId);
  return res.status(200).json({
    success: true,
    data: userSkills,
  });
};
