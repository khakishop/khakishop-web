import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getAllProjects } from '../../../../data/projects';

interface ProjectDetailPageProps {
  params: { slug: string; locale: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug(params.slug);
  const locale = params.locale || 'ko';

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href={`/${locale}/project`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          ← 모든 프로젝트
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{project.location}</p>
        
        <div className="prose max-w-none">
          <p>{project.description}</p>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const projects = getAllProjects();
  
  return projects.map((project) => ({
    slug: project.slug,
  }));
}
