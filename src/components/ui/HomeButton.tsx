'use client';

import { useParams } from 'next/navigation';
import { LocalizedLink } from './LocalizedLink';

export default function HomeButton() {
  const params = useParams();
  const locale = params?.locale as string || 'ko';

  return (
    <div className="fixed top-8 left-8 z-50">
      <LocalizedLink href="/" className="inline-flex items-center">
        <div className="bg-black/80 hover:bg-black text-white px-4 py-2 rounded-lg backdrop-blur-sm shadow-lg border border-white/20 transition-all duration-300 group">
          <div className="flex items-center space-x-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:-translate-x-0.5 transition-transform duration-300"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="text-sm font-medium tracking-wide uppercase">HOME</span>
          </div>
        </div>
      </LocalizedLink>
    </div>
  );
} 