'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  // 페이지 애니메이션 variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const heroVariants = {
    initial: { 
      opacity: 0, 
      y: 50 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut"
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
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const coreValues = [
    {
      title: "개성",
      subtitle: "Personality",
      description: "고객만의 독특한 취향과 라이프스타일을 반영한 맞춤형 텍스타일 솔루션을 제공합니다."
    },
    {
      title: "감성",
      subtitle: "Emotion",
      description: "공간에 따뜻함과 아름다움을 더하는 감성적 디자인으로 일상의 특별함을 만들어갑니다."
    },
    {
      title: "신뢰성",
      subtitle: "Reliability",
      description: "오랜 경험과 전문성을 바탕으로 고품질의 제품과 완벽한 시공 서비스를 약속드립니다."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Hero 섹션 - RIGAS 스타일 */}
        <section className="py-24 lg:py-32">
          <div className="max-w-screen-xl mx-auto px-6">
            <motion.div 
              variants={heroVariants}
              className="text-center space-y-8"
            >
              {/* 메인 브랜드 타이틀 */}
              <h1 className="text-6xl lg:text-8xl font-serif tracking-tight text-gray-900">
                khaki shop
              </h1>
              
              {/* 서브 타이틀 */}
              <p className="text-xl lg:text-2xl text-gray-600 font-light tracking-wide">
                Creative Fabrics for Inspired Living
              </p>
            </motion.div>
          </div>
        </section>

        {/* 브랜드 소개 섹션 */}
        <section className="py-20 lg:py-24">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-12">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900">
                About Our Brand
              </h2>
              
              <div className="space-y-8">
                <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed">
                  카키샵은 공간을 아름답게 만드는 텍스타일 브랜드입니다.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  우리는 단순히 커튼이나 블라인드를 판매하는 것이 아닙니다. 
                  각각의 공간이 가진 고유한 특성과 거주자의 라이프스타일을 깊이 이해하여, 
                  그에 맞는 최적의 텍스타일 솔루션을 제공합니다.
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  정교한 디자인과 뛰어난 품질, 그리고 전문적인 시공을 통해 
                  고객의 공간을 더욱 특별하고 아름답게 만드는 것이 우리의 사명입니다.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 브랜드 핵심 가치 섹션 */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-screen-xl mx-auto px-6">
            <motion.div variants={itemVariants} className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900 mb-6">
                Our Core Values
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                카키샵이 추구하는 세 가지 핵심 가치를 통해 고객에게 최상의 경험을 제공합니다.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
              {coreValues.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center space-y-6"
                >
                  <div className="space-y-3">
                    <h3 className="text-2xl lg:text-3xl font-serif tracking-tight text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-500 uppercase tracking-widest">
                      {value.subtitle}
                    </p>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 브랜드 철학 섹션 */}
        <section className="py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-12">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900">
                Our Philosophy
              </h2>
              
              <div className="space-y-8">
                <p className="text-xl lg:text-2xl text-gray-600 font-light italic leading-relaxed">
                  "공간은 단순한 물리적 영역이 아닙니다. 
                  그곳은 삶이 펼쳐지고, 추억이 만들어지며, 
                  꿈이 자라나는 무대입니다."
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed">
                  카키샵은 이러한 철학을 바탕으로 텍스타일을 통해 공간의 가능성을 극대화하고, 
                  고객의 일상에 더 많은 아름다움과 편안함을 가져다주고자 합니다.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA 섹션 - RIGAS 스타일 */}
        <section className="py-20 lg:py-24 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-white">
                함께 만들어가요
              </h2>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                당신의 공간이 가진 무한한 가능성을 카키샵과 함께 발견해보세요. 
                전문 컨설턴트가 맞춤형 솔루션을 제안해드립니다.
              </p>
              
              <div className="pt-6">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                  상담 시작하기
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
} 