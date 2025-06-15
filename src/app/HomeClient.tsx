'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';
import { AnimatedText } from '../components/AnimatedText';
import HeroSection from '../components/HeroSection';
import { LocalizedLink } from '../components/ui/LocalizedLink';
import { motion, useScroll, useSpring, useTransform } from '../lib/motion';

const HomeClient = memo(function HomeClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const params = useParams();
  const locale = params?.locale as string || 'ko';

  // 이미지 상태 관리 (실시간 업데이트를 위해)
  const [images, setImages] = useState({
    hero: '/images/hero/hero.jpg',
    curtain: '/images/references/curtain-modern-livingroom-1.png',
    blind: '/images/references/blind-minimal-bedroom-1.png',
    motorized: '/images/references/motorized-smart-livingroom-1.png'
  });

  // 실시간 이미지 업데이트 감지
  useEffect(() => {
    const handleImageUpdate = (event: CustomEvent) => {
      const { imageKey, newPath } = event.detail;
      console.log(`🔄 홈페이지 이미지 실시간 업데이트: ${imageKey} -> ${newPath}`);

      setImages(prev => ({
        ...prev,
        [imageKey]: newPath
      }));
    };

    window.addEventListener('imageUpdated', handleImageUpdate as EventListener);

    return () => {
      window.removeEventListener('imageUpdated', handleImageUpdate as EventListener);
    };
  }, []);

  // Transform values for the "Design Beyond Time" text animation with organic feel
  const rawY = useTransform(scrollYProgress, [0.1, 0.4], [0, -150]);

  const rawOpacity = useTransform(
    scrollYProgress,
    [0.1, 0.25, 0.4],
    [1, 0.7, 0]
  );

  const rawScale = useTransform(
    scrollYProgress,
    [0.1, 0.2, 0.3, 0.4],
    [1, 0.98, 1.02, 0.95]
  );

  const rawSkew = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0, -1, 2]);

  // Add spring physics for natural movement
  const y = useSpring(rawY, {
    damping: 25,
    stiffness: 120,
    mass: 1.2,
  });

  const opacity = useSpring(rawOpacity, {
    damping: 20,
    stiffness: 100,
  });

  const scale = useSpring(rawScale, {
    damping: 15,
    stiffness: 80,
  });

  const skewY = useSpring(rawSkew, {
    damping: 30,
    stiffness: 150,
  });

  // Add subtle randomized offset for organic feel
  const randomOffset = useTransform(scrollYProgress, (latest: number) => {
    return Math.sin(latest * 10) * 3; // Subtle wobble
  });

  const finalY = useTransform(
    [y, randomOffset],
    ([yVal, offset]: [number, number]) => yVal + offset
  );

  return (
    <div className="bg-white">
      {/* Fixed Logo in Top-Left - 모바일에서 20% 작게 */}
      <div className="fixed top-8 left-8 z-50">
        <div className="text-black text-3xl md:text-4xl lg:text-5xl xl:text-6xl flex items-baseline">
          <span className="font-montserrat font-bold">khaki</span>
          <span className="font-dm-serif italic ml-2">shop</span>
        </div>
      </div>

      {/* 첫 번째: 풀스크린 이미지 섹션 - Full Screen, No Top Offset */}
      <section ref={heroRef} className="relative h-screen">
        {/* Background Image - 실시간 업데이트 */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url("${images.hero}")`,
          }}
        ></div>

        {/* Overlay - 밝게 수정 */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated "Design Beyond Time" Headline with Letter-by-Letter Animation - 모바일에서 화면 중앙으로 */}
        <motion.div
          style={{
            y: finalY,
            opacity,
            scale,
            skewY,
            transformOrigin: 'bottom center',
          }}
          className="absolute bottom-[60vh] md:bottom-12 left-0 w-full flex justify-center z-10"
        >
          <AnimatedText
            text="Design Beyond Time"
            className="text-white text-[8vw] font-bold tracking-tight leading-none whitespace-nowrap"
            delay={0.5}
          />
        </motion.div>
      </section>

      {/* 두 번째: 브랜드 소개 Hero 섹션 */}
      <HeroSection />

      {/* Today's Space Suggestions */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-20 tracking-tight text-gray-800">
            오늘의 공간을 위한 제안
          </h2>

          <div className="space-y-32">
            {/* Curtain Section - 실시간 업데이트 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
              style={{ pointerEvents: 'auto' }}
            >
              <LocalizedLink href="/curtain" className="block relative z-30">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={images.curtain}
                      alt="Modern linen curtain in contemporary living room"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={false}
                      quality={85}
                      key={images.curtain} // 강제 리렌더링을 위한 key
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-light mb-3 tracking-wide">
                      Curtain
                    </h3>
                    <p className="text-lg opacity-90 mb-4">
                      은은한 빛을 담아내는 모던 린넨 커튼
                    </p>
                    <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                      바로 보기{' '}
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </LocalizedLink>
            </motion.div>

            {/* Blind Section - 실시간 업데이트 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.1,
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
              style={{ pointerEvents: 'auto' }}
            >
              <LocalizedLink href="/blind" className="block relative z-30">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={images.blind}
                      alt="Minimal blind design in serene bedroom"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={false}
                      quality={85}
                      key={images.blind} // 강제 리렌더링을 위한 key
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-light mb-3 tracking-wide">
                      Blind
                    </h3>
                    <p className="text-lg opacity-90 mb-4">
                      정돈된 공간을 완성하는 블라인드
                    </p>
                    <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                      바로 보기{' '}
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </LocalizedLink>
            </motion.div>

            {/* Motorized System Section - 실시간 업데이트 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.2,
              }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
              style={{ pointerEvents: 'auto' }}
            >
              <LocalizedLink href="/motorized" className="block relative z-30">
                <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={images.motorized}
                      alt="Smart motorized system in modern living room"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority={false}
                      quality={85}
                      key={images.motorized} // 강제 리렌더링을 위한 key
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-3xl font-light mb-3 tracking-wide">
                      Motorized System
                    </h3>
                    <p className="text-lg opacity-90 mb-4">
                      스마트하게 완성되는 전동 시스템
                    </p>
                    <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                      바로 보기{' '}
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </LocalizedLink>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PROJECTS Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/projects/our-projects-bg.jpg")',
          }}
        ></div>

        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
            style={{ pointerEvents: 'auto' }}
          >
            <LocalizedLink href="/project" className="inline-block relative z-30">
              <div className="border-[1px] border-white text-white rounded-full px-8 py-4 text-sm sm:text-base font-light tracking-wide uppercase transition-all duration-300 ease-in-out hover:bg-white hover:text-black flex justify-between items-center gap-4">
                <span>OUR PROJECTS</span>
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
              </div>
            </LocalizedLink>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-light mb-12 tracking-tight">
            시간이 지나도 빛나는 공간을 위해
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            우리는 단순한 창을 넘어 하루의 분위기를 바꾸는 커튼과 패브릭을
            고민해왔습니다. 전통적인 기술과 현대적인 감각을 조화롭게 담아, 빛과
            공간의 흐름에 어울리는 직물만을 세심히 제안합니다.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            khaki shop은 일상 속에 자연스럽게 스며드는 조용한 변화와 감각적인
            여백을 만들어갑니다.
          </p>
        </div>
      </section>

      {/* Scrolling Marquee - Moved to after footer */}
      <div className="w-full bg-black text-white py-4 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-100%'] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex whitespace-nowrap"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="flex items-baseline mx-8 text-xl md:text-2xl lg:text-3xl"
            >
              <span className="font-montserrat font-bold">khaki</span>
              <span className="font-dm-serif italic ml-2">shop</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
});

export default HomeClient;
