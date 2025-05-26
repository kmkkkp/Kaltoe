export type Challenge = 'quiz' | 'writing' | 'prediction';

export interface Star {
  id: string;
  day: number;
  date: string;
  position: { x: number; y: number };
  brightness: number; // 0-3 based on how many challenges completed that day
  challenges: Challenge[];
  completed: boolean;
}

export interface Constellation {
  id: string;
  name: string;
  nameKorean: string;
  description: string;
  totalDays: number;
  stars: Star[];
  completed: boolean;
  startDate: string;
  endDate: string | null;
  aborted: boolean;
}

export interface User {
  id: string;
  name: string;
  profileImage: string;
  badges: Badge[];
  accuracy: number;
  totalConstellations: number;
  currentConstellation: Constellation | null;
  completedConstellations: Constellation[];
  friends: string[]; // User IDs
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  acquiredDate: string;
}

export interface ConstellationTemplate {
  id: string;
  name: string;
  nameKorean: string;
  description: string;
  totalDays: number;
  starPositions: { x: number; y: number }[];
  difficulty: 'easy' | 'medium' | 'hard';
  image: string;
}