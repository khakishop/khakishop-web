'use client';

import React, { memo } from 'react';
import { motion } from "../lib/motion";
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../data/projects';

export interface ReferenceCardProps {
  project: Project;
  index?: number;
}

const ReferenceCard = memo(function ReferenceCard({
  project,
  index = 0,
}: ReferenceCardProps) {
  // 안전성 검사
  if (!project || !project.slug) {
    console.error(
      'ReferenceCard: project is undefined or missing slug',
      project
    );
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <Link href={`/references/${project.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={project.mainImage || '/placeholder-project.jpg'}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/90 text-[#8B7A6B] text-xs font-medium rounded-full">
              {project.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-medium text-[#8B7A6B] group-hover:text-[#D4C4A8] transition-colors">
              {project.title}
            </h3>
            <span className="text-sm text-[#8B7A6B]/60">{project.year}</span>
          </div>

          <p className="text-[#8B7A6B]/70 text-sm mb-3">
            📍 {project.location}
          </p>

          <p className="text-[#8B7A6B]/70 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {project.features && project.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-[#F7F5F3] text-[#8B7A6B] text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          {project.area && (
            <div className="mt-3 pt-3 border-t border-[#F7F5F3]">
              <span className="text-xs text-[#8B7A6B]/60">
                시공 면적: {project.area}
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
});

ReferenceCard.displayName = 'ReferenceCard';

export default ReferenceCard;
