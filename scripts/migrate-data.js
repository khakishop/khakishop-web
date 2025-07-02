const fs = require('fs');
const path = require('path');

console.log('🔄 데이터 마이그레이션 시작...');

const unifiedData = {
  version: "2.0",
  lastUpdated: new Date().toISOString(),
  categories: {
    curtain: [], blind: [], motorized: [],
    projects: [], collections: [], references: []
  }
};

const dataPath = path.join(__dirname, '../data/products.json');
fs.writeFileSync(dataPath, JSON.stringify(unifiedData, null, 2));

console.log('✅ 완료!');
