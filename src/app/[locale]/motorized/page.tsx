import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import MotorizedClientView from '../../../components/MotorizedClientView';

// 🎨 SEO 메타데이터 - 전동 시스템 컬렉션
export const metadata = createSEOMetadata('motorized');

export default function MotorizedPage() {
  return <MotorizedClientView />;
}
