// placeholder 이미지 생성 유틸리티

// UTF-8 문자열을 안전하게 base64로 인코딩하는 함수
const utf8ToBase64 = (str: string): string => {
  try {
    // 브라우저 환경에서 UTF-8을 안전하게 인코딩
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    // 폴백: URI 인코딩만 사용
    return encodeURIComponent(str);
  }
};

export const createPlaceholderDataURL = (
  width: number = 400, 
  height: number = 300,
  text?: string
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
        ${text || `${width} × ${height}`}
      </text>
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  } catch (error) {
    // base64 인코딩 실패 시 URI 인코딩 사용
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
};

export const PLACEHOLDER_DATA_URL = createPlaceholderDataURL(400, 300, '이미지 로딩 중...');

export const PLACEHOLDER_CARD_URL = createPlaceholderDataURL(280, 200, '썸네일');

// 이미지 로드 에러 시 사용할 fallback
export const createErrorPlaceholder = (width: number = 400, height: number = 300): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fee2e2"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="14" fill="#dc2626" text-anchor="middle">
        이미지를 불러올 수 없습니다
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="12" fill="#dc2626" text-anchor="middle">
        ${width} × ${height}
      </text>
    </svg>
  `;
  
  try {
    return `data:image/svg+xml;base64,${utf8ToBase64(svg)}`;
  } catch (error) {
    // base64 인코딩 실패 시 URI 인코딩 사용
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }
};

export const ERROR_PLACEHOLDER_URL = createErrorPlaceholder(400, 300); 