export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm fixed w-full top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">KHAKI SHOP</h1>
            </div>
            <div className="hidden md:flex items-baseline space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">HOME</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">FURNITURE</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">LIGHTING</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">DECOR</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">CONTACT</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2058&q=80")'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-light mb-6">Premium Furniture</h1>
            <p className="text-xl md:text-2xl mb-8 font-light">Discover our collection of handcrafted furniture</p>
            <button className="bg-white text-gray-900 px-8 py-3 text-lg font-medium hover:bg-gray-100 transition-colors">
              EXPLORE COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-light text-center mb-16">Our Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-medium">Living Room</h3>
              </div>
            </div>
            <div className="relative overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-medium">Bedroom</h3>
              </div>
            </div>
            <div className="relative overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-gray-200"></div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-white text-xl font-medium">Dining Room</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KHAKI SHOP</h3>
              <p className="text-gray-400">Premium furniture for your home</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-400">Email: info@khakishop.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 