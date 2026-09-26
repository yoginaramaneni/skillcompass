import { RegisterInput, LoginInput } from '../schemas/auth.schema';
import { userRepository } from '../repositories/user.repository';
import { profileRepository } from '../repositories/profile.repository';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ApiError } from '../utils/apiError';

export class AuthService {
  async register(input: RegisterInput) {
    try {
      const existingUser = await userRepository.findByEmail(input.email);
      if (existingUser) {
        throw new ApiError(409, 'Email already registered', 'EMAIL_ALREADY_EXISTS');
      }

      const passwordHash = await hashPassword(input.password);

      const user = await userRepository.create({
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
      });

      // Create default profile container for user
      await profileRepository.upsert(user.id, {});

      const token = generateToken({ userId: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('DATABASE_URL')) {
        throw new ApiError(
          500,
          'Database connection is not configured. Set DATABASE_URL in server/.env before registering.',
          'DATABASE_NOT_CONFIGURED'
        );
      }

      if (error instanceof Error && error.message.includes('JWT_SECRET')) {
        throw new ApiError(
          500,
          'Authentication secret is missing. Set JWT_SECRET in server/.env before registering.',
          'AUTH_CONFIG_MISSING'
        );
      }

      throw new ApiError(
        500,
        error instanceof Error ? error.message : 'Registration failed',
        'REGISTRATION_FAILED'
      );
    }
  }

  async login(input: LoginInput) {
    try {
      const user = await userRepository.findByEmail(input.email);
      if (!user) {
        throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
      }

      const isValidPassword = await comparePassword(input.password, user.password_hash);
      if (!isValidPassword) {
        throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS');
      }

      const token = generateToken({ userId: user.id, email: user.email });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes('DATABASE_URL')) {
        throw new ApiError(
          500,
          'Database connection is not configured. Set DATABASE_URL in server/.env before logging in.',
          'DATABASE_NOT_CONFIGURED'
        );
      }

      if (error instanceof Error && error.message.includes('JWT_SECRET')) {
        throw new ApiError(
          500,
          'Authentication secret is missing. Set JWT_SECRET in server/.env before logging in.',
          'AUTH_CONFIG_MISSING'
        );
      }

      throw new ApiError(
        500,
        error instanceof Error ? error.message : 'Login failed',
        'LOGIN_FAILED'
      );
    }
  }

  async getMe(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found', 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
    };
  }
}

export const authService = new AuthService();
