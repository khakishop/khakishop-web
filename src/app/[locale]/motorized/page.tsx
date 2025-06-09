import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import MotorizedPageClient from './MotorizedPageClient';

// 🎨 SEO 메타데이터 - 모터라이즈 시스템
export const metadata = createSEOMetadata('motorized');

export default function MotorizedPage() {
  return <MotorizedPageClient />;
} 