'use client';

import { useState } from 'react';
import { ProjectStage } from '../../data/projects';

interface MultiStageProjectEditorProps {
  stages?: {
    before?: ProjectStage;
    during?: ProjectStage;
    after?: ProjectStage;
  };
  onStagesChange: (stages: any) => void;
}

const STAGE_CONFIGS = {
  before: {
    title: 'Before',
    description: '시공 전 상태',
    icon: '📋',
    color: 'bg-red-50 border-red-200'
  },
  during: {
    title: 'During',
    description: '시공 진행 중',
    icon: '🔨',
    color: 'bg-yellow-50 border-yellow-200'
  },
  after: {
    title: 'After',
    description: '시공 완료 후',
    icon: '✨',
    color: 'bg-green-50 border-green-200'
  }
};

export default function MultiStageProjectEditor({
  stages = {},
  onStagesChange
}: MultiStageProjectEditorProps) {
  const [activeStage, setActiveStage] = useState<'before' | 'during' | 'after'>('before');

  const updateStage = (stageKey: string, updates: Partial<ProjectStage>) => {
    const currentStage = stages[stageKey as keyof typeof stages] || {
      title: '',
      description: '',
      images: [],
      details: [],
      challenges: [],
      solutions: []
    };

    const updatedStages = {
      ...stages,
      [stageKey]: {
        ...currentStage,
        ...updates
      }
    };

    onStagesChange(updatedStages);
  };

  const addImageToStage = (stageKey: string) => {
    const currentStage = stages[stageKey as keyof typeof stages];
    const newImage = prompt('이미지 URL을 입력하세요:');

    if (newImage && currentStage) {
      updateStage(stageKey, {
        images: [...(currentStage.images || []), newImage]
      });
    }
  };

  const removeImageFromStage = (stageKey: string, imageIndex: number) => {
    const currentStage = stages[stageKey as keyof typeof stages];

    if (currentStage) {
      const updatedImages = currentStage.images.filter((_, index) => index !== imageIndex);
      updateStage(stageKey, { images: updatedImages });
    }
  };

  const addDetailToStage = (stageKey: string, type: 'details' | 'challenges' | 'solutions') => {
    const currentStage = stages[stageKey as keyof typeof stages];
    const newDetail = prompt(`새로운 ${type === 'details' ? '세부사항' : type === 'challenges' ? '과제' : '해결책'}을 입력하세요:`);

    if (newDetail && currentStage) {
      updateStage(stageKey, {
        [type]: [...(currentStage[type] || []), newDetail]
      });
    }
  };

  const currentStageData = stages[activeStage] || {
    title: '',
    description: '',
    images: [],
    details: [],
    challenges: [],
    solutions: []
  };

  return (
    <div className="space-y-6">
      {/* Stage Navigation */}
      <div className="flex space-x-2">
        {Object.entries(STAGE_CONFIGS).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveStage(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${activeStage === key
                ? `${config.color} border-opacity-100`
                : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
          >
            <span className="text-xl">{config.icon}</span>
            <div className="text-left">
              <div className="font-medium text-sm">{config.title}</div>
              <div className="text-xs text-gray-600">{config.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Stage Content Editor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-6">
          {/* Stage Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {STAGE_CONFIGS[activeStage].title} 제목
            </label>
            <input
              type="text"
              value={currentStageData.title}
              onChange={(e) => updateStage(activeStage, { title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`${STAGE_CONFIGS[activeStage].title} 단계의 제목을 입력하세요`}
            />
          </div>

          {/* Stage Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {STAGE_CONFIGS[activeStage].title} 설명
            </label>
            <textarea
              value={currentStageData.description}
              onChange={(e) => updateStage(activeStage, { description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`${STAGE_CONFIGS[activeStage].title} 단계에 대한 설명을 입력하세요`}
            />
          </div>

          {/* Stage Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                {STAGE_CONFIGS[activeStage].title} 이미지
              </label>
              <button
                onClick={() => addImageToStage(activeStage)}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                이미지 추가
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {currentStageData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`${STAGE_CONFIGS[activeStage].title} 이미지 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImageFromStage(activeStage, index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Details, Challenges, Solutions */}
          <div className="grid md:grid-cols-3 gap-6">
            {['details', 'challenges', 'solutions'].map((type) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    {type === 'details' ? '세부사항' : type === 'challenges' ? '과제' : '해결책'}
                  </label>
                  <button
                    onClick={() => addDetailToStage(activeStage, type as any)}
                    className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    추가
                  </button>
                </div>

                <div className="space-y-2">
                  {(currentStageData[type as keyof ProjectStage] as string[] || []).map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="flex-1 text-sm p-2 bg-gray-50 rounded border">
                        {item}
                      </span>
                      <button
                        onClick={() => {
                          const currentItems = currentStageData[type as keyof ProjectStage] as string[] || [];
                          const updatedItems = currentItems.filter((_, i) => i !== index);
                          updateStage(activeStage, { [type]: updatedItems });
                        }}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stage Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">단계별 진행 상황</h4>
        <div className="flex space-x-4 text-sm">
          {Object.entries(STAGE_CONFIGS).map(([key, config]) => {
            const stageData = stages[key as keyof typeof stages];
            const hasContent = stageData && (stageData.title || stageData.description || stageData.images.length > 0);

            return (
              <div key={key} className="flex items-center space-x-2">
                <span className="text-lg">{config.icon}</span>
                <span className={`font-medium ${hasContent ? 'text-green-600' : 'text-gray-400'}`}>
                  {config.title}
                </span>
                {hasContent && (
                  <span className="text-green-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 