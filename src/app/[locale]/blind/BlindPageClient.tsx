'use client';

import CategoryPage from '../../../components/layouts/CategoryPage';
import ProductCard from '../../../components/ProductCard';
import HomeButton from '../../../components/ui/HomeButton';
import { blindProducts } from '../../../data/products';
import { motion } from "../../../lib/motion";

export default function BlindPageClient() {
  return (
    <div className="min-h-screen bg-white">
      <HomeButton />
      <CategoryPage
        title="BLIND"
        description="빛을 조절하고 공간을 정돈하는 실용적 선택, 블라인드 컬렉션"
      >
        {/* 제품 소개 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {blindProducts.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>

        {/* 하단 CTA 섹션 */}
        <motion.div
          className="bg-gray-100 rounded-lg p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-noto-kr">
            맞춤 블라인드 상담 받기
          </h2>
          <p className="text-gray-600 mb-8 font-noto-kr font-light">
            창의 크기와 공간 특성에 맞는 최적의 블라인드를 제안해드립니다.
            <br />빛 조절과 인테리어 효과를 모두 고려한 솔루션을 만나보세요.
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium font-noto-kr">
            상담 신청하기
          </button>
        </motion.div>
      </CategoryPage>
    </div>
  );
}
