'use client';
import { motion } from 'framer-motion';

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

      {/* Hero Section - Clean Modern Style */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("/hero.jpg")'
          }}
        ></div>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Logo in Top-Left */}
        <motion.div
          initial={{ opacity: 0, rotate: -5, scale: 0.9 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-8 left-8 z-10"
        >
          <div className="text-white text-4xl md:text-5xl lg:text-6xl flex items-baseline">
            <span className="font-montserrat font-bold">khaki</span>
            <span className="font-dm-serif italic ml-2">shop</span>
          </div>
        </motion.div>

        {/* Scrolling Marquee at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-4 overflow-hidden">
          <motion.div
            animate={{ x: ['100%', '-100%'] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex whitespace-nowrap"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-baseline mx-8 text-2xl md:text-3xl">
                <span className="font-montserrat font-bold">khaki</span>
                <span className="font-dm-serif italic ml-2">shop</span>
              </div>
            ))}
          </motion.div>
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