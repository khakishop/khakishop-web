'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import HomeButton from '../../../components/ui/HomeButton';
import { getAllReferenceProducts } from '../../../data/references';

export default function ReferencesPageClient() {
  console.log('🚀 ReferencesPageClient 시작 - 정적 모드');

  // 🔧 Static data loading - no React state
  const initialReferences = getAllReferenceProducts();
  const [references, setReferences] = useState(initialReferences);
  const [dragOverCard, setDragOverCard] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  console.log('📦 레퍼런스 데이터 정적 로드:', references);
  console.log('📦 데이터 개수:', references.length);

  // 🎯 드래그 앤 드롭 핸들러들 - 강화된 버전
  const handleDragEnter = useCallback((e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 handleDragEnter 호출됨:', cardId);
    setDragOverCard(cardId);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 handleDragOver 호출됨:', cardId, {
      dataTransfer: e.dataTransfer,
      types: e.dataTransfer?.types,
      files: e.dataTransfer?.files?.length
    });

    // 드래그 효과 설정
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }

    setDragOverCard(cardId);
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 handleDragLeave 호출됨:', cardId);

    // 실제로 카드 영역을 벗어났는지 확인
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      console.log('🎯 카드 영역 벗어남 - dragOver 해제');
      setDragOverCard(null);
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('🎯 handleDrop 호출됨:', cardId, {
      dataTransfer: e.dataTransfer,
      files: e.dataTransfer?.files,
      filesLength: e.dataTransfer?.files?.length
    });

    setDragOverCard(null);
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    console.log('📁 드롭된 파일들:', files);

    if (files.length === 0) {
      console.warn('⚠️ 드롭된 파일이 없습니다.');
      alert('파일이 감지되지 않았습니다. 이미지 파일을 드래그해주세요.');
      return;
    }

    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      console.warn('⚠️ 이미지 파일이 아닙니다:', files.map(f => f.type));
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    console.log('✅ 이미지 파일 감지:', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    try {
      // 🔄 이미지를 Base64로 변환하여 즉시 미리보기
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target?.result as string;
        console.log('✅ 이미지 로드 완료, 상태 업데이트 중...');

        // 해당 카드의 이미지 업데이트
        setReferences(prev => prev.map(ref =>
          ref.id === cardId
            ? { ...ref, image: newImageUrl }
            : ref
        ));

        // 성공 알림
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 z-[100] bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300';
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <span class="text-lg">✅</span>
            <div>
              <div class="font-medium">이미지 교체 완료!</div>
              <div class="text-sm opacity-90">${imageFile.name}</div>
            </div>
          </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.style.opacity = '0';
          setTimeout(() => {
            if (document.body.contains(notification)) {
              document.body.removeChild(notification);
            }
          }, 300);
        }, 3000);
      };

      reader.onerror = (error) => {
        console.error('❌ FileReader 오류:', error);
        alert('이미지 읽기에 실패했습니다.');
      };

      reader.readAsDataURL(imageFile);

    } catch (error) {
      console.error('❌ 이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  }, []);

  // 🎯 Link 클릭 방지 핸들러 (드래그 중일 때)
  const handleLinkClick = useCallback((e: React.MouseEvent, cardId: string) => {
    if (dragOverCard === cardId || isDragging) {
      console.log('🚫 드래그 중이므로 링크 클릭 방지');
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, [dragOverCard, isDragging]);

  // 🧪 전역 드래그 이벤트 처리 및 디버깅 - 강화된 버전
  useEffect(() => {
    console.log('🚀 ReferencesPageClient 마운트됨 - 드래그 앤 드롭 활성화');

    // 전역 드래그 이벤트 방지 (브라우저 기본 동작 차단)
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'none';
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      console.log('🌍 전역 드롭 이벤트 차단됨');
    };

    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      console.log('🌍 전역 드래그 엔터:', e.target);
    };

    // 전역 드래그 이벤트 리스너 추가
    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);
    document.addEventListener('dragenter', handleGlobalDragEnter);

    // 개발자 도구에서 사용할 수 있는 테스트 함수들 - 강화된 버전
    (window as any).testReferenceDragDrop = () => {
      console.log('🧪 References 드래그 앤 드롭 테스트 - 강화된 버전');

      // 모든 카드 찾기
      const cards = document.querySelectorAll('[data-card-id]');
      console.log('📍 찾은 카드들:', cards.length);

      if (cards.length === 0) {
        console.error('❌ 카드를 찾을 수 없습니다! DOM 확인 필요');
        return;
      }

      cards.forEach((card, index) => {
        const cardId = card.getAttribute('data-card-id');
        const rect = card.getBoundingClientRect();
        console.log(`📦 카드 ${index + 1} (${cardId}):`, {
          visible: rect.width > 0 && rect.height > 0,
          position: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          hasEventListeners: {
            dragover: (card as HTMLElement).ondragover !== null,
            drop: (card as HTMLElement).ondrop !== null,
            dragenter: (card as HTMLElement).ondragenter !== null,
            dragleave: (card as HTMLElement).ondragleave !== null
          },
          element: card
        });

        // 이벤트 리스너 테스트
        const testEvent = new DragEvent('dragover', {
          bubbles: true,
          cancelable: true
        });

        try {
          card.dispatchEvent(testEvent);
          console.log(`✅ 카드 ${index + 1} 이벤트 리스너 작동 확인`);
        } catch (error) {
          console.error(`❌ 카드 ${index + 1} 이벤트 리스너 오류:`, error);
        }
      });
    };

    (window as any).simulateImageDrop = (cardIndex = 0) => {
      console.log('🎭 이미지 드롭 시뮬레이션 - 강화된 버전');

      const cards = document.querySelectorAll('[data-card-id]');
      if (cards.length === 0) {
        console.error('❌ 카드를 찾을 수 없습니다');
        return;
      }

      if (cardIndex >= cards.length) {
        console.error(`❌ 카드 인덱스 ${cardIndex}가 범위를 벗어났습니다. 최대: ${cards.length - 1}`);
        return;
      }

      const targetCard = cards[cardIndex];
      const cardId = targetCard.getAttribute('data-card-id');

      console.log(`🎯 타겟 카드: ${cardId} (인덱스: ${cardIndex})`);

      // 가상 이미지 파일 생성
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const hue = Math.random() * 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('테스트 이미지', 200, 120);
        ctx.font = '16px Arial';
        ctx.fillText(`카드 ${cardIndex + 1}`, 200, 150);
        ctx.fillText(new Date().toLocaleTimeString(), 200, 180);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `test-image-${cardIndex}-${Date.now()}.png`, { type: 'image/png' });
          console.log('📁 생성된 테스트 파일:', file);

          // DataTransfer 객체 생성
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);

          // 드래그 이벤트 시뮬레이션
          const dragEnterEvent = new DragEvent('dragenter', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          });

          const dragOverEvent = new DragEvent('dragover', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          });

          const dropEvent = new DragEvent('drop', {
            bubbles: true,
            cancelable: true,
            dataTransfer: dataTransfer
          });

          console.log('🎭 이벤트 시퀀스 시작...');

          // 이벤트 순서대로 발생
          setTimeout(() => {
            console.log('1️⃣ dragenter 이벤트 발생');
            targetCard.dispatchEvent(dragEnterEvent);
          }, 100);

          setTimeout(() => {
            console.log('2️⃣ dragover 이벤트 발생');
            targetCard.dispatchEvent(dragOverEvent);
          }, 200);

          setTimeout(() => {
            console.log('3️⃣ drop 이벤트 발생');
            targetCard.dispatchEvent(dropEvent);
          }, 300);
        }
      }, 'image/png');
    };

    // 실시간 드래그 상태 모니터링
    (window as any).monitorDragState = () => {
      console.log('📊 현재 드래그 상태:', {
        dragOverCard,
        isDragging,
        cardsCount: document.querySelectorAll('[data-card-id]').length
      });
    };

    return () => {
      console.log('🔄 ReferencesPageClient 언마운트됨');
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('drop', handleGlobalDrop);
      document.removeEventListener('dragenter', handleGlobalDragEnter);
      delete (window as any).testReferenceDragDrop;
      delete (window as any).simulateImageDrop;
      delete (window as any).monitorDragState;
    };
  }, [dragOverCard, isDragging]);

  // 🎨 렌더링
  return (
    <div className="min-h-screen bg-white">
      <HomeButton />
      {/* 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 mb-6 leading-tight">
              REFERENCES
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed">
              다양한 공간에서 펼쳐지는 우리의 이야기들.<br className="hidden sm:block" />
              각각의 프로젝트는 공간과 사람, 그리고 빛이 만나는 특별한 순간을 담고 있습니다.
            </p>

            {/* 🎯 드래그 앤 드롭 안내 - 강화된 버전 */}
            <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-300 rounded-xl">
              <div className="flex items-center justify-center mb-4">
                <div className="text-4xl mr-3">🎯</div>
                <h3 className="text-xl font-bold text-blue-900">드래그 앤 드롭 기능 활성화!</h3>
              </div>
              <p className="text-blue-800 text-base mb-4">
                <strong>사용법:</strong> 컴퓨터에서 이미지 파일을 선택하고 카드 위로 드래그하여 놓아주세요.
              </p>
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-blue-700 text-sm">
                  <strong>💡 팁:</strong> JPG, PNG, GIF 등 모든 이미지 형식을 지원합니다.<br />
                  드래그 중에는 파란색 테두리가 나타납니다.
                </p>
              </div>
            </div>

            {/* 🧪 테스트 버튼들 - 강화된 버전 */}
            <div className="mt-4 p-6 bg-red-50 border-2 border-red-300 rounded-xl">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div className="text-center lg:text-left">
                  <h3 className="text-xl font-bold text-red-800 mb-2">🔧 드래그 앤 드롭 디버깅 도구</h3>
                  <p className="text-red-700 text-sm">
                    문제가 있다면 아래 버튼들로 테스트해보세요.<br />
                    개발자 도구 콘솔에서 결과를 확인할 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => (window as any).testReferenceDragDrop?.()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🔍 카드 진단
                  </button>
                  <button
                    onClick={() => (window as any).simulateImageDrop?.(0)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🧪 첫 카드 테스트
                  </button>
                  <button
                    onClick={() => (window as any).monitorDragState?.()}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    📊 상태 확인
                  </button>
                </div>
              </div>
            </div>

            {/* 실시간 상태 표시 */}
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-700 text-sm">
                <strong>현재 상태:</strong>
                {isDragging ? ' 🟢 드래그 중' : ' ⚪ 대기 중'} •
                {dragOverCard ? ` 🎯 타겟: ${dragOverCard}` : ' 🎯 타겟 없음'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 레퍼런스 그리드 섹션 */}
      <section className="py-16 lg:py-24">
        <div className="max-w-screen-xl mx-auto px-6">
          {/* 상태 표시 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              정적 모드: {references.length}개 레퍼런스 로드됨
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              데이터: {references.length > 0 ? '✅ 성공' : '❌ 실패'} • 드래그 앤 드롭: ✅ 활성화
            </p>
          </div>

          {/* 🎯 정적 렌더링 */}
          {references.length > 0 ? (
            <div className="space-y-12">
              {/* 그리드 렌더링 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-8">🎨 레퍼런스 그리드 (드래그 앤 드롭 지원)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {references.map((reference, index) => (
                    <div
                      key={reference.slug}
                      data-card-id={reference.id}
                      className="group relative"
                      onDragEnter={(e) => handleDragEnter(e, reference.id)}
                      onDragOver={(e) => handleDragOver(e, reference.id)}
                      onDragLeave={(e) => handleDragLeave(e, reference.id)}
                      onDrop={(e) => handleDrop(e, reference.id)}
                    >
                      {/* 🎯 드래그 오버 오버레이 - 강화된 버전 */}
                      {dragOverCard === reference.id && (
                        <div className="absolute inset-0 bg-blue-500/30 border-4 border-blue-500 border-dashed rounded-2xl flex items-center justify-center z-20 animate-pulse">
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 text-center shadow-2xl">
                            <div className="text-blue-600 font-bold text-2xl mb-3">
                              📤 이미지 교체
                            </div>
                            <div className="text-blue-800 text-lg font-medium">
                              여기에 새 이미지를 놓아주세요
                            </div>
                            <div className="text-blue-600 text-sm mt-2">
                              카드 #{index + 1}
                            </div>
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/ko/reference/${reference.slug}`}
                        className="group block"
                        onClick={(e) => handleLinkClick(e, reference.id)}
                      >
                        <article className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col ${dragOverCard === reference.id ? 'scale-105 shadow-2xl ring-4 ring-blue-300' : ''
                          }`}>
                          {/* 레퍼런스 이미지 */}
                          <div className="aspect-[4/3] relative bg-gray-100 overflow-hidden">
                            <Image
                              src={reference.image || '/images/hero/hero.jpg'}
                              alt={`${reference.title} - ${reference.location}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-700"
                              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              loading="lazy"
                            />

                            {/* 드래그 앤 드롭 힌트 - 강화된 버전 */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg">
                                <div className="text-gray-800 text-sm font-bold text-center">
                                  🖱️ 드래그 앤 드롭으로<br />이미지 교체 가능
                                </div>
                              </div>
                            </div>

                            {/* 카테고리 배지 */}
                            <div className="absolute top-4 left-4">
                              <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs uppercase tracking-wider rounded-full font-medium">
                                {reference.subcategory}
                              </span>
                            </div>

                            {/* 연도 배지 */}
                            <div className="absolute top-4 right-4">
                              <span className="inline-block px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs uppercase tracking-wider rounded-full font-medium">
                                {reference.projectDate?.slice(-4) || '2024'}
                              </span>
                            </div>

                            {/* 카드 번호 표시 */}
                            <div className="absolute bottom-4 left-4">
                              <span className="inline-block px-2 py-1 bg-blue-600/80 backdrop-blur-sm text-white text-xs rounded-full font-medium">
                                #{index + 1}
                              </span>
                            </div>
                          </div>

                          {/* 레퍼런스 정보 */}
                          <div className="p-6 lg:p-8 flex-1 flex flex-col">
                            <div className="space-y-4 flex-1">
                              <div className="space-y-2">
                                <h3 className="text-xl lg:text-2xl font-serif text-gray-900 leading-tight group-hover:text-gray-700 transition-colors duration-300">
                                  {reference.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                  <span className="flex items-center">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                      />
                                    </svg>
                                    {reference.location}
                                  </span>
                                  {reference.duration && (
                                    <>
                                      <span>•</span>
                                      <span>{reference.duration}</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <p className="text-gray-600 font-light leading-relaxed line-clamp-3 flex-1">
                                {reference.description}
                              </p>
                            </div>

                            {/* 더보기 링크 */}
                            <div className="pt-4 mt-auto">
                              <span className="inline-flex items-center text-gray-900 group-hover:text-gray-600 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                                <span>자세히 보기</span>
                                <svg
                                  className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl">❌</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif text-gray-900">
                    데이터 로드 실패
                  </h3>
                  <p className="text-gray-600 font-light">
                    레퍼런스 데이터를 불러올 수 없습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
