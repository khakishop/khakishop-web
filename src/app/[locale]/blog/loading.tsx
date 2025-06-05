export default function BlogLoadingSkeleton() {
  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 lg:gap-16">
          {/* 스켈레톤 카드들 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <article key={index} className="space-y-6 animate-pulse">
              
              {/* 커버 이미지 스켈레톤 */}
              <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl"></div>

              {/* 태그 스켈레톤 */}
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
              </div>

              {/* 포스트 내용 스켈레톤 */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>

              {/* 메타 정보 스켈레톤 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                </div>
                
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
} 