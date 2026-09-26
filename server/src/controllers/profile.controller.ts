import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';
import { onboardingProfileSchema } from '../schemas/profile.schema';
import { profileService } from '../services/profile.service';

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const profileData = await profileService.getProfile(req.user.userId);
  return res.status(200).json({
    success: true,
    data: profileData,
  });
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const parseResult = onboardingProfileSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parseResult.error.errors,
    });
  }

  const updatedProfile = await profileService.saveOnboardingProfile(req.user.userId, parseResult.data);
  return res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile,
  });
};
