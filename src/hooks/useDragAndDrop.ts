import { useCallback, useEffect, useState } from 'react';

export interface DragDropItem {
  id: string;
  image?: string;
  [key: string]: any;
}

export interface UseDragAndDropOptions {
  items: DragDropItem[];
  setItems: (updater: (prev: DragDropItem[]) => DragDropItem[]) => void;
  category?: string;
  onImageUpdate?: (itemId: string, newImageUrl: string) => void;
}

export interface DragDropHandlers {
  dragOverCard: string | null;
  isDragging: boolean;
  handleDragEnter: (e: React.DragEvent, itemId: string) => void;
  handleDragOver: (e: React.DragEvent, itemId: string) => void;
  handleDragLeave: (e: React.DragEvent, itemId: string) => void;
  handleDrop: (e: React.DragEvent, itemId: string) => void;
  handleLinkClick: (e: React.MouseEvent, itemId: string) => boolean;
}

export function useDragAndDrop({
  items,
  setItems,
  category = 'default',
  onImageUpdate
}: UseDragAndDropOptions): DragDropHandlers {
  const [dragOverCard, setDragOverCard] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 🎯 드래그 앤 드롭 핸들러들 - 강화된 버전
  const handleDragEnter = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🎯 [${category}] handleDragEnter 호출됨:`, itemId);
    setDragOverCard(itemId);
    setIsDragging(true);
  }, [category]);

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🎯 [${category}] handleDragOver 호출됨:`, itemId, {
      dataTransfer: e.dataTransfer,
      types: e.dataTransfer?.types,
      files: e.dataTransfer?.files?.length
    });

    // 드래그 효과 설정
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }

    setDragOverCard(itemId);
    setIsDragging(true);
  }, [category]);

  const handleDragLeave = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🎯 [${category}] handleDragLeave 호출됨:`, itemId);

    // 실제로 카드 영역을 벗어났는지 확인
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      console.log(`🎯 [${category}] 카드 영역 벗어남 - dragOver 해제`);
      setDragOverCard(null);
      setIsDragging(false);
    }
  }, [category]);

  const handleDrop = useCallback(async (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`🎯 [${category}] handleDrop 호출됨:`, itemId, {
      dataTransfer: e.dataTransfer,
      files: e.dataTransfer?.files,
      filesLength: e.dataTransfer?.files?.length
    });

    setDragOverCard(null);
    setIsDragging(false);

    const files = Array.from(e.dataTransfer?.files || []);
    console.log(`📁 [${category}] 드롭된 파일들:`, files);

    if (files.length === 0) {
      console.warn(`⚠️ [${category}] 드롭된 파일이 없습니다.`);
      alert('파일이 감지되지 않았습니다. 이미지 파일을 드래그해주세요.');
      return;
    }

    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      console.warn(`⚠️ [${category}] 이미지 파일이 아닙니다:`, files.map(f => f.type));
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    console.log(`✅ [${category}] 이미지 파일 감지:`, {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    });

    try {
      // 🔄 이미지를 Base64로 변환하여 즉시 미리보기
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImageUrl = event.target?.result as string;
        console.log(`🔄 [${category}] 이미지 로드 완료, 상태 업데이트 중...`);
        console.log(`🔍 [${category}] 타겟 아이템 ID:`, itemId);

        // 🎯 현재 아이템들 중에서 매칭되는 것 찾기
        const targetItem = items.find(item => {
          const matchById = item.id === itemId;
          const matchBySlug = (item as any).slug === itemId;
          return matchById || matchBySlug;
        });

        if (!targetItem) {
          console.error(`❌ [${category}] 타겟 아이템을 찾을 수 없습니다:`, {
            targetId: itemId,
            availableItems: items.map(item => ({
              id: item.id,
              slug: (item as any).slug,
              title: (item as any).title
            }))
          });
          alert('대상 카드를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
          return;
        }

        console.log(`🎯 [${category}] 타겟 아이템 찾음:`, {
          id: targetItem.id,
          slug: (targetItem as any).slug,
          title: (targetItem as any).title,
          currentImage: targetItem.image,
          currentMainImage: (targetItem as any).mainImage
        });

        // 🎯 카테고리별 이미지 필드 업데이트 로직 개선
        setItems(prev => {
          console.log(`🔄 [${category}] setItems 호출 전 상태:`, {
            totalItems: prev.length,
            targetId: itemId,
            newImageUrl: newImageUrl.substring(0, 50) + '...'
          });

          const updatedItems = prev.map(item => {
            const matchById = item.id === itemId;
            const matchBySlug = (item as any).slug === itemId;

            if (matchById || matchBySlug) {
              const updatedItem = { ...item };
              const beforeImage = updatedItem.image;
              const beforeMainImage = (updatedItem as any).mainImage;

              // 기본 image 필드 업데이트
              updatedItem.image = newImageUrl;

              // 카테고리별 추가 필드 업데이트
              if (category === 'motorized') {
                // 모터라이즈드는 mainImage 필드도 업데이트
                (updatedItem as any).mainImage = newImageUrl;
                console.log(`🤖 [${category}] mainImage 필드도 업데이트됨`);
              }

              // ✅ 성공 로그 - 요청된 형식
              console.log('✅ 이미지 드롭 성공:', {
                id: item.id,
                updatedImage: newImageUrl
              });

              // 🔍 상세 업데이트 로그
              console.log(`🔄 [${category}] 아이템 ${itemId} 이미지 업데이트 완료:`, {
                before: {
                  image: beforeImage,
                  mainImage: beforeMainImage
                },
                after: {
                  image: updatedItem.image,
                  mainImage: (updatedItem as any).mainImage
                },
                isBase64: newImageUrl.startsWith('data:'),
                imageSize: newImageUrl.length
              });

              return updatedItem;
            }
            return item;
          });

          console.log(`✅ [${category}] setItems 완료 - 총 ${updatedItems.length}개 아이템 처리됨`);
          return updatedItems;
        });

        // 🔄 localStorage에 이미지 변경사항 저장 (새로고침 후 유지)
        try {
          const storageKey = `dragdrop_${category}_images`;
          const existingData = JSON.parse(localStorage.getItem(storageKey) || '{}');
          existingData[itemId] = {
            image: newImageUrl,
            timestamp: Date.now(),
            category: category
          };

          // 카테고리별 추가 필드 저장
          if (category === 'motorized') {
            existingData[itemId].mainImage = newImageUrl;
          }

          localStorage.setItem(storageKey, JSON.stringify(existingData));
          console.log(`💾 [${category}] localStorage에 이미지 저장 완료:`, {
            itemId,
            storageKey,
            imageSize: newImageUrl.length
          });
        } catch (error) {
          console.warn(`⚠️ [${category}] localStorage 저장 실패:`, error);
        }

        // 커스텀 콜백 호출
        if (onImageUpdate) {
          onImageUpdate(itemId, newImageUrl);
        }

        // 성공 알림
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 z-[100] bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300';
        notification.innerHTML = `
          <div class="flex items-center space-x-2">
            <span class="text-lg">✅</span>
            <div>
              <div class="font-medium">[${category}] 이미지 교체 완료!</div>
              <div class="text-sm opacity-90">${imageFile.name}</div>
              <div class="text-xs opacity-75">필드: image${category === 'motorized' ? ' + mainImage' : ''}</div>
              <div class="text-xs opacity-75">ID: ${itemId}</div>
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
          }, 4000);
        }, 4000);
      };

      reader.onerror = (error) => {
        console.error(`❌ [${category}] FileReader 오류:`, error);
        alert('이미지 읽기에 실패했습니다.');
      };

      reader.readAsDataURL(imageFile);

    } catch (error) {
      console.error(`❌ [${category}] 이미지 업로드 실패:`, error);
      alert('이미지 업로드에 실패했습니다.');
    }
  }, [category, setItems, onImageUpdate, items]);

  // 🎯 Link 클릭 방지 핸들러 (드래그 중일 때)
  const handleLinkClick = useCallback((e: React.MouseEvent, itemId: string): boolean => {
    if (dragOverCard === itemId || isDragging) {
      console.log(`🚫 [${category}] 드래그 중이므로 링크 클릭 방지`);
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    return true;
  }, [dragOverCard, isDragging, category]);

  // 🧪 전역 드래그 이벤트 처리 및 디버깅
  useEffect(() => {
    console.log(`🚀 [${category}] DragAndDrop 훅 마운트됨 - 드래그 앤 드롭 활성화`);

    // 🔄 localStorage에서 저장된 이미지 복원
    try {
      const storageKey = `dragdrop_${category}_images`;
      const savedImages = JSON.parse(localStorage.getItem(storageKey) || '{}');

      if (Object.keys(savedImages).length > 0) {
        console.log(`💾 [${category}] localStorage에서 저장된 이미지 발견:`, Object.keys(savedImages));

        setItems(prev => prev.map(item => {
          const savedData = savedImages[item.id] || savedImages[(item as any).slug];
          if (savedData && savedData.image) {
            console.log(`🔄 [${category}] 아이템 ${item.id} 이미지 복원:`, {
              from: item.image,
              to: savedData.image.substring(0, 50) + '...',
              timestamp: new Date(savedData.timestamp).toLocaleString()
            });

            const restoredItem = { ...item };
            restoredItem.image = savedData.image;

            // 카테고리별 추가 필드 복원
            if (category === 'motorized' && savedData.mainImage) {
              (restoredItem as any).mainImage = savedData.mainImage;
            }

            return restoredItem;
          }
          return item;
        }));
      } else {
        console.log(`💾 [${category}] localStorage에 저장된 이미지 없음`);
      }
    } catch (error) {
      console.warn(`⚠️ [${category}] localStorage 복원 실패:`, error);
    }

    // 전역 드래그 이벤트 방지 (브라우저 기본 동작 차단)
    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'none';
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      console.log(`🌍 [${category}] 전역 드롭 이벤트 차단됨`);
    };

    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      console.log(`🌍 [${category}] 전역 드래그 엔터:`, e.target);
    };

    // 전역 드래그 이벤트 리스너 추가
    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('drop', handleGlobalDrop);
    document.addEventListener('dragenter', handleGlobalDragEnter);

    // 개발자 도구에서 사용할 수 있는 테스트 함수들
    const testFunctionName = `test${category.charAt(0).toUpperCase() + category.slice(1)}DragDrop`;
    const simulateFunctionName = `simulate${category.charAt(0).toUpperCase() + category.slice(1)}ImageDrop`;
    const monitorFunctionName = `monitor${category.charAt(0).toUpperCase() + category.slice(1)}DragState`;

    (window as any)[testFunctionName] = () => {
      console.log(`🧪 [${category}] 드래그 앤 드롭 테스트 - 강화된 버전 + 이미지 필드 진단`);

      // 모든 카드 찾기
      const cards = document.querySelectorAll(`[data-card-id][data-category="${category}"]`);
      console.log(`📍 [${category}] 찾은 카드들:`, cards.length);

      if (cards.length === 0) {
        console.error(`❌ [${category}] 카드를 찾을 수 없습니다! DOM 확인 필요`);
        return;
      }

      // 🔍 드래그 앤 드롭 성공 검증 함수 추가
      const verifyDragDropSuccess = (cardIndex: number) => {
        const targetCard = cards[cardIndex];
        const cardId = targetCard.getAttribute('data-card-id');
        const targetItem = items.find(item => item.id === cardId || (item as any).slug === cardId);

        if (!targetItem) {
          console.error(`❌ [${category}] 카드 ${cardIndex}의 데이터 아이템을 찾을 수 없습니다`);
          return false;
        }

        const hasImage = !!(targetItem.image || (targetItem as any).mainImage);
        const isBase64 = (targetItem.image || (targetItem as any).mainImage || '').startsWith('data:');

        console.log(`🔍 [${category}] 카드 ${cardIndex} 검증 결과:`, {
          cardId,
          hasImage,
          isBase64,
          imageField: targetItem.image ? '✅ 있음' : '❌ 없음',
          mainImageField: (targetItem as any).mainImage ? '✅ 있음' : '❌ 없음',
          effectiveImage: targetItem.image || (targetItem as any).mainImage
        });

        return hasImage;
      };

      // 현재 아이템들의 이미지 필드 상태 확인
      console.log(`🖼️ [${category}] 현재 아이템들의 이미지 필드 상태:`);
      items.forEach((item, index) => {
        const imageField = (item as any).image;
        const mainImageField = (item as any).mainImage;
        const hasAnyImage = !!(imageField || mainImageField);

        console.log(`  📦 아이템 ${index + 1} (${item.id}):`, {
          image: imageField ? '✅ 있음' : '❌ 없음',
          mainImage: mainImageField ? '✅ 있음' : '❌ 없음',
          hasAnyImage,
          imageValue: imageField ? (imageField.startsWith('data:') ? 'Base64 이미지' : imageField) : null,
          mainImageValue: mainImageField ? (mainImageField.startsWith('data:') ? 'Base64 이미지' : mainImageField) : null,
          expectedField: category === 'motorized' ? 'mainImage + image' : 'image'
        });

        // 🎯 드래그 앤 드롭 성공 검증
        verifyDragDropSuccess(index);
      });

      cards.forEach((card, index) => {
        const cardId = card.getAttribute('data-card-id');
        const rect = card.getBoundingClientRect();
        console.log(`📦 [${category}] 카드 ${index + 1} (${cardId}):`, {
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
          console.log(`✅ [${category}] 카드 ${index + 1} 이벤트 리스너 작동 확인`);
        } catch (error) {
          console.error(`❌ [${category}] 카드 ${index + 1} 이벤트 리스너 오류:`, error);
        }
      });

      // 🎯 전체 드래그 앤 드롭 시스템 상태 요약
      const totalCards = cards.length;
      const cardsWithImages = items.filter(item => !!(item.image || (item as any).mainImage)).length;
      const cardsWithBase64 = items.filter(item => {
        const img = item.image || (item as any).mainImage;
        return img && img.startsWith('data:');
      }).length;

      console.log(`📊 [${category}] 드래그 앤 드롭 시스템 상태 요약:`, {
        totalCards,
        cardsWithImages,
        cardsWithBase64,
        successRate: `${cardsWithImages}/${totalCards} (${Math.round((cardsWithImages / totalCards) * 100)}%)`,
        base64Rate: `${cardsWithBase64}/${totalCards} (${Math.round((cardsWithBase64 / totalCards) * 100)}%)`,
        recommendation: cardsWithImages === totalCards ? '✅ 모든 카드 정상' :
          cardsWithImages > 0 ? '⚠️ 일부 카드만 이미지 있음' : '❌ 모든 카드 이미지 없음'
      });
    };

    (window as any)[simulateFunctionName] = (cardIndex = 0) => {
      console.log(`🎭 [${category}] 이미지 드롭 시뮬레이션 - 강화된 버전`);

      const cards = document.querySelectorAll(`[data-card-id][data-category="${category}"]`);
      if (cards.length === 0) {
        console.error(`❌ [${category}] 카드를 찾을 수 없습니다`);
        return;
      }

      if (cardIndex >= cards.length) {
        console.error(`❌ [${category}] 카드 인덱스 ${cardIndex}가 범위를 벗어났습니다. 최대: ${cards.length - 1}`);
        return;
      }

      const targetCard = cards[cardIndex];
      const cardId = targetCard.getAttribute('data-card-id');

      console.log(`🎯 [${category}] 타겟 카드: ${cardId} (인덱스: ${cardIndex})`);

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
        ctx.fillText(`${category} 테스트`, 200, 120);
        ctx.font = '16px Arial';
        ctx.fillText(`카드 ${cardIndex + 1}`, 200, 150);
        ctx.fillText(new Date().toLocaleTimeString(), 200, 180);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `test-${category}-${cardIndex}-${Date.now()}.png`, { type: 'image/png' });
          console.log(`📁 [${category}] 생성된 테스트 파일:`, file);

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

          console.log(`🎭 [${category}] 이벤트 시퀀스 시작...`);

          // 이벤트 순서대로 발생
          setTimeout(() => {
            console.log(`1️⃣ [${category}] dragenter 이벤트 발생`);
            targetCard.dispatchEvent(dragEnterEvent);
          }, 100);

          setTimeout(() => {
            console.log(`2️⃣ [${category}] dragover 이벤트 발생`);
            targetCard.dispatchEvent(dragOverEvent);
          }, 200);

          setTimeout(() => {
            console.log(`3️⃣ [${category}] drop 이벤트 발생`);
            targetCard.dispatchEvent(dropEvent);
          }, 300);
        }
      }, 'image/png');
    };

    // 실시간 드래그 상태 모니터링
    (window as any)[monitorFunctionName] = () => {
      console.log(`📊 [${category}] 현재 드래그 상태:`, {
        dragOverCard,
        isDragging,
        cardsCount: document.querySelectorAll(`[data-card-id][data-category="${category}"]`).length
      });
    };

    // 🔧 localStorage 관리 도구들
    const storageManagerName = `manage${category.charAt(0).toUpperCase() + category.slice(1)}Storage`;
    (window as any)[storageManagerName] = {
      // 저장된 이미지 목록 확인
      list: () => {
        try {
          const storageKey = `dragdrop_${category}_images`;
          const savedImages = JSON.parse(localStorage.getItem(storageKey) || '{}');
          console.log(`💾 [${category}] 저장된 이미지 목록:`, savedImages);
          return savedImages;
        } catch (error) {
          console.error(`❌ [${category}] localStorage 읽기 실패:`, error);
          return {};
        }
      },

      // 모든 저장된 이미지 삭제
      clear: () => {
        try {
          const storageKey = `dragdrop_${category}_images`;
          localStorage.removeItem(storageKey);
          console.log(`🗑️ [${category}] 모든 저장된 이미지 삭제 완료`);

          // 페이지 새로고침 권장
          if (confirm(`${category} 카테고리의 모든 저장된 이미지가 삭제되었습니다.\n페이지를 새로고침하시겠습니까?`)) {
            window.location.reload();
          }
        } catch (error) {
          console.error(`❌ [${category}] localStorage 삭제 실패:`, error);
        }
      }
    };

    console.log(`🔧 [${category}] localStorage 관리 도구 등록 완료: window.${storageManagerName}`);

    return () => {
      console.log(`🔄 [${category}] DragAndDrop 훅 언마운트됨`);
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('drop', handleGlobalDrop);
      document.removeEventListener('dragenter', handleGlobalDragEnter);
      delete (window as any)[testFunctionName];
      delete (window as any)[simulateFunctionName];
      delete (window as any)[monitorFunctionName];
      delete (window as any)[storageManagerName];
    };
  }, [category, dragOverCard, isDragging, items]);

  return {
    dragOverCard,
    isDragging,
    handleDragEnter,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleLinkClick
  };
}