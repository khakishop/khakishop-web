export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <nav className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-light tracking-wide text-white">
              khaki shop
            </div>
            <div className="hidden md:flex items-center space-x-12 text-sm uppercase tracking-wider">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">컬렉션</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">소개</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">연락처</a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">쇼핑</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Cinematic Style */}
      <section className="relative h-screen bg-gray-900">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-6">
            <h1 className="text-6xl md:text-8xl font-light text-white mb-8 tracking-tight">
              세련된<br />라이프스타일을<br />경험하세요
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-12 leading-relaxed">
              시대를 초월한 디자인, 전문적인 장인정신, 그리고 럭셔리한 편안함이 만나 
              모든 공간을 한층 더 격상시켜 드립니다.
            </p>
            <button className="bg-white text-gray-900 px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-100 transition-colors">
              컬렉션 둘러보기
            </button>
          </div>
        </div>
        
        {/* Bottom Right Text */}
        <div className="absolute bottom-8 right-8 text-white">
          <div className="text-right">
            <div className="text-sm uppercase tracking-wider mb-1 opacity-80">50년간의</div>
            <div className="text-sm uppercase tracking-wider mb-1 opacity-80">품질</div>
            <div className="text-sm uppercase tracking-wider mb-1 opacity-80">경험과</div>
            <div className="text-sm uppercase tracking-wider opacity-80">철학</div>
          </div>
          <div className="text-6xl md:text-8xl font-light mt-4 leading-none">
            khaki shop
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-16 tracking-tight">추천 제품</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">모던 다이닝 테이블</h3>
                <p className="text-gray-600 text-sm">₩2,450,000</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">럭셔리 안락의자</h3>
                <p className="text-gray-600 text-sm">₩1,890,000</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">디자이너 수납장</h3>
                <p className="text-gray-600 text-sm">₩3,120,000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-12 tracking-tight">완벽함을 위한 장인정신</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            30년이 넘는 세월 동안, 우리는 시간이 흘러도 변치 않는 가구를 만들어왔습니다. 
            모든 제품은 전통적인 기법과 현대적인 디자인 감각을 조화롭게 결합하여 세심하게 제작됩니다.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            품질에 대한 우리의 헌신과 디테일에 대한 관심은 모든 제품이 
            여러 세대에 걸쳐 소중한 가정의 일부가 될 수 있도록 보장합니다.
          </p>
        </div>
      </section>
    </div>
  )
} 