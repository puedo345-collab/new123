import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BookOpen, 
  Search, 
  Filter, 
  ArrowRight, 
  Award, 
  ChevronLeft, 
  ChevronDown,
  ShieldCheck, 
  Calendar, 
  Eye, 
  X,
  FileText,
  Clock,
  Sparkles,
  Scale
} from 'lucide-react';

interface Article {
  id: string;
  category: string;
  title: string;
  age?: string;
  job?: string;
  originalDebt?: string;
  reducedDebt?: string;
  monthlyPayment?: string;
  reductionRate?: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  views?: number;
}

interface SuccessColumnPageProps {
  onBack: () => void;
  onSelectPlan: (answers: { occupation: string; debtAmount: string }) => void;
  initialTab?: 'matcher' | 'columns';
}

export default function SuccessColumnPage({ onBack, onSelectPlan, initialTab = 'matcher' }: SuccessColumnPageProps) {
  const [activeSubTab, setActiveSubTab] = useState<'matcher' | 'columns'>(initialTab);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Success stories filter states
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedDebt, setSelectedDebt] = useState<string>('all');

  // Selected article for detailed reading overlay
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Accordion state to collapse and expand stories smoothly
  const [expandedStoryId, setExpandedStoryId] = useState<string | null>(null);

  const jobs = [
    { value: 'all', label: '전체 직업' },
    { value: 'employee', label: '일반 직장인' },
    { value: 'freelancer', label: '프리랜서 / 일용직' },
    { value: 'business', label: '개인사업자' }
  ];

  const debts = [
    { value: 'all', label: '전체 금액' },
    { value: 'under_50m', label: '5천만 원 미만' },
    { value: 'over_50m', label: '5천만 원 이상' }
  ];

  // Fetch articles from the server DB
  useEffect(() => {
    setLoading(true);
    fetch('/api/articles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setArticles(data);
        }
      })
      .catch(err => console.error("Error loading articles:", err))
      .finally(() => setLoading(false));
  }, []);

  // Sync tab with initialTab props if provided
  useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  // Handle popstate for overlays
  useEffect(() => {
    const handlePopState = () => {
      if (selectedArticle) {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedArticle]);

  const handleOpenArticle = (art: Article) => {
    window.history.pushState({ type: 'articleView' }, '');
    
    // Fetch individual article to trigger view count increment
    fetch(`/api/articles/${art.id}`)
      .then(res => res.json())
      .then(updated => {
        setSelectedArticle(updated);
        // Sync local views count increment
        setArticles(prev => prev.map(a => a.id === art.id ? { ...a, views: (a.views || 0) + 1 } : a));
      })
      .catch(() => setSelectedArticle(art));
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    if (window.history.state?.type === 'articleView') {
      window.history.back();
    }
  };

  const getFilteredStories = () => {
    return articles.filter((art) => {
      if (art.category === "칼럼") return false;

      // Filter by job category
      let matchJob = true;
      if (selectedJob !== 'all' && art.job) {
        if (selectedJob === 'employee') {
          matchJob = art.job.includes('직장인') || art.job.includes('사원') || art.job.includes('회사원');
        } else if (selectedJob === 'freelancer') {
          matchJob = art.job.includes('프리랜서') || art.job.includes('강사') || art.job.includes('일용직');
        } else if (selectedJob === 'business') {
          matchJob = art.job.includes('사업자') || art.job.includes('자영업') || art.job.includes('매장') || art.job.includes('업주');
        }
      }

      // Filter by debt amount
      let matchDebt = true;
      if (selectedDebt !== 'all' && art.originalDebt) {
        const isEok = art.originalDebt.includes('억');
        const numPart = parseFloat(art.originalDebt.replace(/[^0-9.]/g, ''));
        const debtVal = isEok ? numPart * 10000 : numPart; // in man-won

        if (selectedDebt === 'under_50m') {
          matchDebt = debtVal < 5000;
        } else if (selectedDebt === 'over_50m') {
          matchDebt = debtVal >= 5000;
        }
      }

      // Filter by search query (title or content)
      let matchSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchSearch = 
          art.title.toLowerCase().includes(query) || 
          art.content.toLowerCase().includes(query);
      }

      return matchJob && matchDebt && matchSearch;
    });
  };

  const getFilteredColumns = () => {
    return articles.filter((art) => {
      if (art.category !== "칼럼") return false;

      let matchSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        matchSearch = 
          art.title.toLowerCase().includes(query) || 
          art.content.toLowerCase().includes(query);
      }
      return matchSearch;
    });
  };

  const handleApplyMatch = (story: Article) => {
    let occOpt = 'regular_employee';
    if (story.job?.includes('프리랜서') || story.job?.includes('일용직') || story.job?.includes('강사')) {
      occOpt = 'freelancer_parttime';
    } else if (story.job?.includes('사업자') || story.job?.includes('자영업') || story.job?.includes('매장')) {
      occOpt = 'business_owner';
    }

    let debtOpt = '30m_50m';
    if (story.originalDebt) {
      if (story.originalDebt.includes('1억') || story.originalDebt.includes('2억') || story.originalDebt.includes('억')) {
        debtOpt = 'over_100m';
      } else {
        const num = parseInt(story.originalDebt.replace(/[^0-9]/g, ''));
        if (num < 1000) debtOpt = 'under_10m';
        else if (num <= 3000) debtOpt = '10m_30m';
        else if (num <= 5000) debtOpt = '30m_50m';
        else debtOpt = '50m_100m';
      }
    }

    onSelectPlan({
      occupation: occOpt,
      debtAmount: debtOpt
    });
  };

  const filteredStories = getFilteredStories();
  const filteredColumns = getFilteredColumns();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 md:py-16 font-sans">
      <div className="bg-[#FAF9F5]/90 backdrop-blur-md rounded-3xl shadow-2xl border border-[#FAF4E5] overflow-hidden relative">
        
        {/* Banner area */}
        <div className="bg-slate-900 px-6 py-8 text-white border-b border-amber-500/10 relative overflow-hidden text-left">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400 transition-colors cursor-pointer mb-3 uppercase tracking-wider"
          >
            <ChevronLeft className="w-4 h-4" />
            메인 홈화면으로 되돌아가기
          </button>
          
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <Scale className="w-7 h-7 text-amber-500 stroke-[2]" />
              성공사례
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-semibold leading-relaxed">
              울산지방법원 14년 실무 경력의 여환동 법무사가 전하는 실제 면책 및 탕감사례.
            </p>
          </div>
        </div>

        {/* Search bar inside lists */}
        <div className="px-6 pt-6 pb-2 text-left">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="직업, 채무, 사유 등 성공사례 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#FAF4E5] rounded-2xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Dynamic Success Stories Matcher */}
          <div className="space-y-6">
            {/* Search filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-500/[0.03] p-5 rounded-2xl border border-[#FAF4E5] text-left">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">1단계: 본인의 현재 직업</label>
                <div className="grid grid-cols-2 gap-2">
                  {jobs.map((job) => (
                    <button
                      key={job.value}
                      onClick={() => setSelectedJob(job.value)}
                      className={`py-2 px-2.5 rounded-xl border font-black text-xs sm:text-[13px] tracking-tight transition-all cursor-pointer ${
                        selectedJob === job.value
                          ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-500/10 hover:text-amber-750'
                      }`}
                    >
                      {job.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-600 uppercase tracking-wider block">2단계: 부채 규모 수준</label>
                <div className="grid grid-cols-2 gap-2">
                  {debts.map((debt) => (
                    <button
                      key={debt.value}
                      onClick={() => setSelectedDebt(debt.value)}
                      className={`py-2 px-2.5 rounded-xl border font-black text-xs sm:text-[13px] tracking-tight transition-all cursor-pointer ${
                        selectedDebt === debt.value
                          ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-amber-500/10 hover:text-amber-750'
                      }`}
                    >
                      {debt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List container */}
            <div className="space-y-4 text-left">
              <h3 className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Filter className="w-4 h-4 text-amber-600" />
                <span>필터 검색된 울산 사건 성공사례 ({filteredStories.length}건)</span>
              </h3>

              {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                  <Clock className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-xs text-slate-400 font-bold">성공사례 데이터베이스 동기화 중...</p>
                </div>
              ) : filteredStories.length === 0 ? (
                <div className="py-16 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-xs text-slate-400 font-medium">
                  조건에 만족하는 등록 사례가 없습니다. 필터를 조정해 보세요!
                </div>
              ) : (
              filteredStories.map((story) => {
                const isExpanded = expandedStoryId === story.id;
                return (
                  <div
                    key={story.id}
                    className={`rounded-2xl border transition-all duration-250 overflow-hidden bg-white ${
                      isExpanded 
                        ? 'border-amber-400 shadow-md ring-1 ring-amber-400/20' 
                        : 'border-[#FAF4E5] shadow-3xs hover:border-amber-300 hover:shadow-xs'
                    }`}
                  >
                     {/* Card Header (Click to toggle) */}
                     <div 
                       className="p-4 sm:p-5 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center select-none cursor-pointer"
                       onClick={() => setExpandedStoryId(isExpanded ? null : story.id)}
                     >
                       {/* Left Title: col-span-4 */}
                       <div className="col-span-12 md:col-span-4 min-w-0 text-left flex items-center gap-2">
                         <span className="text-[11px] text-slate-400 font-bold sm:hidden">
                           {story.age || "-"} • {story.job || "-"}
                         </span>
                         <h4 className="font-black text-slate-800 text-sm sm:text-base truncate leading-snug w-full" title={story.title}>
                           {story.title}
                         </h4>
                       </div>
 
                       {/* Middle Metrics Box: col-span-5 */}
                       <div className="col-span-12 md:col-span-5 flex md:justify-start items-center">
                         <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-2.5 py-1 w-full md:w-auto justify-between md:justify-start whitespace-nowrap">
                           <div className="flex items-center gap-1.5 whitespace-nowrap">
                             <span className="text-slate-400 font-medium whitespace-nowrap">기존</span>
                             <span className="font-black text-slate-700 whitespace-nowrap">{story.originalDebt}</span>
                             <span className="text-slate-350 whitespace-nowrap">➔</span>
                             <span className="text-amber-800 font-black whitespace-nowrap">{story.reducedDebt}</span>
                           </div>
                           <span className="text-emerald-700 font-black bg-emerald-50 px-1 py-0.5 rounded text-[10px] ml-0.5 shrink-0 whitespace-nowrap">
                             {story.reductionRate}% 탕감
                           </span>
                         </div>
                       </div>
 
                       {/* Right Age/Job Info: col-span-2 */}
                       <div className="hidden md:block col-span-12 md:col-span-2 text-right">
                         <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap">
                           {story.age || "-"} • {story.job || "-"}
                         </span>
                       </div>
 
                       {/* Right Chevron Down: col-span-1 */}
                       <div className="col-span-12 md:col-span-1 flex items-center justify-end shrink-0">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-slate-100 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-amber-100 text-amber-700' : ''}`}>
                           <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                         </div>
                       </div>
                     </div>

                    {/* Expanded Content (Details & Actions) */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div 
                            className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-dashed border-slate-150 space-y-4 text-left"
                          >
                            <p className="text-xs sm:text-[13.5px] text-slate-600 font-semibold leading-relaxed pt-2">
                              "{story.content.replace(/<[^>]*>/g, '')}"
                            </p>
                            
                            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2.5 pt-3 border-t border-dashed border-slate-100">
                              <button
                                onClick={() => handleOpenArticle(story)}
                                className="text-xs text-[#AA8010] hover:text-amber-800 font-black cursor-pointer underline underline-offset-4 text-left py-1"
                              >
                                🔍 대표법무사 상세 분석글 보기
                              </button>
                              <button
                                onClick={() => handleApplyMatch(story)}
                                className="px-4 py-2 bg-amber-600 text-white font-extrabold text-xs rounded-xl hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center gap-0.5 group shadow-3xs"
                              >
                                <span>이 조건으로 자격진단 개시</span>
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* DETAILED ARTICLE VIEWER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseArticle}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              className="bg-[#FAF9F5] border border-[#FAF4E5] rounded-3xl w-full max-w-2xl shadow-2xl relative z-10 overflow-hidden max-h-[85vh] flex flex-col text-left font-sans"
            >
              {/* Header */}
              <div className="bg-slate-900 p-5 text-white flex justify-between items-center border-b border-amber-500/10">
                <div className="space-y-0.5">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-black tracking-wide uppercase border border-amber-500/20 mr-1.5">
                    {selectedArticle.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    대표법무사 여환동 직접 검증
                  </span>
                </div>
                <button
                  onClick={handleCloseArticle}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 leading-relaxed">
                <div className="space-y-2.5 border-b border-slate-200/60 pb-5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {selectedArticle.title}
                  </h2>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-350" />
                      작성일: {new Date(selectedArticle.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-slate-350" />
                      조회수: {selectedArticle.views || 0}회
                    </span>
                  </div>
                </div>

                {/* If article is success story match */}
                {selectedArticle.category !== "칼럼" && (
                  <div className="bg-amber-50/30 p-5 rounded-2xl border border-[#FAF4E5] space-y-3">
                    <h4 className="text-xs font-black text-amber-800 uppercase tracking-wide flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-600" />
                      이 사건의 주요 회생 인가 사양
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-center text-xs">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] text-slate-400 font-black mb-0.5">의뢰인 나이대</span>
                        <span className="font-extrabold text-slate-700">{selectedArticle.age || "-"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] text-slate-400 font-black mb-0.5">의뢰인 직종유형</span>
                        <span className="font-extrabold text-slate-700">{selectedArticle.job || "-"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] text-slate-400 font-black mb-0.5">기존 총 부채</span>
                        <span className="font-extrabold text-slate-700">{selectedArticle.originalDebt || "-"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] text-slate-400 font-black mb-0.5">조정 후 변제총액</span>
                        <span className="font-extrabold text-[#A16207]">{selectedArticle.reducedDebt || "-"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                        <span className="block text-[9px] text-slate-400 font-black mb-0.5">실제 매월 변제율</span>
                        <span className="font-extrabold text-slate-700">{selectedArticle.monthlyPayment || "-"}</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 bg-emerald-500/[0.02]">
                        <span className="block text-[9px] text-emerald-600 font-black mb-0.5">실제 원금 탕감률</span>
                        <span className="font-extrabold text-emerald-700">{selectedArticle.reductionRate || 0}% 면책</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* HTML prose content */}
                <div 
                  className="text-slate-700 font-semibold text-xs sm:text-[14.5px] leading-loose space-y-4 prose max-w-none prose-slate"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              {/* Footer action button */}
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex gap-2">
                <button
                  onClick={handleCloseArticle}
                  className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-black rounded-xl text-xs sm:text-sm text-center cursor-pointer"
                >
                  본문 닫기
                </button>
                {selectedArticle.category !== "칼럼" && (
                  <button
                    onClick={() => {
                      handleCloseArticle();
                      handleApplyMatch(selectedArticle);
                    }}
                    className="flex-1 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs sm:text-sm text-center cursor-pointer flex justify-center items-center gap-1 group shadow-3xs"
                  >
                    <span>이 조건으로 자격진단 시작</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
