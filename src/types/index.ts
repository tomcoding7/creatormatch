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