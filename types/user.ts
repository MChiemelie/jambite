import { Models } from 'node-appwrite';
import { AppwriteDoc } from './appwrite';

export interface User extends AppwriteDoc {
  fullname: string;
  email: string;
  avatarId: string | null;
  avatarUrl: string;
  trials: number;
  ai?: boolean;
  currentStreak: number;
  longestStreak: number;
  lastPracticed?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  location?: string | null;
  birthday?: string | null;
  subjects?: string[];
  gender?: 'male' | 'female';
  phone?: string | null;
  userId: string;
}

type CreateUser = Omit<User, keyof AppwriteDoc | 'ai' | 'lastPracticed' | 'avatar' | 'firstname' | 'lastname' | 'location' | 'birthday' | 'subjects' | 'gender' | 'phone'> & {
  ai?: boolean;
  lastPracticed?: string | null;
  avatar?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  location?: string | null;
  birthday?: string | null;
  subjects?: string[];
  gender?: 'male' | 'female';
  phone?: string | null;
};

export type UpdateUser = Partial<CreateUser>;

export type UserAuth = Models.User<Models.Preferences>;
