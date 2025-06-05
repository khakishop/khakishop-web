#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 khaki shop 접근성 테스트를 시작합니다...\n');

// 테스트할 페이지 목록
const testPages = [
  'http://localhost:3000/ko',
  'http://localhost:3000/ko/about',
  'http://localhost:3000/ko/collection',
  'http://localhost:3000/ko/products',
  'http://localhost:3000/ko/references',
  'http://localhost:3000/ko/contact',
  'http://localhost:3000/en',
  'http://localhost:3000/en/about',
  'http://localhost:3000/en/collection',
];

// 결과를 저장할 디렉토리 생성
const resultsDir = path.join(__dirname, '../test-results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

console.log('📋 접근성 점검 항목:');
console.log('  ✓ 이미지 alt 속성');
console.log('  ✓ 링크 접근성 (aria-label, title)');
console.log('  ✓ 키보드 네비게이션');
console.log('  ✓ 색상 대비');
console.log('  ✓ 의미론적 HTML 구조');
console.log('  ✓ 스크린 리더 호환성\n');

// 수동 점검 가이드
console.log('🧪 수동 테스트 가이드:');
console.log('');
console.log('1. 키보드 네비게이션 테스트:');
console.log('   - Tab 키로 모든 인터랙티브 요소 접근 가능한지 확인');
console.log('   - Enter/Space로 버튼 활성화 가능한지 확인');
console.log('   - Shift+Tab으로 역방향 네비게이션 가능한지 확인');
console.log('');
console.log('2. 스크린 리더 테스트 (macOS):');
console.log('   - Cmd+F5로 VoiceOver 활성화');
console.log('   - Control+Option+Arrow로 요소 간 이동');
console.log('   - 이미지, 버튼, 링크가 적절히 읽히는지 확인');
console.log('');
console.log('3. 브라우저 개발자 도구:');
console.log('   - Lighthouse Accessibility 스코어 확인');
console.log('   - Chrome DevTools > Accessibility 패널 활용');
console.log('   - 색상 대비 검사 도구 사용');
console.log('');
console.log('4. 테스트 페이지:');
testPages.forEach(page => {
  console.log(`   - ${page}`);
});
console.log(`   - ${testPages[0]}/error-test (에러 페이지 테스트)`);
console.log('');

// 실제 자동화된 테스트를 원한다면 아래 주석 해제
console.log('💡 자동화된 접근성 테스트를 실행하려면:');
console.log('   npm run lighthouse   # Lighthouse 감사 실행');
console.log('   npm run axe-test     # axe-core 테스트 실행');
console.log('');

console.log('✅ 접근성 점검 가이드가 준비되었습니다!');
console.log('');
console.log('🔗 추가 리소스:');
console.log('   - WCAG 2.1 가이드라인: https://www.w3.org/WAI/WCAG21/quickref/');
console.log('   - axe 브라우저 확장: https://www.deque.com/axe/browser-extensions/');
console.log('   - Wave 웹 접근성 평가 도구: https://wave.webaim.org/'); 