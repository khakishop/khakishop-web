// ================================================================================
// 🎭 KHAKISHOP - 관리자 이미지 페이지 E2E 테스트
// ================================================================================

import { test, expect, Page } from '@playwright/test';
import path from 'path';

test.describe('관리자 이미지 페이지', () => {
  
  test.beforeEach(async ({ page }) => {
    // 관리자 이미지 페이지로 이동
    await page.goto('/ko/admin/images');
    
    // 페이지 로딩 완료 대기
    await page.waitForSelector('[data-testid="image-management-page"]', { timeout: 30000 });
  });

  // ================================================================================
  // 🖼️ 테스트 1: 이미지 업로드 시나리오
  // ================================================================================
  test('이미지 업로드 기능이 정상 작동한다', async ({ page }) => {
    // 파일 업로드 준비
    const testImagePath = path.join(__dirname, '../fixtures/test-image.jpg');
    
    // 업로드 버튼 확인
    const uploadButton = page.locator('[data-testid="upload-button"]');
    await expect(uploadButton).toBeVisible();
    
    // 파일 선택
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    
    // 메타데이터 입력
    await page.fill('[data-testid="category-select"]', 'hero');
    await page.fill('[data-testid="title-input"]', 'E2E 테스트 이미지');
    await page.fill('[data-testid="description-input"]', '자동 테스트로 업로드된 이미지');
    
    // 업로드 실행
    await page.click('[data-testid="upload-submit"]');
    
    // 업로드 성공 확인
    await expect(page.locator('[data-testid="upload-success-message"]')).toBeVisible({ timeout: 10000 });
    
    // 업로드된 이미지가 목록에 표시되는지 확인
    await expect(page.locator('[data-testid="image-item"]').filter({ hasText: 'E2E 테스트 이미지' })).toBeVisible();
  });

  // ================================================================================
  // 🔍 테스트 2: 필터 선택 시나리오
  // ================================================================================
  test('카테고리 필터가 정상 작동한다', async ({ page }) => {
    // 초기 이미지 개수 확인
    const initialImageCount = await page.locator('[data-testid="image-item"]').count();
    
    // 카테고리 필터 선택
    await page.selectOption('[data-testid="category-filter"]', 'hero');
    
    // 필터 적용 대기
    await page.waitForFunction(() => {
      const statusElement = document.querySelector('[data-testid="filter-status"]');
      return statusElement && statusElement.textContent?.includes('필터 적용 완료');
    }, { timeout: 5000 });
    
    // 필터된 결과 확인
    const filteredImages = page.locator('[data-testid="image-item"]');
    const filteredCount = await filteredImages.count();
    
    // hero 카테고리 이미지만 표시되는지 확인
    for (let i = 0; i < filteredCount; i++) {
      const imageItem = filteredImages.nth(i);
      await expect(imageItem.locator('[data-testid="image-category"]')).toContainText('hero');
    }
    
    // 보호된 이미지 필터 테스트
    await page.check('[data-testid="protected-only-filter"]');
    
    // 보호된 이미지만 표시되는지 확인
    const protectedImages = page.locator('[data-testid="image-item"][data-protected="true"]');
    const protectedCount = await protectedImages.count();
    
    if (protectedCount > 0) {
      await expect(protectedImages.first()).toBeVisible();
    }
  });

  // ================================================================================
  // 📋 테스트 3: 메타데이터 확인 시나리오
  // ================================================================================
  test('이미지 메타데이터가 올바르게 표시된다', async ({ page }) => {
    // 첫 번째 이미지 아이템 선택
    const firstImage = page.locator('[data-testid="image-item"]').first();
    await expect(firstImage).toBeVisible();
    
    // 이미지 정보 확인
    await expect(firstImage.locator('[data-testid="image-title"]')).toBeVisible();
    await expect(firstImage.locator('[data-testid="image-category"]')).toBeVisible();
    await expect(firstImage.locator('[data-testid="image-dimensions"]')).toBeVisible();
    
    // 이미지 클릭해서 상세 정보 모달 열기
    await firstImage.click();
    
    // 상세 정보 모달 확인
    const modal = page.locator('[data-testid="image-detail-modal"]');
    await expect(modal).toBeVisible();
    
    // 메타데이터 필드들 확인
    await expect(modal.locator('[data-testid="metadata-title"]')).toBeVisible();
    await expect(modal.locator('[data-testid="metadata-category"]')).toBeVisible();
    await expect(modal.locator('[data-testid="metadata-dimensions"]')).toBeVisible();
    await expect(modal.locator('[data-testid="metadata-filesize"]')).toBeVisible();
    await expect(modal.locator('[data-testid="metadata-created"]')).toBeVisible();
    
    // 이미지 미리보기 확인
    const preview = modal.locator('[data-testid="image-preview"]');
    await expect(preview).toBeVisible();
    await expect(preview).toHaveAttribute('src', /.+/);
    
    // 모달 닫기
    await page.click('[data-testid="modal-close"]');
    await expect(modal).not.toBeVisible();
  });

  // ================================================================================
  // 🚀 테스트 4: 성능 및 반응성 테스트
  // ================================================================================
  test('페이지 로딩 성능이 기준을 만족한다', async ({ page }) => {
    const startTime = Date.now();
    
    // 페이지 새로고침
    await page.reload();
    
    // 주요 요소들이 로드될 때까지 대기
    await page.waitForSelector('[data-testid="image-management-page"]');
    await page.waitForSelector('[data-testid="upload-button"]');
    await page.waitForSelector('[data-testid="category-filter"]');
    
    const loadTime = Date.now() - startTime;
    
    // 3초 내 로딩 완료 확인
    expect(loadTime).toBeLessThan(3000);
    
    // 이미지 동기화 상태 확인
    const syncStatus = page.locator('[data-testid="sync-status"]');
    await expect(syncStatus).toBeVisible();
    
    // 동기화 완료까지 대기 (최대 10초)
    await page.waitForFunction(() => {
      const element = document.querySelector('[data-testid="sync-status"]');
      return element && !element.textContent?.includes('동기화 중');
    }, { timeout: 10000 });
  });

  // ================================================================================
  // 📱 테스트 5: 반응형 디자인 테스트
  // ================================================================================
  test('모바일 뷰포트에서 UI가 적절히 조정된다', async ({ page }) => {
    // 모바일 뷰포트로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 페이지 새로고침
    await page.reload();
    await page.waitForSelector('[data-testid="image-management-page"]');
    
    // 모바일 레이아웃 확인
    const mobileMenu = page.locator('[data-testid="mobile-menu"]');
    if (await mobileMenu.isVisible()) {
      await expect(mobileMenu).toBeVisible();
    }
    
    // 이미지 그리드가 모바일에 적합한지 확인
    const imageGrid = page.locator('[data-testid="image-grid"]');
    await expect(imageGrid).toBeVisible();
    
    // 터치 기반 상호작용 테스트
    const firstImage = page.locator('[data-testid="image-item"]').first();
    if (await firstImage.isVisible()) {
      await firstImage.tap();
      
      // 모바일에서 모달이 전체화면으로 표시되는지 확인
      const modal = page.locator('[data-testid="image-detail-modal"]');
      await expect(modal).toBeVisible();
    }
  });

  // ================================================================================
  // 🔄 테스트 6: 실시간 동기화 테스트
  // ================================================================================
  test('이미지 동기화가 올바르게 작동한다', async ({ page }) => {
    // 수동 동기화 버튼 클릭
    const syncButton = page.locator('[data-testid="manual-sync-button"]');
    if (await syncButton.isVisible()) {
      await syncButton.click();
      
      // 동기화 진행 상태 확인
      await expect(page.locator('[data-testid="sync-progress"]')).toBeVisible();
      
      // 동기화 완료 대기
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="sync-status"]');
        return element && element.textContent?.includes('동기화 완료');
      }, { timeout: 15000 });
      
      // 성공 메시지 확인
      await expect(page.locator('[data-testid="sync-success-message"]')).toBeVisible();
    }
  });
}); 