'use client';

import React from 'react';
import { motion } from "../../lib/motion";

interface CategoryPageProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CategoryPage: React.FC<CategoryPageProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-6 text-center">
          <motion.h1
            className="text-4xl lg:text-6xl xl:text-7xl font-serif text-gray-900 leading-tight tracking-tight mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-lg lg:text-xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {description}
          </motion.p>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className="py-20 lg:py-32">
        <div className="max-w-screen-xl mx-auto px-6">{children}</div>
      </section>
    </div>
  );
};

export default CategoryPage;
