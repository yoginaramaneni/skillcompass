import jwt from 'jsonwebtoken';
import { config, hasJwtSecret } from '../config/env';
import { JwtPayload } from '../types/auth.types';

const assertJwtSecret = () => {
  if (!hasJwtSecret) {
    throw new Error(
      'JWT_SECRET is missing or unconfigured. Set your JWT_SECRET in server/.env before registering or logging in.'
    );
  }
};

export const generateToken = (payload: JwtPayload): string => {
  assertJwtSecret();
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  assertJwtSecret();
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
