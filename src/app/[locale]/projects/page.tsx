import ProjectClientView from '../../../components/ProjectClientView';
import { createSEOMetadata } from '../../../utils/seoMetadata';

// 🎨 SEO 메타데이터 - 프로젝트 컬렉션
export const metadata = createSEOMetadata('references');

export default function ProjectsPage() {
  return <ProjectClientView />;
} 