import type { User as FirebaseUser } from 'firebase/auth';

export type UserRole = 'manager' | 'psychologist' | 'patient' | null;

export type AuthUser = FirebaseUser;

export interface AuthContextType {
  user: AuthUser | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Psychologist {
  id: string;
  name: string;
  socialName: string;
  crp: string;
  phone: string;
  email: string;
  bio: string;
  specialties: string[];
  photoURL?: string;
}

export interface Article {
  title: string;
  description: string;
  content: string;
}