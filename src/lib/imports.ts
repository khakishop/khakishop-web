// ================================================================================
// 🎯 KHAKISHOP - 중앙화된 Import 표준화 시스템
// ================================================================================
// 목적: import 불일치로 인한 오류 방지 및 의존성 관리 개선

// ⚛️ React Standardization
export {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  memo,
  type ReactNode,
  type FC,
  type ComponentProps,
} from 'react';

// 🔗 Navigation Standardization
export { default as Link } from 'next/link';
export { useRouter, usePathname, useSearchParams } from 'next/navigation';

// 🖼️ Image Library Standardization
export { default as Image } from 'next/image';
export type { ImageProps } from 'next/image';

// 📊 Data Fetching Standards
export type { ApiResponse, ErrorResponse } from '../types/api';

// 🔒 Validation Standards
export { z } from 'zod';
export type { ZodSchema } from 'zod';
