'use client';
import { motion, AnimatePresence } from "../lib/motion";
import { useState } from 'react';
import Image from 'next/image';

interface AccordionItemProps {
  title: string;
  image: string;
  alt: string;
  description: string;
}

export function AccordionItem({
  title,
  image,
  alt,
  description,
}: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 text-left flex items-center justify-between group focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-inset"
      >
        <h3 className="text-2xl font-light tracking-wide text-gray-800 group-hover:text-gray-600 transition-colors">
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="w-6 h-6 flex items-center justify-center"
        >
          <div className="w-4 h-px bg-gray-400 absolute"></div>
          <div className="w-px h-4 bg-gray-400 absolute"></div>
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1],
              opacity: { duration: 0.3 },
            }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <p className="text-gray-600 leading-relaxed text-lg font-light">
                    {description}
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="pt-4"
                  >
                    <button className="text-sm uppercase tracking-wider text-gray-500 hover:text-gray-700 transition-colors font-medium">
                      자세히 보기 →
                    </button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
