// ================================================================================
// 🎨 KHAKISHOP 이미지 파일 검증 유틸리티
// ================================================================================
// 🎯 목적: 드래그앤드롭 업로드 시 허용 확장자 제한
// 🚫 차단: .svg, .webp, .gif 등
// ✅ 허용: .jpg, .jpeg, .png만

export interface ImageValidationResult {
  isValid: boolean;
  message: string;
  suggestedAction?: string;
}

// 허용되는 이미지 확장자
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png'
] as const;

// 차단되는 확장자와 이유
const BLOCKED_EXTENSIONS = {
  '.svg': 'SVG는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.',
  '.webp': 'WebP는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.',
  '.gif': 'GIF는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.',
  '.bmp': 'BMP는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.',
  '.tiff': 'TIFF는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.',
  '.ico': 'ICO는 현재 지원하지 않습니다. JPG 또는 PNG로 변환해주세요.'
} as const;

/**
 * 파일 확장자 검증
 */
export function validateFileExtension(fileName: string): ImageValidationResult {
  const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  // 허용된 확장자 체크
  if (ALLOWED_EXTENSIONS.includes(fileExtension as any)) {
    return {
      isValid: true,
      message: `✅ ${fileExtension.toUpperCase()} 파일이 업로드됩니다.`
    };
  }
  
  // 차단된 확장자 체크
  if (fileExtension in BLOCKED_EXTENSIONS) {
    return {
      isValid: false,
      message: BLOCKED_EXTENSIONS[fileExtension as keyof typeof BLOCKED_EXTENSIONS],
      suggestedAction: '이미지 편집 도구로 JPG 또는 PNG 형식으로 저장해주세요.'
    };
  }
  
  // 알 수 없는 확장자
  return {
    isValid: false,
    message: `지원되지 않는 파일 형식입니다: ${fileExtension}`,
    suggestedAction: 'JPG, JPEG, PNG 형식만 업로드 가능합니다.'
  };
}

/**
 * MIME 타입 검증
 */
export function validateMimeType(file: File): ImageValidationResult {
  if (!file.type) {
    return {
      isValid: false,
      message: '파일 형식을 확인할 수 없습니다.',
      suggestedAction: '파일 확장자가 올바른지 확인해주세요.'
    };
  }
  
  if (ALLOWED_MIME_TYPES.includes(file.type as any)) {
    return {
      isValid: true,
      message: `✅ ${file.type} 형식이 업로드됩니다.`
    };
  }
  
  return {
    isValid: false,
    message: `지원되지 않는 파일 형식입니다: ${file.type}`,
    suggestedAction: 'JPG, JPEG, PNG 형식만 업로드 가능합니다.'
  };
}

/**
 * 파일 크기 검증 (선택사항)
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): ImageValidationResult {
  const fileSizeMB = file.size / (1024 * 1024);
  
  if (fileSizeMB > maxSizeMB) {
    return {
      isValid: false,
      message: `파일 크기가 너무 큽니다: ${fileSizeMB.toFixed(2)}MB`,
      suggestedAction: `${maxSizeMB}MB 이하로 압축해주세요.`
    };
  }
  
  return {
    isValid: true,
    message: `✅ 파일 크기가 적절합니다: ${fileSizeMB.toFixed(2)}MB`
  };
}

/**
 * 종합 이미지 파일 검증
 */
export function validateImageFile(file: File, maxSizeMB: number = 10): ImageValidationResult {
  // 1. 파일 확장자 검증
  const extensionResult = validateFileExtension(file.name);
  if (!extensionResult.isValid) {
    return extensionResult;
  }
  
  // 2. MIME 타입 검증
  const mimeResult = validateMimeType(file);
  if (!mimeResult.isValid) {
    return mimeResult;
  }
  
  // 3. 파일 크기 검증
  const sizeResult = validateFileSize(file, maxSizeMB);
  if (!sizeResult.isValid) {
    return sizeResult;
  }
  
  return {
    isValid: true,
    message: `✅ ${file.name} 파일이 업로드 준비되었습니다.`
  };
}

/**
 * 드래그앤드롭에서 이미지 파일만 필터링
 */
export function filterImageFiles(files: FileList | File[]): { validFiles: File[]; errors: string[] } {
  const validFiles: File[] = [];
  const errors: string[] = [];
  
  Array.from(files).forEach(file => {
    const result = validateImageFile(file);
    if (result.isValid) {
      validFiles.push(file);
    } else {
      errors.push(`${file.name}: ${result.message}`);
    }
  });
  
  return { validFiles, errors };
}

/**
 * 허용된 확장자 목록 반환
 * @returns {string[]} 허용된 파일 확장자 배열
 */
export function getAllowedExtensions(): string[] {
  return [...ALLOWED_EXTENSIONS];
}

/**
 * 허용된 MIME 타입 배열 반환 (accept 속성에서 join 사용)
 * @returns {string[]} 허용된 MIME 타입 배열
 * @example
 * // 사용 예시: <input accept={getAcceptMimeTypes().join(',')} />
 * const mimeTypes = getAcceptMimeTypes(); // ['image/jpeg', 'image/png']
 */
export function getAcceptMimeTypes(): string[] {
  try {
    return [...ALLOWED_MIME_TYPES];
  } catch (error) {
    console.warn('getAcceptMimeTypes: 기본값 반환', error);
    return ['image/jpeg', 'image/png']; // fallback
  }
}

/**
 * accept 속성에 사용할 MIME 타입 문자열 반환 (직접 사용)
 * @returns {string} 쉼표로 구분된 MIME 타입 문자열
 * @example
 * // 사용 예시: <input accept={getAcceptMimeTypesString()} />
 * const acceptString = getAcceptMimeTypesString(); // "image/jpeg,image/png"
 */
export function getAcceptMimeTypesString(): string {
  try {
    return ALLOWED_MIME_TYPES.join(',');
  } catch (error) {
    console.warn('getAcceptMimeTypesString: 기본값 반환', error);
    return 'image/jpeg,image/png'; // fallback
  }
}

// 🧪 개발 환경에서 함수 검증
if (process.env.NODE_ENV === 'development') {
  // getAcceptMimeTypes가 배열을 반환하는지 확인
  const testMimeTypes = getAcceptMimeTypes();
  if (!Array.isArray(testMimeTypes)) {
    console.error('❌ getAcceptMimeTypes는 배열을 반환해야 합니다:', testMimeTypes);
  }
  
  // getAcceptMimeTypesString이 문자열을 반환하는지 확인
  const testMimeString = getAcceptMimeTypesString();
  if (typeof testMimeString !== 'string') {
    console.error('❌ getAcceptMimeTypesString은 문자열을 반환해야 합니다:', testMimeString);
  }
  
  console.log('✅ validateImageFile 함수 검증 완료:', {
    mimeTypesArray: testMimeTypes,
    mimeTypesString: testMimeString,
    allowedExtensions: getAllowedExtensions()
  });
} 