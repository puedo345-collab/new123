import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FAQ_ITEMS } from '../data';
import { ArrowLeft, Search, HelpCircle, ChevronDown, ChevronUp, Sparkles, X, AlertCircle } from 'lucide-react';
import { FAQItem } from '../types';

interface FAQPageProps {
  onBack: () => void;
  faqs?: FAQItem[];
}

export default function FAQPage({ onBack, faqs = [] }: FAQPageProps) {
  const currentFaqs = faqs.length > 0 ? faqs : FAQ_ITEMS;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'eligibility' | 'harassment' | 'investment' | 'etc'>('all');
  const [activeFaq, setActiveFaq] = useState<string | number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset page on search or category filter change
  useEffect(() => {
    setCurrentPage(1);
    setActiveFaq(null);
  }, [searchQuery, selectedCategory]);

  // Scroll to top on mount
  useEffect(() => {
    const forceScrollTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      const mainWrap = document.getElementById('main-landing-wrap');
      if (mainWrap) {
        mainWrap.scrollTop = 0;
      }
      const mainStage = document.getElementById('landing-main-stage');
      if (mainStage) {
        mainStage.scrollTop = 0;
      }
    };
    
    forceScrollTop();
    const t1 = setTimeout(forceScrollTop, 30);
    const t2 = setTimeout(forceScrollTop, 100);
    const t3 = setTimeout(forceScrollTop, 250);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  // Listen to deep linking events (e.g. Worry Chip clicks or direct routes)
  useEffect(() => {
    const handleExpandFaq = (e: Event) => {
      const customEvent = e as CustomEvent<{ faqId: string | number | null }>;
      if (customEvent.detail && customEvent.detail.faqId !== null) {
        const id = customEvent.detail.faqId;
        setActiveFaq(id);
        
        // Reset search and category filters if deep link targets a specific FAQ
        setSearchQuery('');
        setSelectedCategory('all');

        setTimeout(() => {
          const faqItem = document.getElementById(`faq-page-item-${id}`);
          if (faqItem) {
            faqItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      } else if (customEvent.detail && customEvent.detail.faqId === null) {
        setActiveFaq(null);
      }
    };

    window.addEventListener('expand-faq', handleExpandFaq);
    return () => {
      window.removeEventListener('expand-faq', handleExpandFaq);
    };
  }, []);

  // Sync state with popstate (e.g. Back button or URL updates)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/faq/')) {
        const id = path.substring('/faq/'.length);
        if (id) {
          const numId = parseInt(id, 10);
          setActiveFaq(isNaN(numId) ? id : numId);
        }
      } else {
        setActiveFaq(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Categorize FAQ items
  const getCategory = (id: number | string): 'eligibility' | 'harassment' | 'investment' | 'etc' => {
    const idStr = String(id);
    const numMatch = idStr.match(/\d+/);
    const numericId = numMatch ? parseInt(numMatch[0], 10) : NaN;
    
    if (numericId === 8 || numericId === 9) return 'eligibility';
    if (numericId === 1 || numericId === 3 || numericId === 4) return 'harassment';
    if (numericId === 2 || numericId === 5) return 'investment';
    return 'etc';
  };

  // Categories list metadata
  const categories = [
    { id: 'all', label: '전체 질문' },
    { id: 'eligibility', label: '신청 자격 요건' },
    { id: 'harassment', label: '독촉 및 압류 방어' },
    { id: 'investment', label: '최근대출 및 투자 손실' },
    { id: 'etc', label: '비밀 보장 및 기타' }
  ] as const;

  // Filter items based on category and search query
  const filteredFaqs = currentFaqs.filter((item) => {
    const category = getCategory(item.id);
    const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
    
    const cleanQuery = searchQuery.trim().toLowerCase();
    const matchesSearch = 
      cleanQuery === '' ||
      item.question.toLowerCase().includes(cleanQuery) ||
      item.answer.toLowerCase().includes(cleanQuery);

    return matchesCategory && matchesSearch;
  });

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredFaqs.length / ITEMS_PER_PAGE);
  const paginatedFaqs = filteredFaqs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleFaqClick = (id: number) => {
    const isSelected = activeFaq === id;
    const nextFaq = isSelected ? null : id;
    setActiveFaq(nextFaq);
    
    if (nextFaq) {
      window.history.pushState({ type: 'faqPage', faqId: nextFaq }, '', `/faq/${nextFaq}`);
    } else {
      window.history.pushState({ type: 'faqPage' }, '', '/faq');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-[#FAF9F5] min-h-screen pt-2 pb-16 md:pt-6 lg:pt-8 md:pb-24 text-slate-800 font-sans break-keep"
      id="faq-page-wrap"
      ref={containerRef}
    >
      <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Navigation Breadcrumb Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-amber-700 font-extrabold text-sm transition-colors cursor-pointer mb-4"
          id="faq-page-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          메인 화면으로 돌아가기
        </button>

        {/* Beautiful Header Header Section */}
        <div className="text-center mb-4 md:mb-6">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight px-1 leading-[1.15] font-sans">
              개인회생 · 파산 FAQ
            </h1>
          </div>
        </div>

        {/* Live Search Bar Component */}
        <div className="max-w-md md:max-w-lg mx-auto mb-6 px-4">
          <div className="relative bg-white border border-slate-200 shadow-sm focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/5 rounded-full transition-all duration-300">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="무엇이든 검색해 보세요..."
              className="w-full pl-12 pr-10 py-3 sm:py-3.5 bg-transparent outline-none border-none text-base font-bold text-slate-800 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                title="검색어 지우기"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Categories Horizontal Tab Bar */}
        <div className="faq-tabs-container mb-8 max-w-4xl mx-auto px-4 overflow-x-auto">
          <style>{`
            .faq-tabs-container::-webkit-scrollbar {
              display: none;
            }
            .faq-tabs-container {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div className="flex sm:flex-wrap items-center sm:justify-center gap-2 pb-2 min-w-max sm:min-w-0 mx-auto justify-start">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveFaq(null); // Close active FAQ on category change
                }}
                className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer border shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic FAQ list */}
        <div className="max-w-3xl mx-auto space-y-4 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {paginatedFaqs.length > 0 ? (
              paginatedFaqs.map((faq) => {
                const isSelected = activeFaq === faq.id;

                return (
                  <motion.div
                    key={faq.id}
                    id={`faq-page-item-${faq.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className={`rounded-3xl border transition-all duration-200 scroll-mt-24 ${
                      isSelected 
                        ? 'border-amber-400 bg-amber-50/15 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-350 hover:shadow-xs'
                    }`}
                  >
                    <button
                      onClick={() => handleFaqClick(faq.id)}
                      className="w-full px-6 py-5 text-left font-bold text-[17px] sm:text-[18px] text-slate-800 hover:bg-slate-50/50 flex justify-between items-start gap-4 cursor-pointer"
                    >
                      <span className="flex items-start gap-3 w-full text-justify flex-1">
                        <HelpCircle className={`w-5 h-5 shrink-0 mt-1 ${
                          isSelected ? 'text-amber-600' : 'text-slate-400'
                        }`} />
                        <div className="flex-1">
                          <span className="block text-justify break-all w-full leading-normal text-slate-900 font-extrabold">{faq.question}</span>
                        </div>
                      </span>
                      {isSelected ? (
                        <ChevronUp className="w-5 h-5 text-slate-550 shrink-0 mt-1.5" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-450 shrink-0 mt-1.5" />
                      )}
                    </button>

                    {isSelected && (
                      <div className="px-6 pb-6 pt-3 text-[15px] sm:text-[16px] md:text-[18px] text-slate-655 font-bold leading-relaxed border-t border-slate-100/50 bg-slate-50/20 text-justify break-all w-full font-sans">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center bg-white border border-slate-200 rounded-3xl"
              >
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-base font-bold text-slate-500">검색어와 일치하는 질문이 없습니다.</p>
                <p className="text-xs font-semibold text-slate-400 mt-1">다른 검색어를 입력하거나 카테고리를 변경해 보세요.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl transition-all cursor-pointer"
                >
                  필터 및 검색 초기화
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10 mb-6 font-sans">
            <button
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-3xs"
            >
              이전
            </button>
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-9 h-9 rounded-xl font-black text-xs transition-all cursor-pointer border ${
                    currentPage === pageNum
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-extrabold text-xs disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-3xs"
            >
              다음
            </button>
          </div>
        )}

        {/* Bottom Back to Main Button */}
        <div className="mt-16 md:mt-24 lg:mt-32 text-center pb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-[16px] sm:text-[17px] tracking-tight hover:bg-slate-850 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl border border-slate-800"
            id="faq-page-bottom-back-btn"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            메인 페이지로 이동하기
          </button>
        </div>

      </div>
    </motion.div>
  );
}
