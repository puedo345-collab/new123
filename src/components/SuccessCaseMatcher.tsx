import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SUCCESS_STORIES } from '../data';
import { Users, Filter, ArrowRight, CheckCircle2, Award, ChevronLeft, ShieldCheck, PhoneCall, Loader2 } from 'lucide-react';

interface SuccessCaseMatcherProps {
  onBack: () => void;
  onSelectPlan: (answers: { occupation: string; debtAmount: string }) => void;
}

// SuccessStory 호환 인터페이스 정의 (서버 데이터와 정적 데이터 통합용)
interface MatchedStoryItem {
  id: string | number;
  category: string;
  title: string;
  age: string;
  job: string;
  originalDebt: string;
  reducedDebt: string;
  monthlyPayment: string;
  reductionRate: number;
  description: string;
}

export default function SuccessCaseMatcher({ onBack, onSelectPlan }: SuccessCaseMatcherProps) {
  const [selectedJob, setSelectedJob] = useState<string>('all');
  const [selectedDebt, setSelectedDebt] = useState<string>('all');
  const [stories, setStories] = useState<MatchedStoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const jobs = [
    { value: 'all', label: '전체 보기' },
    { value: 'employee', label: '일반 직장인' },
    { value: 'freelancer', label: '프리랜서 / 일용직' },
    { value: 'business', label: '개인사업자' }
  ];

  const debts = [
    { value: 'all', label: '전체 금액' },
    { value: 'under_50m', label: '5천만 원 미만' },
    { value: 'over_50m', label: '5천만 원 이상' }
  ];

  // Fetch articles dynamically from server API with robust fallback safety
  useEffect(() => {
    setLoading(true);
    fetch('/api/articles')
      .then((res) => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter columns out, mapped to standard story schema
          const mapped: MatchedStoryItem[] = data
            .filter((art: any) => art.category !== '칼럼' && art.status !== 'draft')
            .map((art: any) => {
              const cleanDesc = art.content
                ? art.content.replace(/<[^>]*>/g, '').trim().substring(0, 160) + '...'
                : '';
              return {
                id: art.id,
                category: art.category || '성공사례',
                title: art.title || '',
                age: art.age || '연령 미지정',
                job: art.job || '직업 미지정',
                originalDebt: art.originalDebt || '0원',
                reducedDebt: art.reducedDebt || '0원',
                monthlyPayment: art.monthlyPayment || '',
                reductionRate: art.reductionRate ? Number(art.reductionRate) : 0,
                description: cleanDesc
              };
            });
          
          if (mapped.length > 0) {
            setStories(mapped);
          } else {
            useFallback();
          }
        } else {
          useFallback();
        }
      })
      .catch((err) => {
        console.warn('API fetch failed, utilizing hardcoded SUCCESS_STORIES fallback:', err);
        useFallback();
      })
      .finally(() => setLoading(false));

    function useFallback() {
      const fallback = SUCCESS_STORIES.map((s) => ({
        id: s.id,
        category: s.category,
        title: s.title,
        age: s.age,
        job: s.job,
        originalDebt: s.originalDebt,
        reducedDebt: s.reducedDebt,
        monthlyPayment: s.monthlyPayment,
        reductionRate: s.reductionRate,
        description: s.description
      }));
      setStories(fallback);
    }
  }, []);

  const getFilteredStories = () => {
    return stories.filter((story) => {
      // Filter by job category
      let matchJob = true;
      if (selectedJob !== 'all') {
        if (selectedJob === 'employee') {
          matchJob = story.job.includes('직장인') || story.job.includes('사원') || story.job.includes('회사원');
        } else if (selectedJob === 'freelancer') {
          matchJob = story.job.includes('프리랜서') || story.job.includes('강사') || story.job.includes('일용직');
        } else if (selectedJob === 'business') {
          matchJob = story.job.includes('사업자') || story.job.includes('자영업') || story.job.includes('매장') || story.job.includes('업주');
        }
      }

      // Filter by debt amount
      let matchDebt = true;
      if (selectedDebt !== 'all' && story.originalDebt) {
        const isEok = story.originalDebt.includes('억');
        const numPart = parseFloat(story.originalDebt.replace(/[^0-9.]/g, ''));
        const debtVal = isEok ? numPart * 10000 : numPart; // in man-won

        if (selectedDebt === 'under_50m') {
          matchDebt = debtVal < 5000;
        } else if (selectedDebt === 'over_50m') {
          matchDebt = debtVal >= 5000;
        }
      }

      return matchJob && matchDebt;
    });
  };

  const filteredStories = getFilteredStories();

  const handleApplyMatch = (story: MatchedStoryItem) => {
    let occOpt = 'regular_employee';
    if (story.job.includes('프리랜서') || story.job.includes('일용직') || story.job.includes('강사')) {
      occOpt = 'freelancer_parttime';
    } else if (story.job.includes('사업자') || story.job.includes('자영업') || story.job.includes('매장') || story.job.includes('업주')) {
      occOpt = 'business_owner';
    }

    let debtOpt = '30m_50m';
    if (story.originalDebt.includes('1억') || story.originalDebt.includes('2억') || story.originalDebt.includes('억')) {
      debtOpt = 'over_100m';
    } else {
      const num = parseInt(story.originalDebt.replace(/[^0-9]/g, ''));
      if (num < 1000) debtOpt = 'under_10m';
      else if (num <= 3000) debtOpt = '10m_30m';
      else if (num <= 5000) debtOpt = '30m_50m';
      else debtOpt = '50m_100m';
    }

    onSelectPlan({
      occupation: occOpt,
      debtAmount: debtOpt
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 py-4 sm:py-8 md:py-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#FAF4E5] overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-slate-900 px-4 sm:px-6 py-5 flex justify-between items-center text-white border-b border-amber-500/10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            메인으로
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-4.5 h-4.5 text-amber-500" />
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-100">
              인공지능 성공사례 스마트 대조
            </span>
          </div>
        </div>

        {/* Info panel */}
        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              나와 유사한 회생 해방사례 찾기
            </h2>
          </div>

          {/* Filters section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/20 p-4 rounded-xl border border-[#FAF4E5]">
            {/* Job Filter */}
            <div className="space-y-2">
              <label className="text-xs sm:text-[13px] font-black text-slate-600 uppercase tracking-wider block">1단계: 본인의 현재 직업</label>
              <div className="grid grid-cols-2 gap-2">
                {jobs.map((job) => (
                  <button
                    key={job.value}
                    onClick={() => setSelectedJob(job.value)}
                    className={`py-2.5 px-2 rounded-xl border font-black text-xs sm:text-[13.5px] tracking-tight transition-all cursor-pointer ${
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

            {/* Debt Filter */}
            <div className="space-y-2">
              <label className="text-xs sm:text-[13px] font-black text-slate-600 uppercase tracking-wider block">2단계: 부채 수준</label>
              <div className="grid grid-cols-2 gap-2">
                {debts.map((debt) => (
                  <button
                    key={debt.value}
                    onClick={() => setSelectedDebt(debt.value)}
                    className={`py-2.5 px-2 rounded-xl border font-black text-xs sm:text-[13.5px] tracking-tight transition-all cursor-pointer ${
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

          {/* Story List Section */}
          <div className="space-y-3.5">
            <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>조건 충족 맞춤 성공 선례 ({filteredStories.length}건 검색됨)</span>
            </h3>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                  <p className="text-xs text-slate-400 font-bold">성공사례 데이터베이스 동기화 중...</p>
                </div>
              ) : filteredStories.length > 0 ? (
                <div className="space-y-3.5">
                  {filteredStories.map((story) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-[#FAF4E5] bg-white shadow-3xs hover:border-amber-300 hover:shadow-xs transition-all duration-200 space-y-4 text-left"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2 pb-2.5 border-b border-slate-150">
                        <div>
                          <h4 className="font-black text-slate-900 text-base sm:text-lg inline-block">
                            {story.title}
                          </h4>
                        </div>
                        <span className="text-xs sm:text-[13px] text-slate-500 font-bold">{story.age} • {story.job}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-center">
                        <div className="p-2.5 bg-amber-50/10 rounded-lg border border-amber-100/35">
                          <span className="text-[10.5px] sm:text-xs text-slate-500 font-black block leading-tight mb-1">기존 총 부채</span>
                          <span className="text-[13px] sm:text-sm md:text-base font-black text-slate-700">{story.originalDebt}</span>
                        </div>
                        <div className="p-2.5 bg-amber-50/15 rounded-lg border border-amber-100/35">
                          <span className="text-[10.5px] sm:text-xs text-slate-500 font-black block leading-tight mb-1">조정 후 변제총액</span>
                          <span className="text-[13px] sm:text-sm md:text-base font-black text-[#A16207]">{story.reducedDebt}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1 p-2.5 bg-emerald-500/5 rounded-lg border border-emerald-500/15">
                          <span className="text-[10.5px] sm:text-xs text-emerald-600 font-black block leading-tight mb-1">실제 탕감 비율</span>
                          <span className="text-[13px] sm:text-sm md:text-base font-black text-emerald-700">{story.reductionRate}% 탕감 면책</span>
                        </div>
                      </div>

                      <div className="space-y-3 pt-0.5">
                        <p className="text-xs sm:text-[13.8px] text-slate-700 font-medium leading-relaxed">
                          "{story.description}"
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-2 pt-1.5">
                          <button
                            onClick={() => handleApplyMatch(story)}
                            className="px-4.5 py-2.5 bg-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-lg hover:bg-amber-700 transition-colors cursor-pointer flex items-center justify-center gap-0.5 group shadow-3xs"
                          >
                            <span>이 조건으로 플랜 진단하기</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 opacity-90 text-slate-500 font-medium text-xs space-y-1"
                >
                  <p>선택하신 조건의 성공 사례가 아직 시뮬레이터에 등록되어 있지 않습니다.</p>
                  <p>필터를 완화하여 법인/일반 탕감 면책 성공 데이터들을 확인해 보세요.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Back to main screen link button */}
          <div className="pt-6 border-t border-slate-150 flex justify-center">
            <button
              onClick={onBack}
              className="px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-850 font-black text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 shadow-md shadow-slate-900/10 hover:shadow-lg cursor-pointer flex items-center gap-2"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
              메인 화면으로 가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
