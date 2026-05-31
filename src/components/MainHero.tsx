import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, TrendingDown, ClipboardCheck, Users, HelpCircle } from 'lucide-react';

interface MainHeroProps {
  onStartSurvey: (initialMode?: string) => void;
  onWorryChipClick?: (index: number) => void;
}

export default function MainHero({ onStartSurvey, onWorryChipClick }: MainHeroProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || window.innerWidth >= 768) return;

    let hasTriggered = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          hasTriggered = true;
          // Wait 300ms after entering viewport for smooth focus transition
          setTimeout(() => {
            el.scrollTo({ left: 45, behavior: 'smooth' });
            setTimeout(() => {
              el.scrollTo({ left: 0, behavior: 'smooth' });
            }, 550);
          }, 300);
          
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.35 // Triggers when 35% of the element is visible
      }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  // Config for the 2 interactive entry cards (combined from 3 original cards)
  const entranceCards = [
    {
      title: '탕감 금액 즉시 확인하기',
      subtitle: '',
      icon: <ClipboardCheck className="w-8 h-8 text-blue-700" />,
      color: 'from-blue-500/15 to-violet-500/10 hover:border-blue-400',
      actionKey: 'qualification'
    },
    {
      title: '나와 비슷한 성공사례 찾기',
      subtitle: '실제 면책사례와 비교',
      icon: <Users className="w-8 h-8 text-amber-600" />,
      color: 'from-amber-500/10 to-orange-500/10 hover:border-amber-300',
      actionKey: 'case'
    }
  ];

  const worrychips = [
    '전부 최근 대출이에요.',
    '전화 독촉 스트레스!',
    '코인 및 주식 투자손실',
    '배우자 몰래 진행하기!'
  ];

  return (
    <section className="relative overflow-hidden bg-transparent pt-8 sm:pt-11 md:pt-14 lg:pt-16 pb-[72px] md:pb-[100px] lg:pb-[130px]">
      {/* Sophisticated Background Design: Absolute transparency to let root design shine */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af2503_1px,transparent_1px),linear-gradient(to_bottom,#d4af2503_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

      <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-8 relative z-10 text-center">
        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50/90 border border-amber-200/60 text-xs md:text-sm font-bold text-amber-900 mb-8 shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>신청자격 자가진단 시스템</span>
        </motion.div>

        {/* Master Titles */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-amber-800 font-extrabold text-[16px] sm:text-[18px] md:text-[22px] tracking-wider uppercase mb-4 sm:mb-5">
            울산에 사시는데 다른 지역에 맡기시려고요?
          </h2>
          <h1 className="text-[38px] sm:text-[52px] md:text-[62px] lg:text-[74px] font-black tracking-wide text-slate-900 leading-[1.12] whitespace-pre-line gold-text-gradient mb-2 sm:mb-2.5">
            개인회생·개인파산
          </h1>
          <p className="text-[16px] sm:text-[20px] text-slate-600 max-w-2xl mx-auto font-bold leading-relaxed px-4">
            울산지방법원 사건에 특화된 법무사입니다.
          </p>
        </motion.div>

        {/* Quick Highlight Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto px-1"
        >
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xs border border-[#FAF4E5] shadow-xs hover:border-amber-300/80 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center md:min-h-[160px]">
            <span className="text-[18px] font-extrabold text-[#AA8010] mb-2 leading-none font-sans">소득 기준 최소화</span>
            <p className="text-[22px] sm:text-[24px] font-black text-slate-800 leading-snug">
              어떤 직종이든<br className="block" /> 소득이 있다면 가능!
            </p>
          </div>
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xs border border-[#FAF4E5] shadow-xs hover:border-amber-300/80 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center md:min-h-[160px]">
            <span className="text-[18px] font-extrabold text-[#AA8010] mb-2 leading-none font-sans">최소 채무 허들</span>
            <p className="text-[22px] sm:text-[24px] font-black text-slate-800 leading-snug">
              총 빚 합산금액이<br className="block" /> 천만 원 이상이면 가능!
            </p>
          </div>
          <div className="p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xs border border-[#FAF4E5] shadow-xs hover:border-amber-300/80 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center text-center md:min-h-[160px]">
            <span className="text-[18px] font-extrabold text-[#AA8010] mb-2 leading-none font-sans">순자산 보유 범위</span>
            <p className="text-[22px] sm:text-[24px] font-black text-slate-800 leading-snug">
              소유 재산 가액보다<br className="block" /> 채무가 더 많다면 가능!
            </p>
          </div>
        </motion.div>

        {/* Worry chips area */}
        <div 
          ref={scrollContainerRef}
          className="mt-12 flex flex-row md:flex-wrap justify-start md:justify-center gap-2.5 max-w-2xl mx-auto px-4 overflow-x-auto md:overflow-visible whitespace-nowrap scrollbar-none select-none scroll-smooth pb-2 md:pb-0 w-full"
        >
          {worrychips.map((chip, index) => (
            <span
              key={index}
              onClick={() => onWorryChipClick && onWorryChipClick(index)}
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-amber-50/50 text-amber-800 border border-amber-200/40 text-[12.5px] sm:text-[15.5px] font-extrabold shadow-3xs hover:bg-amber-100/60 hover:text-amber-900 hover:scale-[1.03] active:scale-95 transition-all duration-200 cursor-pointer shrink-0 inline-block"
            >
              #{chip}
            </span>
          ))}
        </div>

        {/* Action Title Block */}
        <div className="mt-16 md:mt-24 lg:mt-32 border-t border-slate-300/40 pt-16 md:pt-24 lg:pt-32">
          <div className="space-y-4 sm:space-y-6">
            <span className="text-[16px] sm:text-[18px] md:text-[22px] font-extrabold text-amber-700 tracking-wider uppercase block">
              1분만 투자해 보세요!
            </span>
            <h3 className="text-[38px] sm:text-[52px] md:text-[62px] lg:text-[74px] font-black text-slate-900 tracking-tight px-2 leading-[1.12]">
              나의 탕감 금액은?
            </h3>
          </div>
          <p className="mt-6 sm:mt-10 text-[16px] sm:text-[20px] text-slate-500 font-bold max-w-2xl mx-auto leading-relaxed px-4">
            개인회생이 가능한지? 월변제금은 얼마인지?<br />
            결과를 실시간 확인할 수 있습니다.
          </p>
        </div>

        {/* Entrance Interactive Selection Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto px-1 text-left">
          {entranceCards.map((card, idx) => (
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              key={idx}
              onClick={() => onStartSurvey(card.actionKey)}
              className={`p-6 sm:p-8 md:p-10 rounded-3xl bg-gradient-to-br ${card.color} border ${
                idx === 0 ? 'border-blue-300 animate-luxury-card' : 'border-slate-200/45'
              } shadow-3xs cursor-pointer transition-all duration-200 flex items-center gap-4 hover:shadow-sm relative overflow-hidden group`}
            >
              {idx === 0 && (
                <div className="absolute inset-0 shimmer-glass-card pointer-events-none opacity-40 mix-blend-overlay" />
              )}
              <div className="p-4 bg-white rounded-2xl shadow-3xs shrink-0 group-hover:scale-110 transition-transform relative z-10">
                {card.icon}
              </div>
              <div className="space-y-1 flex-1 min-w-0 relative z-10">
                <h4 className="font-extrabold text-slate-800 text-[13px] min-[360px]:text-[15.5px] min-[390px]:text-[17.15px] sm:text-[19px] flex flex-col items-start gap-1">
                  <span className={`whitespace-nowrap ${idx === 0 ? "text-blue-800 font-black tracking-tight" : ""}`}>
                    {card.title}
                  </span>
                  {idx === 0 && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] min-[360px]:text-[10.2px] font-black bg-blue-600 text-white shadow-3xs whitespace-nowrap shrink-0 mt-0.5">
                      <span className="relative flex h-1 w-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1 w-1 bg-blue-100"></span>
                      </span>
                      <span>실시간 진단</span>
                    </span>
                  )}
                </h4>
                {card.subtitle && (
                  <p className="text-sm text-slate-500 font-bold leading-normal">{card.subtitle}</p>
                )}
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-1 shrink-0 transition-all hidden min-[360px]:block relative z-10" />
            </motion.div>
          ))}
        </div>

        {/* Subtle timer warning */}
        <p className="mt-6 text-sm text-slate-500 font-bold tracking-wide">
          본 시뮬레이션 결과는 간이 진단 기준이며, 실제 변제액은 소득과 재산 실사 후 달라질 수 있습니다.
        </p>
      </div>
    </section>
  );
}
