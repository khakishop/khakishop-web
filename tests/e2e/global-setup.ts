// ================================================================================
// 🎭 KHAKISHOP - Playwright 글로벌 설정
// ================================================================================

import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  
  // 서버가 준비될 때까지 대기
  console.log('🔍 서버 연결 확인 중...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // 홈페이지 접속 확인
    await page.goto(baseURL || 'http://localhost:3000');
    await page.waitForSelector('body', { timeout: 30000 });
    
    console.log('✅ 서버 연결 확인 완료');
  } catch (error) {
    console.error('❌ 서버 연결 실패:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup; 