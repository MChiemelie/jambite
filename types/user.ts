import type { AppwriteDoc } from './appwrite';

export interface User extends AppwriteDoc {
  fullname: string;
  email: string;
  avatarId: string | null;
  avatarUrl: string;
  trials: number;
  ai?: boolean;
  currentStreak: number;
  longestStreak: number;
  lastPractice?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  location?: string | null;
  birthday?: string | null;
  subjects?: string[];
  gender?: 'male' | 'female';
  phone?: string | null;
  userId: string;
  paystackId?: number;
}

type CreateUser = Omit<User, keyof AppwriteDoc | 'ai' | 'lastPractice' | 'avatar' | 'firstname' | 'lastname' | 'location' | 'birthday' | 'subjects' | 'gender' | 'phone'> & {
  ai?: boolean;
  lastPractice?: string | null;
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
