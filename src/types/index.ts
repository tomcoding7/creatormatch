export type ContentNiche = 
  | 'Gaming'
  | 'Tech'
  | 'Lifestyle'
  | 'Education'
  | 'Entertainment'
  | 'Fashion'
  | 'Food'
  | 'Travel'
  | 'Fitness'
  | 'Music'
  | 'Art'
  | 'Business';

export type Platform = 'YouTube' | 'TikTok' | 'Instagram' | 'Twitch' | 'Twitter';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Professional';

export type Goal = 'Collaboration' | 'Friendship' | 'Learning' | 'Business';

export type Vibe = 'Funny' | 'Educational' | 'Chill' | 'Energetic' | 'Professional' | 'Creative';

export type ResourceType = 'Mentorship' | 'Equipment' | 'Networking' | 'Education' | 'Accountability';

export interface SocialLinks {
  youtube: string | null;
  tiktok: string | null;
  instagram: string | null;
  twitter: string | null;
  discord: string | null;
}

export interface Creator {
  id: string;
  auth_id: string;
  name: string;
  age: number;
  gender: string;
  location: string | null;
  content_niches: ContentNiche[];
  skill_level: SkillLevel;
  platforms: Platform[];
  goals: Goal[];
  timezone: string;
  languages: string[];
  vibes: Vibe[];
  bio: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  onboarding_completed: boolean;
  preferences: Record<string, string>;
  last_active: string | null;
  is_online: boolean;
  social_links: SocialLinks;
}

export interface Match {
  id: string;
  creatorId1: string;
  creatorId2: string;
  status: 'pending' | 'accepted' | 'rejected';
  suggestedCollabs: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface CollabSuggestion {
  id: string;
  title: string;
  description: string;
  contentNiches: ContentNiche[];
  platforms: Platform[];
  difficulty: SkillLevel;
}

export const CONTENT_NICHES = [
  'Gaming',
  'Tech',
  'Lifestyle',
  'Education',
  'Entertainment',
  'Fashion',
  'Food',
  'Travel',
  'Fitness',
  'Music',
  'Art',
  'Business'
] as const;

export const PLATFORMS = [
  'YouTube',
  'TikTok',
  'Instagram',
  'Twitch',
  'Twitter'
] as const;

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
] as const;

export const GOALS = [
  'Collaboration',
  'Friendship',
  'Learning',
  'Business'
] as const;

export const VIBES = [
  'Funny',
  'Educational',
  'Chill',
  'Energetic',
  'Professional',
  'Creative'
] as const;

export const RESOURCES = [
  'Mentorship',
  'Equipment',
  'Networking',
  'Education',
  'Accountability'
] as const;

export const TIMEZONES = [
  'UTC-12:00',
  'UTC-11:00',
  'UTC-10:00',
  'UTC-09:00',
  'UTC-08:00',
  'UTC-07:00',
  'UTC-06:00',
  'UTC-05:00',
  'UTC-04:00',
  'UTC-03:00',
  'UTC-02:00',
  'UTC-01:00',
  'UTC+00:00',
  'UTC+01:00',
  'UTC+02:00',
  'UTC+03:00',
  'UTC+04:00',
  'UTC+05:00',
  'UTC+06:00',
  'UTC+07:00',
  'UTC+08:00',
  'UTC+09:00',
  'UTC+10:00',
  'UTC+11:00',
  'UTC+12:00',
  'UTC+13:00',
  'UTC+14:00'
] as const; 