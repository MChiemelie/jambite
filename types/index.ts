import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Session } from '@supabase/auth-helpers-nextjs';

export interface SidebarItems {
  links: Array<{
    label: string;
    href: string;
    icon?: LucideIcon;
  }>;
  extras?: ReactNode;
}

export interface PerformanceSubject {
  subject: string;
  attempts: number;
}

export interface PerformanceData {
  mostAttemptedSubjects: PerformanceSubject[];
  topScores: { subject: string; score: number }[];
}

export interface ScoreProps {
  session: Session | null;
}