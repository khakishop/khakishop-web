// placeholder 이미지 생성 유틸리티

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
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
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
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

export const ERROR_PLACEHOLDER_URL = createErrorPlaceholder(400, 300); 