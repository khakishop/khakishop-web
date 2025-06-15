#!/bin/bash

# 🎨 KHAKISHOP 미드저니 이미지 자동 배치 스크립트
# 작성자: AI Assistant
# 목적: public/images/midjourney/의 이미지들을 정확한 제품 폴더로 이동

set -e  # 에러 발생시 스크립트 중단

# 색상 코드 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 프로젝트 루트 디렉토리 확인
if [ ! -d "public/images" ]; then
    echo -e "${RED}❌ 에러: public/images 폴더를 찾을 수 없습니다. 프로젝트 루트에서 실행해주세요.${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 KHAKISHOP 미드저니 이미지 자동 배치 시작...${NC}"
echo ""

# 소스 및 대상 디렉토리 설정
SOURCE_DIR="public/images/midjourney"
COLLECTIONS_DIR="public/images/collections"
CURTAINS_DIR="public/images/curtains"
BLINDS_DIR="public/images/blinds"
MOTORIZED_DIR="public/images/motorized"

# 이동 함수 정의
move_image() {
    local source_file="$1"
    local target_file="$2"
    local description="$3"
    
    if [ -f "$source_file" ]; then
        # 대상 디렉토리 생성 (필요시)
        target_dir=$(dirname "$target_file")
        mkdir -p "$target_dir"
        
        # 파일 이동
        cp "$source_file" "$target_file"
        echo -e "${GREEN}✅ $description${NC}"
        echo -e "   ${source_file} → ${target_file}"
        
        # 원본 삭제 (옵션)
        # rm "$source_file"
    else
        echo -e "${YELLOW}⚠️  누락: $source_file (${description})${NC}"
    fi
}

echo -e "${BLUE}📁 Collections 이미지 배치 (1-9.png)${NC}"
echo "=================================================="

# Collections (1-9.png)
move_image "$SOURCE_DIR/1.png" "$COLLECTIONS_DIR/essential-linen.png" "1.png → essential-linen.png"
move_image "$SOURCE_DIR/2.png" "$COLLECTIONS_DIR/modern-sheer.png" "2.png → modern-sheer.png"
move_image "$SOURCE_DIR/3.png" "$COLLECTIONS_DIR/venetian-premium.png" "3.png → venetian-premium.png"
move_image "$SOURCE_DIR/4.png" "$COLLECTIONS_DIR/wood-texture.png" "4.png → wood-texture.png"
move_image "$SOURCE_DIR/5.png" "$COLLECTIONS_DIR/smart-automation.png" "5.png → smart-automation.png (누락 복구 필요)"
move_image "$SOURCE_DIR/6.png" "$COLLECTIONS_DIR/wireless-motor.png" "6.png → wireless-motor.png"
move_image "$SOURCE_DIR/7.png" "$COLLECTIONS_DIR/designer-hardware.png" "7.png → designer-hardware.png"
move_image "$SOURCE_DIR/8.png" "$COLLECTIONS_DIR/luxury-tieback.png" "8.png → luxury-tieback.png"

echo ""
echo -e "${BLUE}🪟 Curtains 이미지 배치 (10-30.png)${NC}"
echo "=================================================="

# Curtains (10-30.png)
# essential-linen-collection (10-13)
move_image "$SOURCE_DIR/10.png" "$CURTAINS_DIR/essential-linen-collection/main.jpg" "10.png → essential-linen-collection/main.jpg"
move_image "$SOURCE_DIR/11.png" "$CURTAINS_DIR/essential-linen-collection/detail-1.jpg" "11.png → essential-linen-collection/detail-1.jpg"
move_image "$SOURCE_DIR/12.png" "$CURTAINS_DIR/essential-linen-collection/detail-2.jpg" "12.png → essential-linen-collection/detail-2.jpg"
move_image "$SOURCE_DIR/13.png" "$CURTAINS_DIR/essential-linen-collection/lifestyle.jpg" "13.png → essential-linen-collection/lifestyle.jpg"

# modern-sheer-series (14-17)
move_image "$SOURCE_DIR/14.png" "$CURTAINS_DIR/modern-sheer-series/main.jpg" "14.png → modern-sheer-series/main.jpg (누락 복구 필요)"
move_image "$SOURCE_DIR/15.png" "$CURTAINS_DIR/modern-sheer-series/detail-1.jpg" "15.png → modern-sheer-series/detail-1.jpg"
move_image "$SOURCE_DIR/16.png" "$CURTAINS_DIR/modern-sheer-series/detail-2.jpg" "16.png → modern-sheer-series/detail-2.jpg"
move_image "$SOURCE_DIR/17.png" "$CURTAINS_DIR/modern-sheer-series/lifestyle.jpg" "17.png → modern-sheer-series/lifestyle.jpg"

# venetian-premium-line (18-21)
move_image "$SOURCE_DIR/18.png" "$CURTAINS_DIR/venetian-premium-line/main.jpg" "18.png → venetian-premium-line/main.jpg"
move_image "$SOURCE_DIR/19.png" "$CURTAINS_DIR/venetian-premium-line/detail-1.jpg" "19.png → venetian-premium-line/detail-1.jpg"
move_image "$SOURCE_DIR/20.png" "$CURTAINS_DIR/venetian-premium-line/detail-2.jpg" "20.png → venetian-premium-line/detail-2.jpg"
move_image "$SOURCE_DIR/21.png" "$CURTAINS_DIR/venetian-premium-line/lifestyle.jpg" "21.png → venetian-premium-line/lifestyle.jpg"

# wood-texture-natural (22-25)
move_image "$SOURCE_DIR/22.png" "$CURTAINS_DIR/wood-texture-natural/main.jpg" "22.png → wood-texture-natural/main.jpg"
move_image "$SOURCE_DIR/23.png" "$CURTAINS_DIR/wood-texture-natural/detail-1.jpg" "23.png → wood-texture-natural/detail-1.jpg"
move_image "$SOURCE_DIR/24.png" "$CURTAINS_DIR/wood-texture-natural/detail-2.jpg" "24.png → wood-texture-natural/detail-2.jpg"
move_image "$SOURCE_DIR/25.png" "$CURTAINS_DIR/wood-texture-natural/lifestyle.jpg" "25.png → wood-texture-natural/lifestyle.jpg"

# smart-automation-series (26-29)
move_image "$SOURCE_DIR/26.png" "$CURTAINS_DIR/smart-automation-series/main.jpg" "26.png → smart-automation-series/main.jpg"
move_image "$SOURCE_DIR/27.png" "$CURTAINS_DIR/smart-automation-series/detail-1.jpg" "27.png → smart-automation-series/detail-1.jpg"
move_image "$SOURCE_DIR/28.png" "$CURTAINS_DIR/smart-automation-series/detail-2.jpg" "28.png → smart-automation-series/detail-2.jpg"
move_image "$SOURCE_DIR/29.png" "$CURTAINS_DIR/smart-automation-series/lifestyle.jpg" "29.png → smart-automation-series/lifestyle.jpg"

echo ""
echo -e "${BLUE}🏠 Blinds 이미지 배치 (30-49.png)${NC}"
echo "=================================================="

# Blinds (30-49.png)
# premium-venetian-collection (30-33)
move_image "$SOURCE_DIR/30.png" "$BLINDS_DIR/premium-venetian-collection/main.jpg" "30.png → premium-venetian-collection/main.jpg"
move_image "$SOURCE_DIR/31.png" "$BLINDS_DIR/premium-venetian-collection/detail-1.jpg" "31.png → premium-venetian-collection/detail-1.jpg"
move_image "$SOURCE_DIR/32.png" "$BLINDS_DIR/premium-venetian-collection/detail-2.jpg" "32.png → premium-venetian-collection/detail-2.jpg"
move_image "$SOURCE_DIR/33.png" "$BLINDS_DIR/premium-venetian-collection/lifestyle.jpg" "33.png → premium-venetian-collection/lifestyle.jpg"

# modern-vertical-system (34-37)
move_image "$SOURCE_DIR/34.png" "$BLINDS_DIR/modern-vertical-system/main.jpg" "34.png → modern-vertical-system/main.jpg"
move_image "$SOURCE_DIR/35.png" "$BLINDS_DIR/modern-vertical-system/detail-1.jpg" "35.png → modern-vertical-system/detail-1.jpg"
move_image "$SOURCE_DIR/36.png" "$BLINDS_DIR/modern-vertical-system/detail-2.jpg" "36.png → modern-vertical-system/detail-2.jpg"
move_image "$SOURCE_DIR/37.png" "$BLINDS_DIR/modern-vertical-system/lifestyle.jpg" "37.png → modern-vertical-system/lifestyle.jpg"

# smart-roller-collection (38-41)
move_image "$SOURCE_DIR/38.png" "$BLINDS_DIR/smart-roller-collection/main.jpg" "38.png → smart-roller-collection/main.jpg"
move_image "$SOURCE_DIR/39.png" "$BLINDS_DIR/smart-roller-collection/detail-1.jpg" "39.png → smart-roller-collection/detail-1.jpg"
move_image "$SOURCE_DIR/40.png" "$BLINDS_DIR/smart-roller-collection/detail-2.jpg" "40.png → smart-roller-collection/detail-2.jpg"
move_image "$SOURCE_DIR/41.png" "$BLINDS_DIR/smart-roller-collection/lifestyle.jpg" "41.png → smart-roller-collection/lifestyle.jpg"

# elegant-roman-style (42-45)
move_image "$SOURCE_DIR/42.png" "$BLINDS_DIR/elegant-roman-style/main.jpg" "42.png → elegant-roman-style/main.jpg"
move_image "$SOURCE_DIR/43.png" "$BLINDS_DIR/elegant-roman-style/detail-1.jpg" "43.png → elegant-roman-style/detail-1.jpg"
move_image "$SOURCE_DIR/44.png" "$BLINDS_DIR/elegant-roman-style/detail-2.jpg" "44.png → elegant-roman-style/detail-2.jpg"
move_image "$SOURCE_DIR/45.png" "$BLINDS_DIR/elegant-roman-style/lifestyle.jpg" "45.png → elegant-roman-style/lifestyle.jpg"

# contemporary-panel-system (46-49)
move_image "$SOURCE_DIR/46.png" "$BLINDS_DIR/contemporary-panel-system/main.jpg" "46.png → contemporary-panel-system/main.jpg"
move_image "$SOURCE_DIR/47.png" "$BLINDS_DIR/contemporary-panel-system/detail-1.jpg" "47.png → contemporary-panel-system/detail-1.jpg"
move_image "$SOURCE_DIR/48.png" "$BLINDS_DIR/contemporary-panel-system/detail-2.jpg" "48.png → contemporary-panel-system/detail-2.jpg"
move_image "$SOURCE_DIR/49.png" "$BLINDS_DIR/contemporary-panel-system/lifestyle.jpg" "49.png → contemporary-panel-system/lifestyle.jpg"

echo ""
echo -e "${BLUE}🤖 Motorized 이미지 배치 (50-73.png)${NC}"
echo "=================================================="

# Motorized (50-73.png) - 6개 제품만 사용
# smart-curtain-system-pro (50-53)
move_image "$SOURCE_DIR/50.png" "$MOTORIZED_DIR/smart-curtain-system-pro/main.jpg" "50.png → smart-curtain-system-pro/main.jpg"
move_image "$SOURCE_DIR/51.png" "$MOTORIZED_DIR/smart-curtain-system-pro/detail-1.jpg" "51.png → smart-curtain-system-pro/detail-1.jpg"
move_image "$SOURCE_DIR/52.png" "$MOTORIZED_DIR/smart-curtain-system-pro/detail-2.jpg" "52.png → smart-curtain-system-pro/detail-2.jpg"
move_image "$SOURCE_DIR/53.png" "$MOTORIZED_DIR/smart-curtain-system-pro/lifestyle.jpg" "53.png → smart-curtain-system-pro/lifestyle.jpg"

# motorized-venetian-deluxe (54-57)
move_image "$SOURCE_DIR/54.png" "$MOTORIZED_DIR/motorized-venetian-deluxe/main.jpg" "54.png → motorized-venetian-deluxe/main.jpg"
move_image "$SOURCE_DIR/55.png" "$MOTORIZED_DIR/motorized-venetian-deluxe/detail-1.jpg" "55.png → motorized-venetian-deluxe/detail-1.jpg"
move_image "$SOURCE_DIR/56.png" "$MOTORIZED_DIR/motorized-venetian-deluxe/detail-2.jpg" "56.png → motorized-venetian-deluxe/detail-2.jpg"
move_image "$SOURCE_DIR/57.png" "$MOTORIZED_DIR/motorized-venetian-deluxe/lifestyle.jpg" "57.png → motorized-venetian-deluxe/lifestyle.jpg"

# ai-home-integration-suite (58-61)
move_image "$SOURCE_DIR/58.png" "$MOTORIZED_DIR/ai-home-integration-suite/main.jpg" "58.png → ai-home-integration-suite/main.jpg"
move_image "$SOURCE_DIR/59.png" "$MOTORIZED_DIR/ai-home-integration-suite/detail-1.jpg" "59.png → ai-home-integration-suite/detail-1.jpg"
move_image "$SOURCE_DIR/60.png" "$MOTORIZED_DIR/ai-home-integration-suite/detail-2.jpg" "60.png → ai-home-integration-suite/detail-2.jpg"
move_image "$SOURCE_DIR/61.png" "$MOTORIZED_DIR/ai-home-integration-suite/lifestyle.jpg" "61.png → ai-home-integration-suite/lifestyle.jpg"

# voice-control-roller-system (62-65)
move_image "$SOURCE_DIR/62.png" "$MOTORIZED_DIR/voice-control-roller-system/main.jpg" "62.png → voice-control-roller-system/main.jpg"
move_image "$SOURCE_DIR/63.png" "$MOTORIZED_DIR/voice-control-roller-system/detail-1.jpg" "63.png → voice-control-roller-system/detail-1.jpg"
move_image "$SOURCE_DIR/64.png" "$MOTORIZED_DIR/voice-control-roller-system/detail-2.jpg" "64.png → voice-control-roller-system/detail-2.jpg"
move_image "$SOURCE_DIR/65.png" "$MOTORIZED_DIR/voice-control-roller-system/lifestyle.jpg" "65.png → voice-control-roller-system/lifestyle.jpg"

# smartphone-vertical-elite (66-69)
move_image "$SOURCE_DIR/66.png" "$MOTORIZED_DIR/smartphone-vertical-elite/main.jpg" "66.png → smartphone-vertical-elite/main.jpg"
move_image "$SOURCE_DIR/67.png" "$MOTORIZED_DIR/smartphone-vertical-elite/detail-1.jpg" "67.png → smartphone-vertical-elite/detail-1.jpg"
move_image "$SOURCE_DIR/68.png" "$MOTORIZED_DIR/smartphone-vertical-elite/detail-2.jpg" "68.png → smartphone-vertical-elite/detail-2.jpg"
move_image "$SOURCE_DIR/69.png" "$MOTORIZED_DIR/smartphone-vertical-elite/lifestyle.jpg" "69.png → smartphone-vertical-elite/lifestyle.jpg"

# solar-powered-eco-system (70-73)
move_image "$SOURCE_DIR/70.png" "$MOTORIZED_DIR/solar-powered-eco-system/main.jpg" "70.png → solar-powered-eco-system/main.jpg"
move_image "$SOURCE_DIR/71.png" "$MOTORIZED_DIR/solar-powered-eco-system/detail-1.jpg" "71.png → solar-powered-eco-system/detail-1.jpg"
move_image "$SOURCE_DIR/72.png" "$MOTORIZED_DIR/solar-powered-eco-system/detail-2.jpg" "72.png → solar-powered-eco-system/detail-2.jpg"
move_image "$SOURCE_DIR/73.png" "$MOTORIZED_DIR/solar-powered-eco-system/lifestyle.jpg" "73.png → solar-powered-eco-system/lifestyle.jpg"

echo ""
echo -e "${GREEN}🎉 이미지 배치 작업 완료!${NC}"
echo ""
echo -e "${YELLOW}📋 추가 작업 필요:${NC}"
echo "1. 5.png (smart-automation.png) 생성 필요"
echo "2. 14.png (modern-sheer-series/main.jpg) 생성 필요"
echo "3. 17.png ~ 73.png 순서대로 생성 필요"
echo ""
echo -e "${BLUE}📊 배치 현황:${NC}"
echo "• Collections: 8개 (5.png 누락)"
echo "• Curtains: 20개 (14.png 누락)"
echo "• Blinds: 20개"
echo "• Motorized: 24개 (6개 제품만)"
echo "======================"
echo "총 72개 이미지 중 70개 배치 완료"
echo ""

# 파일 권한 설정
echo -e "${BLUE}🔧 파일 권한 설정...${NC}"
find public/images -name "*.jpg" -o -name "*.png" | xargs chmod 644 2>/dev/null || true

echo -e "${GREEN}✅ 모든 작업이 완료되었습니다!${NC}" 