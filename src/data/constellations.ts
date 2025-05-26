import { ConstellationTemplate } from '../types';

export const constellationTemplates: ConstellationTemplate[] = [
  {
    id: 'cancer',
    name: 'Cancer',
    nameKorean: '게자리',
    description: '게자리는 황도대의 네 번째 별자리로, 5일간의 도전으로 완성할 수 있습니다.',
    totalDays: 5,
    difficulty: 'easy',
    image: '/images/cancer.png',
    starPositions: [
      { x: 15, y: 30 }, // Gamma Cancri (왼쪽)
      { x: 20, y: 25 }, // Beta Cancri
      { x: 25, y: 30 }, // Delta Cancri (중앙)
      { x: 20, y: 35 }, // Iota Cancri
      { x: 20, y: 40 }, // Zeta Cancri (아래)
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
      { x: 55, y: 20 }, // Polaris (북극성)
      { x: 60, y: 25 }, // Kochab
      { x: 65, y: 30 }, // Pherkad
      { x: 70, y: 35 }, // Yildun
      { x: 65, y: 40 }, // Epsilon
      { x: 60, y: 45 }, // Zeta
      { x: 55, y: 50 }, // Eta (꼬리 끝)
    ],
  },
  {
    id: 'orion',
    name: 'Orion',
    nameKorean: '오리온자리',
    description: '오리온자리는 겨울철 밤하늘에서 가장 쉽게 찾을 수 있는 별자리로, 7일간의 도전으로 완성할 수 있습니다.',
    totalDays: 7,
    difficulty: 'hard',
    image: '/images/orion.png',
    starPositions: [
      { x: 30, y: 65 }, // Betelgeuse (왼쪽 어깨)
      { x: 35, y: 75 }, // Alnilam (벨트 중간)
      { x: 32, y: 75 }, // Alnitak (벨트 왼쪽)
      { x: 38, y: 75 }, // Mintaka (벨트 오른쪽)
      { x: 40, y: 65 }, // Bellatrix (오른쪽 어깨)
      { x: 30, y: 85 }, // Saiph (왼쪽 다리)
      { x: 40, y: 85 }, // Rigel (오른쪽 다리)
    ],
  },
];


export const getConstellationTemplate = (id: string): ConstellationTemplate | undefined => {
  return constellationTemplates.find(template => template.id === id);
};