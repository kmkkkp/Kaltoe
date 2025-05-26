import React from 'react';
import { ConstellationTemplate } from '../../types';
import { GlassCard } from '../ui/GlassCard';
import { Button } from '../ui/Button';

interface ConstellationSelectorProps {
  constellationTemplates: ConstellationTemplate[];
  onSelect: (templateId: string) => void;
}

export const ConstellationSelector: React.FC<ConstellationSelectorProps> = ({
  constellationTemplates,
  onSelect,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">새로운 별자리 도전</h2>
      <p className="text-indigo-200 text-center mb-6">
        도전하고 싶은 별자리를 선택하세요. 별자리마다 필요한 연속 일수가 다릅니다.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {constellationTemplates.map((template) => (
          <GlassCard 
            key={template.id}
            className="transition-all duration-300 hover:bg-white/20 cursor-pointer"
            onClick={() => onSelect(template.id)}
          >
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-white">{template.nameKorean}</h3>
                  <p className="text-indigo-300 text-sm">{template.name}</p>
                </div>
                <div className="bg-indigo-900/50 px-2 py-1 rounded-full text-xs">
                  {template.totalDays}일
                </div>
              </div>
              
              <p className="text-gray-300 text-sm mt-2 flex-grow">
                {template.description}
              </p>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="flex">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.difficulty === 'easy' ? 'bg-green-900/50 text-green-300' :
                    template.difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                    'bg-red-900/50 text-red-300'
                  }`}>
                    {template.difficulty === 'easy' ? '쉬움' :
                     template.difficulty === 'medium' ? '보통' : '어려움'}
                  </span>
                </div>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(template.id);
                  }}
                >
                  시작하기
                </Button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};