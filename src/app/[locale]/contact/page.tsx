'use client';

import { motion } from "../../../lib/motion";

export default function ContactPage() {
  // 페이지 애니메이션 variants
  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    initial: {
      opacity: 0,
      y: 30,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const mapVariants = {
    initial: {
      opacity: 0,
      x: -50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  const infoVariants = {
    initial: {
      opacity: 0,
      x: 50,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {/* RIGAS 스타일 히어로 섹션 */}
        <section className="py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-8">
              {/* 메인 타이틀 */}
              <h1 className="text-5xl lg:text-7xl font-serif tracking-tight text-gray-900">
                Contact
              </h1>

              {/* 서브 설명 */}
              <p className="text-xl lg:text-2xl text-gray-600 font-light leading-relaxed max-w-3xl mx-auto">
                카키샵은 항상 공간에 대한 당신의 생각을 기다립니다.
              </p>
            </motion.div>
          </div>
        </section>

        {/* 메인 컨택트 섹션 */}
        <section className="pb-24 lg:pb-32">
          <div className="max-w-7xl mx-auto px-6 md:px-20">
            <div className="flex flex-col lg:flex-row gap-16">
              {/* 좌측: 지도 영역 */}
              <motion.div variants={mapVariants} className="flex-1">
                <div className="aspect-[4/3] lg:aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {/* Google Maps iframe */}
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3167.8234567890123!2d126.7834567890123!3d37.6789012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQwJzQ0LjAiTiAxMjbCsDQ3JzAwLjAiRQ!5e0!3m2!1sko!2skr!4v1234567890123!5m2!1sko!2skr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="카키샵 위치"
                    className="w-full h-full"
                  ></iframe>

                  {/* 지도 로딩 실패시 플레이스홀더 */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-gray-400 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-medium">매장 위치</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 우측: 연락처 정보 */}
              <motion.div variants={infoVariants} className="flex-1 space-y-12">
                {/* 매장 주소 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif tracking-tight text-gray-900">
                    매장 주소
                  </h3>
                  <div className="text-lg text-gray-700 space-y-2 leading-relaxed">
                    <p>일산동구 호수로 430번길 24 1층</p>
                    <p className="font-medium">카키샵 (khaki shop)</p>
                  </div>
                </div>

                {/* 대표 번호 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif tracking-tight text-gray-900">
                    대표 번호
                  </h3>
                  <div className="text-lg text-gray-700">
                    <a
                      href="tel:0507-1372-0358"
                      className="hover:text-gray-900 transition-colors font-medium"
                    >
                      0507-1372-0358
                    </a>
                  </div>
                </div>

                {/* 이메일 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif tracking-tight text-gray-900">
                    이메일
                  </h3>
                  <div className="text-lg text-gray-700">
                    <a
                      href="mailto:lskshsrl@naver.com"
                      className="hover:text-gray-900 transition-colors font-medium"
                    >
                      lskshsrl@naver.com
                    </a>
                  </div>
                </div>

                {/* 운영 시간 */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif tracking-tight text-gray-900">
                    운영 시간
                  </h3>
                  <div className="text-lg text-gray-700 space-y-2 leading-relaxed">
                    <p>오전 10:00 ~ 오후 8:00</p>
                    <p className="text-base text-gray-500 italic">
                      *정기휴무: 매주 일요일 (협의 가능)
                    </p>
                  </div>
                </div>

                {/* CTA 버튼들 */}
                <div className="pt-8 space-y-4">
                  <button className="w-full sm:w-auto rounded-full bg-black text-white px-8 py-3 hover:bg-gray-800 transition-colors duration-300 text-sm uppercase tracking-wider font-medium">
                    상담 예약하기
                  </button>

                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <a
                      href="https://naver.me/F0wo4Ive"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-900 pb-1"
                    >
                      네이버 플레이스
                    </a>
                    <a
                      href="tel:0507-1372-0358"
                      className="text-gray-600 hover:text-gray-900 transition-colors text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-900 pb-1"
                    >
                      전화 걸기
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 추가 정보 섹션 */}
        <section className="py-20 lg:py-24 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-12">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-gray-900">
                Visit Our Showroom
              </h2>

              <div className="space-y-8">
                <p className="text-xl lg:text-2xl text-gray-600 font-light italic leading-relaxed">
                  "실제 패브릭을 만져보고, 공간에서 직접 확인해보세요."
                </p>

                <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
                  카키샵 쇼룸에서는 다양한 텍스타일 샘플을 직접 체험하실 수
                  있습니다. 전문 컨설턴트와 함께 당신의 공간에 가장 적합한
                  솔루션을 찾아보세요.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA 섹션 - RIGAS 스타일 */}
        <section className="py-20 lg:py-32 bg-gray-900">
          <div className="max-w-3xl mx-auto text-center px-6">
            <motion.div variants={itemVariants} className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-serif tracking-tight text-white">
                언제든 문의하세요
              </h2>

              <p className="text-lg text-gray-300 leading-relaxed">
                공간에 대한 고민이나 텍스타일 상담이 필요하시면
                <br />
                언제든 연락주세요. 전문가가 친절히 도움드리겠습니다.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <a
                  href="tel:0507-1372-0358"
                  className="bg-white text-gray-900 px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300 text-sm uppercase tracking-wider font-medium"
                >
                  지금 전화하기
                </a>
                <a
                  href="mailto:lskshsrl@naver.com"
                  className="text-white hover:text-gray-300 transition-colors duration-300 text-sm uppercase tracking-wider font-medium border-b border-transparent hover:border-gray-300"
                >
                  이메일 보내기
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </div>
  );
}
