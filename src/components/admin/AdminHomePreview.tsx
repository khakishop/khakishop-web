'use client';

import Image from 'next/image';
import { memo, useCallback, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from '../../lib/motion';
import { AnimatedText } from '../AnimatedText';
import HeroSection from '../HeroSection';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  onImageChange: (newSrc: string) => void;
  imageKey: string;
  priority?: boolean;
  quality?: number;
}

const EditableImage: React.FC<EditableImageProps> = ({
  src,
  alt,
  className,
  onImageChange,
  imageKey,
  priority = false,
  quality = 85
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('imageKey', imageKey);

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          onImageChange(result.imagePath);

          // 실시간 동기화를 위한 이벤트 발생
          window.dispatchEvent(new CustomEvent('imageUpdated', {
            detail: { imageKey, newPath: result.imagePath }
          }));

          // 홈페이지 캐시 무효화 및 동기화
          await fetch('/api/admin/sync-homepage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageKey, newPath: result.imagePath })
          });

          // 성공 알림
          showNotification('이미지가 성공적으로 업데이트되었습니다!', 'success');
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        showNotification('이미지 업로드에 실패했습니다.', 'error');
      }
    }
  }, [imageKey, onImageChange]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageKey', imageKey);

        const response = await fetch('/api/admin/upload-image', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.success) {
          onImageChange(result.imagePath);

          // 실시간 동기화
          window.dispatchEvent(new CustomEvent('imageUpdated', {
            detail: { imageKey, newPath: result.imagePath }
          }));

          // 홈페이지 캐시 무효화 및 동기화
          await fetch('/api/admin/sync-homepage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageKey, newPath: result.imagePath })
          });

          // 성공 알림
          showNotification('이미지가 성공적으로 업데이트되었습니다!', 'success');
        }
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        showNotification('이미지 업로드에 실패했습니다.', 'error');
      }
    }
  }, [imageKey, onImageChange]);

  // 알림 표시 함수
  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-[110] px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`${className} transition-all duration-300 ${isDragOver ? 'opacity-50' : ''}`}
        priority={priority}
        quality={quality}
      />

      {/* 편집 오버레이 */}
      {(isHovered || isDragOver) && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 transition-all duration-300">
          <div className="text-center text-white">
            <div className="mb-2">
              <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium mb-2">이미지 편집</p>
            <p className="text-xs opacity-80 mb-3">드래그 앤 드롭 또는 클릭하여 변경</p>
            <label className="cursor-pointer bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs transition-colors">
              파일 선택
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* 드래그 오버 표시 */}
      {isDragOver && (
        <div className="absolute inset-0 border-4 border-dashed border-blue-400 bg-blue-100/20 z-20 flex items-center justify-center">
          <div className="text-blue-600 text-center">
            <div className="text-2xl mb-2">📁</div>
            <p className="font-medium">여기에 이미지를 놓으세요</p>
          </div>
        </div>
      )}
    </div>
  );
};

interface AdminHomePreviewProps {
  onImageUpdate?: (imageKey: string, newPath: string) => void;
}

const AdminHomePreview = memo(function AdminHomePreview({ onImageUpdate }: AdminHomePreviewProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // 이미지 상태 관리
  const [images, setImages] = useState({
    hero: '/images/hero/hero.jpg',
    curtain: '/images/references/curtain-modern-livingroom-1.png',
    blind: '/images/references/blind-minimal-bedroom-1.png',
    motorized: '/images/references/motorized-smart-livingroom-1.png',
    projects: '/images/projects/our-projects-bg.jpg'
  });

  // Transform values for animations
  const rawY = useTransform(scrollYProgress, [0.1, 0.4], [0, -150]);
  const rawOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [1, 0.7, 0]);
  const rawScale = useTransform(scrollYProgress, [0.1, 0.2, 0.3, 0.4], [1, 0.98, 1.02, 0.95]);
  const rawSkew = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0, -1, 2]);

  const y = useSpring(rawY, { damping: 25, stiffness: 120, mass: 1.2 });
  const opacity = useSpring(rawOpacity, { damping: 20, stiffness: 100 });
  const scale = useSpring(rawScale, { damping: 15, stiffness: 80 });
  const skewY = useSpring(rawSkew, { damping: 30, stiffness: 150 });

  const randomOffset = useTransform(scrollYProgress, (latest: number) => {
    return Math.sin(latest * 10) * 3;
  });

  const finalY = useTransform([y, randomOffset], ([yVal, offset]: [number, number]) => yVal + offset);

  const handleImageChange = useCallback((imageKey: string, newPath: string) => {
    setImages(prev => ({ ...prev, [imageKey]: newPath }));
    onImageUpdate?.(imageKey, newPath);
  }, [onImageUpdate]);

  return (
    <div className="bg-white">
      {/* 관리자 헤더 */}
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-2 z-[100] text-sm font-medium">
        🔧 관리자 모드 - 이미지 영역에 마우스를 올려 편집하세요
      </div>

      {/* Fixed Logo in Top-Left */}
      <div className="fixed top-16 left-8 z-50">
        <div className="text-black text-3xl md:text-4xl lg:text-5xl xl:text-6xl flex items-baseline">
          <span className="font-montserrat font-bold">khaki</span>
          <span className="font-dm-serif italic ml-2">shop</span>
        </div>
      </div>

      {/* 첫 번째: 풀스크린 이미지 섹션 */}
      <section ref={heroRef} className="relative h-screen mt-12">
        {/* Background Image - 편집 가능 */}
        <div className="absolute inset-0">
          <EditableImage
            src={images.hero}
            alt="Hero background"
            className="object-cover"
            onImageChange={(newSrc) => handleImageChange('hero', newSrc)}
            imageKey="hero"
            priority
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Animated "Design Beyond Time" Headline */}
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
            {/* Curtain Section - 편집 가능 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                <div className="aspect-[16/9] relative">
                  <EditableImage
                    src={images.curtain}
                    alt="Modern linen curtain in contemporary living room"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onImageChange={(newSrc) => handleImageChange('curtain', newSrc)}
                    imageKey="curtain"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-light mb-3 tracking-wide">Curtain</h3>
                  <p className="text-lg opacity-90 mb-4">은은한 빛을 담아내는 모던 린넨 커튼</p>
                  <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                    바로 보기 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Blind Section - 편집 가능 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                <div className="aspect-[16/9] relative">
                  <EditableImage
                    src={images.blind}
                    alt="Minimal blind design in serene bedroom"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onImageChange={(newSrc) => handleImageChange('blind', newSrc)}
                    imageKey="blind"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-light mb-3 tracking-wide">Blind</h3>
                  <p className="text-lg opacity-90 mb-4">정돈된 공간을 완성하는 블라인드</p>
                  <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                    바로 보기 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Motorized System Section - 편집 가능 */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group cursor-pointer relative z-20"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-500">
                <div className="aspect-[16/9] relative">
                  <EditableImage
                    src={images.motorized}
                    alt="Smart motorized system in modern living room"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onImageChange={(newSrc) => handleImageChange('motorized', newSrc)}
                    imageKey="motorized"
                    quality={85}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-500"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h3 className="text-3xl font-light mb-3 tracking-wide">Motorized System</h3>
                  <p className="text-lg opacity-90 mb-4">스마트하게 완성되는 전동 시스템</p>
                  <span className="inline-flex items-center text-sm uppercase tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
                    바로 보기 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR PROJECTS Section - 편집 가능 */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <EditableImage
            src={images.projects}
            alt="Our projects background"
            className="object-cover"
            onImageChange={(newSrc) => handleImageChange('projects', newSrc)}
            imageKey="projects"
          />
        </div>

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative h-full flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center"
          >
            <div className="border-[1px] border-white text-white rounded-full px-8 py-4 text-sm sm:text-base font-light tracking-wide uppercase transition-all duration-300 ease-in-out hover:bg-white hover:text-black flex justify-between items-center gap-4">
              <span>OUR PROJECTS</span>
              <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
            </div>
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
            우리는 단순한 창을 넘어 하루의 분위기를 바꾸는 커튼과 패브릭을 고민해왔습니다.
            전통적인 기술과 현대적인 감각을 조화롭게 담아, 빛과 공간의 흐름에 어울리는 직물만을 세심히 제안합니다.
          </p>
          <p className="text-xl text-gray-600 leading-relaxed">
            khaki shop은 일상 속에 자연스럽게 스며드는 조용한 변화와 감각적인 여백을 만들어갑니다.
          </p>
        </div>
      </section>

      {/* Scrolling Marquee */}
      <div className="w-full bg-black text-white py-4 overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
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
  );
});

export default AdminHomePreview; 