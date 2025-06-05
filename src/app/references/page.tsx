'use client';

import React from 'react';
import ReferenceCard, { ReferenceCardProps } from '../../components/ReferenceCard';

// References 페이지 컴포넌트
export default function ReferencesPage() {
  // 샘플 레퍼런스 데이터
  const references: ReferenceCardProps[] = [
    {
      title: '모던 오피스 인테리어',
      location: '서울 강남구',
      href: '/references/modern-office-gangnam',
      // thumbnail: '/images/references/modern-office-1.jpg'
    },
    {
      title: '미니멀 레지던스',
      location: '경기도 분당구',
      href: '/references/minimal-residence-bundang',
      // thumbnail: '/images/references/minimal-residence-1.jpg'
    },
    {
      title: '클래식 카페 인테리어',
      location: '서울 홍대',
      href: '/references/classic-cafe-hongdae',
      // thumbnail: '/images/references/classic-cafe-1.jpg'
    },
    {
      title: '컨템포러리 하우스',
      location: '경기도 고양시',
      href: '/references/contemporary-house-goyang',
      // thumbnail: '/images/references/contemporary-house-1.jpg'
    },
    {
      title: '스칸디나비안 아파트',
      location: '서울 마포구',
      href: '/references/scandinavian-apartment-mapo',
      // thumbnail: '/images/references/scandinavian-apt-1.jpg'
    },
    {
      title: '인더스트리얼 로비',
      location: '서울 용산구',
      href: '/references/industrial-lobby-yongsan',
      // thumbnail: '/images/references/industrial-lobby-1.jpg'
    },
    {
      title: '럭셔리 펜트하우스',
      location: '서울 서초구',
      href: '/references/luxury-penthouse-seocho',
      // thumbnail: '/images/references/luxury-penthouse-1.jpg'
    },
    {
      title: '모던 클리닉',
      location: '경기도 성남시',
      href: '/references/modern-clinic-seongnam',
      // thumbnail: '/images/references/modern-clinic-1.jpg'
    },
    {
      title: '아트 갤러리',
      location: '서울 종로구',
      href: '/references/art-gallery-jongno',
      // thumbnail: '/images/references/art-gallery-1.jpg'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              References
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              우리가 완성한 공간들의 이야기를 만나보세요. 각각의 프로젝트는 고객의 꿈과 우리의 전문성이 만나 탄생한 특별한 공간입니다.
            </p>
          </div>
        </div>
      </div>

      {/* 레퍼런스 그리드 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {references.map((reference, index) => (
            <ReferenceCard
              key={index}
              title={reference.title}
              location={reference.location}
              thumbnail={reference.thumbnail}
              href={reference.href}
            />
          ))}
        </div>
      </div>

      {/* 추가 콘텐츠 섹션 */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              더 많은 프로젝트가 궁금하신가요?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              상담을 통해 더 많은 포트폴리오와 맞춤형 제안을 받아보세요.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
              상담 문의하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 