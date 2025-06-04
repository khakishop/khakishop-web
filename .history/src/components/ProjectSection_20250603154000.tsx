'use client';

import React from "react";

// 프로젝트 카드 타입 정의
type ProjectCardProps = {
  title: string;
  description: string;
};

// 프로젝트 카드 컴포넌트
const ProjectCard = ({ title, description }: ProjectCardProps) => (
  <div className="bg-gray-100 rounded-lg p-6 hover:shadow-lg transition-shadow">
    {/* 이미지 플레이스홀더 */}
    <div className="bg-gray-300 w-full h-48 rounded-md mb-4"></div>
    <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// ProjectSection 컴포넌트: 최근 프로젝트 섹션
export default function ProjectSection() {
  // 프로젝트 데이터
  const projects = [
    {
      title: '모던 리빙룸 프로젝트',
      description: '미니멀한 디자인과 기능성을 결합한 현대적인 거실 공간 구성',
    },
    {
      title: '클래식 다이닝룸',
      description: '전통적인 요소와 현대적 감각이 어우러진 식사 공간',
    },
    {
      title: '컨템포러리 베드룸',
      description: '편안함과 스타일이 공존하는 침실 인테리어',
    },
  ];

  return (
    <section id="projects" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Our Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 