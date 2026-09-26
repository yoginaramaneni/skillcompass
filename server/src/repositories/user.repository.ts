import { queryDatabase } from '../db';
import { DbUser } from '../types/db.types';

export class UserRepository {
  async findByEmail(email: string): Promise<DbUser | null> {
    const normalizedEmail = email.toLowerCase().trim();
    const result = await queryDatabase(
      `SELECT id, email, password_hash, first_name, last_name, created_at, updated_at
       FROM users WHERE email = $1`,
      [normalizedEmail]
    );
    return result.rows[0] || null;
  }

  async findById(id: string): Promise<DbUser | null> {
    const result = await queryDatabase(
      `SELECT id, email, password_hash, first_name, last_name, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(userData: {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName?: string;
  }): Promise<DbUser> {
    const normalizedEmail = userData.email.toLowerCase().trim();
    const result = await queryDatabase(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, password_hash, first_name, last_name, created_at, updated_at`,
      [normalizedEmail, userData.passwordHash, userData.firstName, userData.lastName || null]
    );
    return result.rows[0];
  }
}

export const userRepository = new UserRepository();
