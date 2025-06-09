import React from 'react';
import { createSEOMetadata } from '../../../utils/seoMetadata';
import ProjectClientView from '../../../components/ProjectClientView';

// 🎨 SEO 메타데이터 - 프로젝트 컬렉션
export const metadata = createSEOMetadata('references');

export default function ProjectPage() {
  return <ProjectClientView />;
} 