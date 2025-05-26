import { ConstellationTemplate } from '../types';

export const constellationTemplates: ConstellationTemplate[] = [
  {
    id: 'cancer',
    name: 'Cancer',
    nameKorean: '게자리',
    description: '게자리는 황도대의 네 번째 별자리로, 4일간의 도전으로 완성할 수 있습니다.',
    totalDays: 4,
    difficulty: 'easy',
    image: '/images/cancer.png',
    starPositions: [
      { x: 50, y: 30 },
      { x: 70, y: 40 },
      { x: 60, y: 60 },
      { x: 40, y: 50 },
    ],
  },
  {
    id: 'ursa-minor',
    name: 'Ursa Minor',
    nameKorean: '작은곰자리',
    description: '작은곰자리는 북극성을 포함하고 있으며, 7일간의 도전으로 완성할 수 있습니다.',
    totalDays: 7,
    difficulty: 'medium',
    image: '/images/ursa-minor.png',
    starPositions: [
      { x: 50, y: 20 },
      { x: 55, y: 30 },
      { x: 60, y: 40 },
      { x: 70, y: 45 },
      { x: 65, y: 55 },
      { x: 55, y: 60 },
      { x: 45, y: 65 },
    ],
  },
  {
    id: 'orion',
    name: 'Orion',
    nameKorean: '오리온자리',
    description: '오리온자리는 겨울철 밤하늘에서 가장 쉽게 찾을 수 있는 별자리로, 12일간의 도전으로 완성할 수 있습니다.',
    totalDays: 12,
    difficulty: 'hard',
    image: '/images/orion.png',
    starPositions: [
      { x: 50, y: 15 },
      { x: 60, y: 20 },
      { x: 40, y: 20 },
      { x: 65, y: 30 },
      { x: 35, y: 30 },
      { x: 50, y: 40 },
      { x: 50, y: 50 },
      { x: 50, y: 60 },
      { x: 65, y: 70 },
      { x: 35, y: 70 },
      { x: 70, y: 80 },
      { x: 30, y: 80 },
    ],
  },
];

export const getConstellationTemplate = (id: string): ConstellationTemplate | undefined => {
  return constellationTemplates.find(template => template.id === id);
};