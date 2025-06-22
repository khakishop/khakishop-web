'use client';

interface MenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function MenuButton({ onClick, isOpen }: MenuButtonProps) {
  return (
    <div className="fixed top-8 right-8 z-[60]">
      <button onClick={() => window.open("https://m.booking.naver.com/booking/13/bizes/966895", "_blank")} className="inline-flex items-center">
        <div className="group relative bg-white/6 backdrop-blur-md hover:bg-white/12 text-black px-3 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300 border border-white/20 shadow-lg">
          {/* Liquid glass background effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/12 via-white/20 to-white/6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Content */}
          <div className="relative flex items-center space-x-2 md:space-x-3">
            {/* Hamburger Icon */}
            <div className="w-3 h-3 md:w-5 md:h-5 flex flex-col justify-center items-center space-y-0.5 md:space-y-1 group-hover:scale-110 transition-transform duration-300">
              <div className={`w-3 md:w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-3 md:w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-3 md:w-5 h-0.5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-wider uppercase">
              {isOpen ? 'CLOSE' : 'MENU'}
            </span>
          </div>

          {/* Glass shine effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-gradient-to-b from-white/26 to-transparent opacity-38"></div>
        </div>
      </button>
    </div>
  );
} 