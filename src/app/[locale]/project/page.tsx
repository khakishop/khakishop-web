'use client';

import React from 'react';
import { motion } from 'framer-motion';
import CategoryPage from '../../../components/layouts/CategoryPage';
import ReferenceCard, { ReferenceCardProps } from '../../../components/ReferenceCard';

export default function ProjectPage() {
  // 프로젝트 레퍼런스 데이터 (기존 references 데이터 활용)
  const projectReferences: ReferenceCardProps[] = [
    {
      title: '모던 오피스 인테리어',
      location: '서울 강남구',
      href: '/project/modern-office-gangnam',
      // thumbnail: '/images/references/modern-office-1.jpg'
    },
    {
      title: '미니멀 레지던스',
      location: '경기도 분당구',
      href: '/project/minimal-residence-bundang',
      // thumbnail: '/images/references/minimal-residence-1.jpg'
    },
    {
      title: '클래식 카페 인테리어',
      location: '서울 홍대',
      href: '/project/classic-cafe-hongdae',
      // thumbnail: '/images/references/classic-cafe-1.jpg'
    },
    {
      title: '컨템포러리 하우스',
      location: '경기도 고양시',
      href: '/project/contemporary-house-goyang',
      // thumbnail: '/images/references/contemporary-house-1.jpg'
    },
    {
      title: '스칸디나비안 아파트',
      location: '서울 마포구',
      href: '/project/scandinavian-apartment-mapo',
      // thumbnail: '/images/references/scandinavian-apt-1.jpg'
    },
    {
      title: '인더스트리얼 로비',
      location: '서울 용산구',
      href: '/project/industrial-lobby-yongsan',
      // thumbnail: '/images/references/industrial-lobby-1.jpg'
    },
    {
      title: '럭셔리 펜트하우스',
      location: '서울 서초구',
      href: '/project/luxury-penthouse-seocho',
      // thumbnail: '/images/references/luxury-penthouse-1.jpg'
    },
    {
      title: '모던 클리닉',
      location: '경기도 성남시',
      href: '/project/modern-clinic-seongnam',
      // thumbnail: '/images/references/modern-clinic-1.jpg'
    },
    {
      title: '아트 갤러리',
      location: '서울 종로구',
      href: '/project/art-gallery-jongno',
      // thumbnail: '/images/references/art-gallery-1.jpg'
    },
  ];

  // 애니메이션 variants
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    initial: { 
      opacity: 0, 
      y: 30 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <CategoryPage
      title="Project References"
      description="공간에 생기를 더한 khaki shop의 실제 시공 사례를 소개합니다."
    >
      {/* 프로젝트 그리드 - RIGAS 스타일 */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-20"
      >
        {projectReferences.map((project, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
          >
            <ReferenceCard
              title={project.title}
              location={project.location}
              thumbnail={project.thumbnail}
              href={project.href}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* 하단 CTA 섹션 - RIGAS 스타일 */}
      <motion.div
        variants={itemVariants}
        className="text-center space-y-8 py-16 lg:py-20"
      >
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900">
            당신의 프로젝트를 시작하세요
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            고객의 꿈과 우리의 전문성이 만나 특별한 공간을 만들어갑니다.<br />
            지금 바로 전문가와 상담을 시작해보세요.
          </p>
          <div className="pt-4">
            <button className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
              프로젝트 상담하기
            </button>
          </div>
        </div>
      </motion.div>
    </CategoryPage>
  );
} 