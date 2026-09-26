import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types/auth.types';

export const register = async (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parseResult.error.errors,
    });
  }

  const result = await authService.register(parseResult.data);
  return res.status(201).json({
    success: true,
    message: 'Registration successful',
    token: result.token,
    user: result.user,
  });
};

export const login = async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: parseResult.error.errors,
    });
  }

  const result = await authService.login(parseResult.data);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token: result.token,
    user: result.user,
  });
};

export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const user = await authService.getMe(req.user.userId);
  return res.status(200).json({
    success: true,
    user,
  });
};

export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
