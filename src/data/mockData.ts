import { User, Constellation, Star, Challenge, Badge } from '../types';
import { constellationTemplates } from './constellations';

// Helper function to create date strings
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Create a completed constellation based on a template
const createCompletedConstellation = (
  templateId: string,
  startDaysAgo: number,
  challengesPerDay: Challenge[][]
): Constellation => {
  const template = constellationTemplates.find(t => t.id === templateId);
  if (!template) throw new Error(`Template ${templateId} not found`);
  
  const stars: Star[] = [];
  const totalDays = template.totalDays;
  
  for (let i = 0; i < totalDays; i++) {
    const challenges = challengesPerDay[i] || [];
    stars.push({
      id: `star-${templateId}-${i}`,
      day: i + 1,
      date: getDateString(startDaysAgo - i),
      position: template.starPositions[i],
      brightness: challenges.length,
      challenges,
      completed: true
    });
  }
  
  return {
    id: `constellation-${templateId}-${startDaysAgo}`,
    name: template.name,
    nameKorean: template.nameKorean,
    description: template.description,
    totalDays,
    stars,
    completed: true,
    startDate: getDateString(startDaysAgo + totalDays - 1),
    endDate: getDateString(startDaysAgo),
    aborted: false
  };
};

// Create badges
const badges: Badge[] = [
  {
    id: 'first-constellation',
    name: '첫 별자리',
    description: '첫 번째 별자리를 완성했습니다',
    icon: '🌟',
    acquiredDate: getDateString(20)
  },
  {
    id: 'perfect-week',
    name: '완벽한 한 주',
    description: '7일 연속으로 모든 챌린지를 완료했습니다',
    icon: '🔥',
    acquiredDate: getDateString(10)
  },
  {
    id: 'prediction-master',
    name: '예측의 달인',
    description: '수익률 예측 10회 연속 성공',
    icon: '📈',
    acquiredDate: getDateString(5)
  }
];

// Create mock user data
export const mockUser: User = {
  id: 'user-1',
  name: '김고앵',
  profileImage: 'https://perfectpetinsurance.co.uk/wp-content/uploads/2025/02/Cat-lays-happily_cat-insurance.jpg?w=150',
  badges,
  accuracy: 68,
  totalConstellations: 3,
  currentConstellation: {
    id: 'current-constellation',
    name: 'Cassiopeia',
    nameKorean: '카시오페이아',
    description: '카시오페이아자리는 W 또는 M 모양의 별자리입니다.',
    totalDays: 5,
    stars: [
      {
        id: 'current-star-1',
        day: 1,
        date: getDateString(2),
        position: { x: 40, y: 40 },
        brightness: 3,
        challenges: ['quiz', 'writing', 'prediction'],
        completed: true
      },
      {
        id: 'current-star-2',
        day: 2,
        date: getDateString(1),
        position: { x: 50, y: 30 },
        brightness: 2,
        challenges: ['quiz', 'prediction'],
        completed: true
      },
      {
        id: 'current-star-3',
        day: 3,
        date: getDateString(0),
        position: { x: 60, y: 40 },
        brightness: 0,
        challenges: [],
        completed: false
      },
      {
        id: 'current-star-4',
        day: 4,
        position: { x: 70, y: 30 },
        date: '',
        brightness: 0,
        challenges: [],
        completed: false
      },
      {
        id: 'current-star-5',
        day: 5,
        position: { x: 80, y: 40 },
        date: '',
        brightness: 0,
        challenges: [],
        completed: false
      }
    ],
    completed: false,
    startDate: getDateString(2),
    endDate: null,
    aborted: false
  },
  completedConstellations: [
    createCompletedConstellation('cancer', 25, [
      ['quiz', 'writing', 'prediction'],
      ['quiz', 'writing'],
      ['quiz', 'prediction'],
      ['writing']
    ]),
    createCompletedConstellation('ursa-minor', 15, [
      ['quiz', 'writing', 'prediction'],
      ['quiz', 'writing'],
      ['quiz', 'prediction'],
      ['writing'],
      ['quiz'],
      ['prediction'],
      ['quiz', 'writing']
    ]),
    createCompletedConstellation('orion', 3, [
      ['quiz', 'writing', 'prediction'],
      ['quiz', 'writing'],
      ['prediction'],
      ['writing', 'prediction'],
      ['quiz'],
      ['quiz', 'prediction'],
      ['writing'],
      ['quiz', 'writing', 'prediction'],
      ['quiz'],
      ['prediction'],
      ['writing'],
      ['quiz', 'writing']
    ])
  ],
  friends: ['friend-1', 'friend-2']
};

// Create mock friend data
export const mockFriends = [
  {
    id: 'friend-1',
    name: '박냐옹',
    profileImage: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQd1kWKsODGmz1P44kiLTfpeIOkaemYITnaRVOZEn372xCyrpNoQQ_dMDAV4dWLpVTDFekNEtlkJaDnhlTzoQWdNg',
    badges: badges.slice(0, 2),
    accuracy: 72,
    totalConstellations: 5,
    currentConstellation: null,
    completedConstellations: [
      createCompletedConstellation('cancer', 40, [
        ['quiz', 'writing'],
        ['quiz', 'prediction'],
        ['writing', 'prediction'],
        ['quiz', 'writing', 'prediction']
      ])
    ],
    friends: ['user-1']
  },
  {
    id: 'friend-2',
    name: '장고양',
    profileImage: 'https://cdn.royalcanin-weshare-online.io/PjI4w28BN5A8uWWACTPJ/v1/ktcb1-kitten-sitting-on-a-cat-tree',
    badges: badges.slice(1, 3),
    accuracy: 81,
    totalConstellations: 7,
    currentConstellation: {
      id: 'friend-current-constellation',
      name: 'Lyra',
      nameKorean: '거문고자리',
      description: '거문고자리는 북반구의 작은 별자리입니다.',
      totalDays: 6,
      stars: [
        {
          id: 'friend-current-star-1',
          day: 1,
          date: getDateString(5),
          position: { x: 50, y: 30 },
          brightness: 3,
          challenges: ['quiz', 'writing', 'prediction'],
          completed: true
        },
        {
          id: 'friend-current-star-2',
          day: 2,
          date: getDateString(4),
          position: { x: 55, y: 40 },
          brightness: 3,
          challenges: ['quiz', 'writing', 'prediction'],
          completed: true
        },
        {
          id: 'friend-current-star-3',
          day: 3,
          date: getDateString(3),
          position: { x: 45, y: 50 },
          brightness: 2,
          challenges: ['quiz', 'prediction'],
          completed: true
        },
        {
          id: 'friend-current-star-4',
          day: 4,
          date: getDateString(2),
          position: { x: 55, y: 60 },
          brightness: 3,
          challenges: ['quiz', 'writing', 'prediction'],
          completed: true
        },
        {
          id: 'friend-current-star-5',
          day: 5,
          date: getDateString(1),
          position: { x: 65, y: 50 },
          brightness: 1,
          challenges: ['writing'],
          completed: true
        },
        {
          id: 'friend-current-star-6',
          day: 6,
          date: getDateString(0),
          position: { x: 60, y: 40 },
          brightness: 0,
          challenges: [],
          completed: false
        }
      ],
      completed: false,
      startDate: getDateString(5),
      endDate: null,
      aborted: false
    },
    completedConstellations: [
      createCompletedConstellation('orion', 30, Array(12).fill(['quiz', 'prediction']))
    ],
    friends: ['user-1']
  }
];