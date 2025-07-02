import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getMatchScore = (creator1: any, creator2: any) => {
  let score = 0;
  
  // Content niche overlap
  const nicheOverlap = creator1.contentNiches.filter((niche: string) => 
    creator2.contentNiches.includes(niche)
  ).length;
  score += nicheOverlap * 10;

  // Platform overlap
  const platformOverlap = creator1.platforms.filter((platform: string) =>
    creator2.platforms.includes(platform)
  ).length;
  score += platformOverlap * 5;

  // Goals overlap
  const goalOverlap = creator1.goals.filter((goal: string) =>
    creator2.goals.includes(goal)
  ).length;
  score += goalOverlap * 15;

  // Vibe overlap
  const vibeOverlap = creator1.vibes.filter((vibe: string) =>
    creator2.vibes.includes(vibe)
  ).length;
  score += vibeOverlap * 8;

  // Language overlap
  const languageOverlap = creator1.languages.filter((lang: string) =>
    creator2.languages.includes(lang)
  ).length;
  score += languageOverlap * 20;

  // Timezone compatibility (within 3 hours difference)
  const timezoneDiff = Math.abs(
    parseInt(creator1.timezone) - parseInt(creator2.timezone)
  );
  if (timezoneDiff <= 3) {
    score += Math.max(0, (3 - timezoneDiff) * 10);
  }

  // Skill level compatibility (prefer similar levels)
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
  const skillDiff = Math.abs(
    skillLevels.indexOf(creator1.skillLevel) - skillLevels.indexOf(creator2.skillLevel)
  );
  score += Math.max(0, (3 - skillDiff) * 5);

  return score;
}; 