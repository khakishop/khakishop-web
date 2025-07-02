#!/bin/bash

echo "🔍 KHAKISHOP 어드민 시스템 전체 연결 테스트"
echo "==============================================="

# 테스트 결과 배열
declare -a test_results=()

# 쿠키 파일 생성 (로그인)
echo "🔐 JWT 로그인 테스트..."
LOGIN_RESULT=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@khakishop.com","password":"admin123!"}' \
  -c test_cookies.txt -s | grep -o '"success":true')

if [[ "$LOGIN_RESULT" == '"success":true' ]]; then
  echo "✅ JWT 로그인 성공"
  test_results+=("JWT_LOGIN:✅")
else
  echo "❌ JWT 로그인 실패"
  test_results+=("JWT_LOGIN:❌")
fi

# 어드민 페이지들 테스트
echo -e "\n🏠 어드민 페이지 접근 테스트..."

ADMIN_PAGES=(
  "/ko/admin:어드민_대시보드"
  "/ko/admin/images:이미지_관리"
  "/ko/admin/images/manage/category/collections:Collections_카테고리"
  "/ko/admin/images/manage/category/collections/curtain:Collections_커튼"
  "/ko/admin/images/manage/category/collections/blind:Collections_블라인드"
  "/ko/admin/images/manage/category/projects:Projects_카테고리"
  "/ko/admin/images/manage/category/gallery:Gallery_카테고리"
)

for page_info in "${ADMIN_PAGES[@]}"; do
  IFS=':' read -r url name <<< "$page_info"
  
  HTTP_CODE=$(curl -b test_cookies.txt -s -o /dev/null -w "%{http_code}" "http://localhost:3000$url")
  
  if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✅ $name ($url)"
    test_results+=("$name:✅")
  else
    echo "❌ $name ($url) - HTTP $HTTP_CODE"
    test_results+=("$name:❌_$HTTP_CODE")
  fi
done

# API 엔드포인트 테스트
echo -e "\n🔌 API 엔드포인트 테스트..."

API_ENDPOINTS=(
  "/api/auth/verify:JWT_토큰_검증"
  "/api/sync-images:이미지_동기화"
)

for api_info in "${API_ENDPOINTS[@]}"; do
  IFS=':' read -r endpoint name <<< "$api_info"
  
  if [[ "$endpoint" == "/api/sync-images" ]]; then
    HTTP_CODE=$(curl -b test_cookies.txt -s -o /dev/null -w "%{http_code}" \
      -X POST "http://localhost:3000$endpoint" \
      -H "Content-Type: application/json" \
      -d '{"forceRepair":false}')
  else
    HTTP_CODE=$(curl -b test_cookies.txt -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint")
  fi
  
  if [[ "$HTTP_CODE" == "200" ]]; then
    echo "✅ $name ($endpoint)"
    test_results+=("API_$name:✅")
  else
    echo "❌ $name ($endpoint) - HTTP $HTTP_CODE"
    test_results+=("API_$name:❌_$HTTP_CODE")
  fi
done

# 보호된 경로 리디렉션 테스트
echo -e "\n🛡️ JWT 보호 경로 테스트..."
NO_AUTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/ko/admin")

if [[ "$NO_AUTH_CODE" == "307" || "$NO_AUTH_CODE" == "302" ]]; then
  echo "✅ 인증 없는 접근 리디렉션 정상"
  test_results+=("AUTH_PROTECTION:✅")
else
  echo "❌ 인증 보호 실패 - HTTP $NO_AUTH_CODE"
  test_results+=("AUTH_PROTECTION:❌_$NO_AUTH_CODE")
fi

# 최종 결과 요약
echo -e "\n📊 테스트 결과 요약"
echo "====================="

success_count=0
fail_count=0

for result in "${test_results[@]}"; do
  IFS=':' read -r test_name status <<< "$result"
  
  if [[ "$status" == "✅" ]]; then
    ((success_count++))
  else
    ((fail_count++))
  fi
  
  echo "$status $test_name"
done

echo -e "\n총 테스트: $((success_count + fail_count))개"
echo "성공: $success_count개 | 실패: $fail_count개"

if [[ $fail_count -eq 0 ]]; then
  echo -e "\n🎉 모든 테스트 통과! KHAKISHOP 어드민 시스템 완전 정상!"
else
  echo -e "\n⚠️  $fail_count개 테스트 실패. 우선순위 수정이 필요합니다."
fi

# 정리
rm -f test_cookies.txt

