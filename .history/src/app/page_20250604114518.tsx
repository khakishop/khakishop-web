'use client';
import { motion, useScroll, useTransform, useSpring, cubicBezier } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform values for the "Design Beyond Time" text animation with organic feel
  const rawY = useTransform(scrollYProgress, [0.1, 0.4], [0, -150]);
  
  const rawOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [1, 0.7, 0]);
  
  const rawScale = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [1, 0.98, 1.02, 0.95]);
  
  const rawSkew = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0, -1, 2]);

  // Add spring physics for natural movement
  const y = useSpring(rawY, { 
    damping: 25, 
    stiffness: 120,
    mass: 1.2
  });
  
  const opacity = useSpring(rawOpacity, { 
    damping: 20, 
    stiffness: 100 
  });
  
  const scale = useSpring(rawScale, { 
    damping: 15, 
    stiffness: 80 
  });
  
  const skewY = useSpring(rawSkew, { 
    damping: 30, 
    stiffness: 150 
  });

  // Add subtle randomized offset for organic feel
  const randomOffset = useTransform(scrollYProgress, (latest: number) => {
    return Math.sin(latest * 10) * 3; // Subtle wobble
  });

  const finalY = useTransform([y, randomOffset], ([yVal, offset]: [number, number]) => yVal + offset);

  return (
    <div className="bg-white">
      {/* Fixed Logo in Top-Left */}
      <div className="fixed top-8 left-8 z-50">
        <div className="text-black text-4xl md:text-5xl lg:text-6xl flex items-baseline">
          <span className="font-montserrat font-bold">khaki</span>
          <span className="font-dm-serif italic ml-2">shop</span>
        </div>
      </div>

      {/* Hero Section - Full Screen, No Top Offset */}
      <section ref={heroRef} className="relative h-screen -mt-16">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/hero.jpg")'
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Animated "Design Beyond Time" Headline with Organic Motion */}
        <motion.div
          style={{ 
            y: finalY, 
            opacity, 
            scale,
            skewY,
            transformOrigin: "bottom center"
          }}
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 p-8"
        >
          <h1 className="text-white font-bold text-[8vw] md:text-7xl lg:text-9xl leading-none tracking-tight text-center">
            Design Beyond Time
          </h1>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-5xl font-light text-center mb-16 tracking-tight">추천 제품</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light mb-2 tracking-wide">모던 다이닝 테이블</h3>
                <p className="text-gray-600 text-base">₩2,450,000</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light mb-2 tracking-wide">럭셔리 안락의자</h3>
                <p className="text-gray-600 text-base">₩1,890,000</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-light mb-2 tracking-wide">디자이너 수납장</h3>
                <p className="text-gray-600 text-base">₩3,120,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR PROJECTS Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/our-projects-bg.jpg")'
          }}
        ></div>
        
        {/* Dark Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.1, 0.25, 1] 
            }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <Link 
              href="/projects"
              className="inline-block"
            >
              <div className="border-[1px] border-white text-white rounded-full px-8 py-4 text-sm sm:text-base font-light tracking-wide uppercase transition-all duration-300 ease-in-out hover:bg-white hover:text-black flex justify-between items-center gap-4">
                <span>OUR PROJECTS</span>
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-light mb-12 tracking-tight">완벽함을 위한 장인정신</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            30년이 넘는 세월 동안, 우리는 시간이 흘러도 변치 않는 가구를 만들어왔습니다. 
            모든 제품은 전통적인 기법과 현대적인 디자인 감각을 조화롭게 결합하여 세심하게 제작됩니다.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            품질에 대한 우리의 헌신과 디테일에 대한 관심은 모든 제품이 
            여러 세대에 걸쳐 소중한 가정의 일부가 될 수 있도록 보장합니다.
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
            <div key={i} className="flex items-baseline mx-8 text-xl md:text-2xl lg:text-3xl">
              <span className="font-montserrat font-bold">khaki</span>
              <span className="font-dm-serif italic ml-2">shop</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
} 