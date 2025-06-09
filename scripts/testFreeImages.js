// ================================================================================
// 🧪 KHAKISHOP 무료 이미지 테스트 스크립트
// ================================================================================
// 🎯 목적: 빠른 테스트를 위한 샘플 이미지 생성

const FreeImageGenerator = require('./generateFreeImages');

class ImageTester extends FreeImageGenerator {
  async generateTestImages() {
    console.log('🧪 khakishop 무료 이미지 테스트 시작...\n');

    const testImages = [
      {
        url: this.generateUnsplashUrl('minimal+living+room+natural+light', 800, 600),
        path: 'test/hero-test.jpg',
        description: 'khakishop 테스트 히어로 이미지'
      },
      {
        url: this.generateUnsplashUrl('white+linen+curtains+natural', 400, 300),
        path: 'test/collection-test.jpg', 
        description: 'khakishop 테스트 컬렉션 이미지'
      },
      {
        url: this.generateUnsplashUrl('scandinavian+interior+curtains', 600, 400),
        path: 'test/reference-test.jpg',
        description: 'khakishop 테스트 레퍼런스 이미지'
      }
    ];

    let success = 0;
    
    for (let i = 0; i < testImages.length; i++) {
      const image = testImages[i];
      const targetPath = require('path').join(this.targetDir, image.path);
      
      try {
        console.log(`[${i + 1}/${testImages.length}] ${image.path}`);
        await this.downloadImage(image.url, targetPath, image.description);
        success++;
        
        // 짧은 간격
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`❌ 실패: ${image.path}`);
      }
    }

    console.log(`\n🎉 테스트 완료! 성공: ${success}/${testImages.length}`);
    console.log(`📁 테스트 이미지 위치: ${this.targetDir}/test/`);
    
    if (success > 0) {
      console.log('\n✅ Unsplash 연결 성공! 전체 이미지 생성 가능');
      console.log('💡 전체 생성: npm run generate-free-images');
    }
  }
}

async function main() {
  const tester = new ImageTester();
  await tester.generateTestImages();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageTester; 