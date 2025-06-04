export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-light tracking-wide">
              RIGAS FURNITURE
            </div>
            <div className="hidden md:flex items-center space-x-12 text-sm uppercase tracking-wider">
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Collection</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">About</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Contact</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Shop</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-light text-gray-900 mb-8 tracking-tight">
              Experience<br />Refined Living
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Where timeless design, expert craftsmanship, and luxurious comfort 
              come together to elevate every space.
            </p>
            <button className="bg-black text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-800 transition-colors">
              Explore Collection
            </button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-light text-center mb-16 tracking-tight">Featured Products</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Product 1 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">Modern Dining Table</h3>
                <p className="text-gray-600 text-sm">€2,450</p>
              </div>
            </div>

            {/* Product 2 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">Luxury Armchair</h3>
                <p className="text-gray-600 text-sm">€1,890</p>
              </div>
            </div>

            {/* Product 3 */}
            <div className="group cursor-pointer">
              <div className="aspect-square bg-white mb-6 border border-gray-100 group-hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-full bg-gray-100"></div>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-light mb-2 tracking-wide">Designer Cabinet</h3>
                <p className="text-gray-600 text-sm">€3,120</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light mb-12 tracking-tight">Crafted for Excellence</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            For over three decades, we have been creating furniture that stands the test of time. 
            Each piece is meticulously crafted using traditional techniques combined with contemporary design sensibilities.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our commitment to quality and attention to detail ensures that every piece 
            becomes a cherished part of your home for generations to come.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-light mb-4 tracking-wide">RIGAS FURNITURE</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Timeless design meets expert craftsmanship
              </p>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-900">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Living Room</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Dining Room</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Bedroom</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Office</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-900">Company</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Craftmanship</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Showrooms</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-900">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-12 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Rigas Furniture. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 