import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            KAKI SHOP
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link
              href="/collections"
              className="text-gray-600 hover:text-gray-900"
            >
              Collections
            </Link>
            <Link
              href="/custom-design"
              className="text-gray-600 hover:text-gray-900"
            >
              Custom Design
            </Link>
            <Link
              href="/installation"
              className="text-gray-600 hover:text-gray-900"
            >
              Installation
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>

          <button className="md:hidden">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
