'use client';
import { motion, useScroll, useTransform, useSpring, cubicBezier } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { AccordionItem } from '@/components/AccordionItem';

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
            backgroundImage: 'url("/images/hero/hero.jpg")'
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
          className="absolute bottom-0 left-0 w-full flex justify-center z-10 pb-12"
        >
          <h1 className="text-white text-[8vw] font-bold tracking-tight leading-none whitespace-nowrap">
            Design Beyond Time
          </h1>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-16 tracking-tight text-gray-800">오늘의 공간을 위한 제안</h2>
          
          <div className="space-y-6">
            {/* Curtain Accordion */}
            <AccordionItem
              title="Curtain"
              image="/images/references/curtain-modern-livingroom-1.png"
              alt="Modern curtain in a contemporary living room setting"
              description="자연스러운 드레이프와 부드러운 질감으로 공간에 따뜻함을 더합니다. 빛의 양을 조절하며 하루의 리듬에 맞춰 분위기를 연출해보세요."
            />
            
            {/* Blind Accordion */}
            <AccordionItem
              title="Blind"
              image="/images/references/blind-minimal-bedroom-1.png"
              alt="Minimal blind design in a serene bedroom"
              description="깔끔한 라인과 정확한 빛 조절로 미니멀한 공간을 완성합니다. 간결함 속에서 찾는 편안함과 기능성의 조화를 경험하세요."
            />
            
            {/* Motorized System Accordion */}
            <AccordionItem
              title="Motorized System"
              image="/images/references/motorized-smart-livingroom-1.png"
              alt="Smart motorized blind system in modern living room"
              description="터치 하나로 완성되는 스마트한 일상. 시간에 따라 자동으로 조절되는 빛으로 더욱 편리하고 세련된 공간을 만들어보세요."
            />
          </div>
        </div>
      </section>

      {/* OUR PROJECTS Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/projects/our-projects-bg.jpg")'
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
          <h2 className="text-5xl font-light mb-12 tracking-tight">시간이 지나도 빛나는 공간을 위해</h2>
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            우리는 단순한 창을 넘어
            하루의 분위기를 바꾸는 커튼과 패브릭을 고민해왔습니다.
            전통적인 기술과 현대적인 감각을 조화롭게 담아,
            빛과 공간의 흐름에 어울리는 직물만을 세심히 제안합니다.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            khaki shop은 일상 속에 자연스럽게 스며드는
            조용한 변화와 감각적인 여백을 만들어갑니다.
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