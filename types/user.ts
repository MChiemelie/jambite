import { Models } from 'appwrite';
import { PracticeData } from './practice';

export type UserAuth = Models.User<Models.Preferences>;

export type UserData = {
  fullname: string;
  username: string;
  email: string;
  avatar: string;
  userId: string;
  trials: number;
  ai: boolean;
  practices: PracticeData[];
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  $databaseId: string;
  $collectionId: string;
};

export type User = UserAuth & UserData;

export const exampleUserAuth: UserAuth = {
  $id: '673da6c700389dbc2a85',
  $createdAt: '2024-11-19T12:00:00Z',
  $updatedAt: '2024-11-20T09:00:00Z',
  email: 'melikamchukwuemelie@gmail.com',
  emailVerification: true,
  name: 'Chiemelie Melikam',
  prefs: {
    theme: 'dark',
    language: 'en',
  },
  registration: '2024-11-20T09:00:00Z',
  status: true,
  labels: [],
  passwordUpdate: '2024-11-20T09:00:00Z',
  phone: null,
  phoneVerification: false,
  mfa: false,
  targets: [],
  accessedAt: '2024-11-20T09:00:00Z',
};

export const exampleUserData: UserData = {
  fullname: 'Chiemelie Melikam',
  username: 'Jambite',
  email: 'melikamchukwuemelie@gmail.com',
  trials: 5,
  ai: false,
  avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg',
  userId: '673da6c700389dbc2a85',
  $id: '673da6c90005cf3c901d',
  $createdAt: '2024-11-20T09:07:24.090+00:00',
  $updatedAt: '2024-11-20T09:07:24.090+00:00',
  $permissions: [],
  practices: [],
  $databaseId: '6731488700396455a17a',
  $collectionId: '673148fb002c5c290054',
};

export const exampleFullUserProfile: User = {
  ...exampleUserAuth,
  ...exampleUserData,
};
