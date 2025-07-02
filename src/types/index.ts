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

export interface Creator {
  id: string;
  name: string;
  age: number;
  gender: string;
  location?: string;
  contentNiches: ContentNiche[];
  skillLevel: SkillLevel;
  platforms: Platform[];
  goals: Goal[];
  timezone: string;
  languages: string[];
  vibes: Vibe[];
  bio: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  matchId: string;
  senderId: string;
  content: string;
  createdAt: string;
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