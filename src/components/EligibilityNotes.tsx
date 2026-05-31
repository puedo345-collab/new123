import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scale, CheckCircle2, AlertCircle, Sparkles, ChevronDown, ChevronUp, Lock, Target, HelpCircle, Landmark, ArrowRight, Library, FileText, Check } from 'lucide-react';

interface FAQItem {
  id: string | number;
  question: string;
  answer: string;
}

// Removed custom inline highlighter to avoid nested layout spans that block text justification.

export default function EligibilityNotes() {
  const [activeFaq, setActiveFaq] = useState<string | number | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  React.useEffect(() => {
    // Fetch real-time FAQs from backend
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setFaqItems(data);
        }
      })
      .catch(err => {
        console.error("Error loading FAQs:", err);
      });
  }, []);

  React.useEffect(() => {
    const handleExpandFaq = (e: Event) => {
      const customEvent = e as CustomEvent<{ faqId: string | number }>;
      if (customEvent.detail && (typeof customEvent.detail.faqId === 'number' || typeof customEvent.detail.faqId === 'string')) {
        setActiveFaq(customEvent.detail.faqId);
      }
    };
    window.addEventListener('expand-faq', handleExpandFaq);
    return () => {
      window.removeEventListener('expand-faq', handleExpandFaq);
    };
  }, []);

  return (
    <section className="pt-3 md:pt-24 lg:pt-32 pb-16 md:pb-24 lg:pb-32 bg-transparent border-b border-[#FAF4E5] break-keep">
      <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-8">

        {/* Eligibility Header Area */}
        <div className="text-center mb-8 md:mb-10 lg:mb-12">
          <div className="space-y-4 sm:space-y-6">
            <span className="text-amber-800 font-extrabold text-sm sm:text-base md:text-xl tracking-wider uppercase block">
              개인회생 가이드
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight px-1 text-center font-sans leading-[1.12]">
              신청 자격 3가지 안내
            </h2>
          </div>
          <p className="mt-6 sm:mt-10 text-sm sm:text-base md:text-lg text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed px-2">
            직업과 관계없이 아래 3가지 요건만 충족하면 개인회생을 진행할 수 있습니다.
          </p>
        </div>

        {/* 3 Core Eligibility Rule cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-28 lg:mb-32">
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#FAF4E5] flex flex-col justify-start space-y-5 md:min-h-[260px] shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-100">
              01
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">꾸준한 소득 발생 여부</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                직업의 종류와는 관계없이 인가 된 변제계획안 기간(통상 36개월) 동안 월 가용소득(변제금)을 꾸준히 납부할 수 있는 소득만 있으면 가능합니다. 예를 들어 최저생계비 이상의 소득이 있다면 인가를 받을 수 있습니다.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#FAF4E5] flex flex-col justify-start space-y-5 md:min-h-[260px] shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/50 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-100">
              02
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">채무 합계액 한도</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                무담보 채무(신용 대출, 신용카드 연체대금 등) 10억 이하, 담보 채무(아파트·주택 담보 채무, 자동차 담보 채무 등) 15억 이하 이면서, 너무 소액의 채무는 인가 가능성이 낮으므로 약 1천만 원 이상의 채무가 있으면 됩니다.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-xs border border-[#FAF4E5] flex flex-col justify-start space-y-5 md:min-h-[260px] shadow-xs hover:shadow-md hover:border-amber-300 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black text-lg border border-amber-200">
              03
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">보유한 재산보다 채무가 많아야</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                채무자가 보유하고 있는 부동산이나 자동차 등의 시세 가액이, 채무자가 부담하고 있는 채무(담보채무 제외) 보다 적을 경우에 개인회생 대상이 됩니다. 다만, 재산의 가액 산정 시 시세에서 담보 채무를 뺀 나머지를 재산 가액으로 산정해야 합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 개인회생 원스톱 신속 절차 */}
        <div id="our-spirit" className="scroll-mt-24 md:scroll-mt-28 mt-8 md:mt-24 lg:mt-32 pt-8 md:pt-24 lg:pt-32 border-t border-slate-200/50">
          <div className="text-center">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-emerald-700 font-extrabold text-sm sm:text-base md:text-xl tracking-wider uppercase block">
                개인회생 프로세스
              </span>
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight px-1 text-center font-sans leading-[1.12]">
                신속 회생 절차 안내
              </h2>
            </div>
            <p className="mt-6 sm:mt-10 text-sm sm:text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              신속한 서류 편철과 완벽한 신청서 작성이 추심, 독촉 금지를 빨리 받아내는 핵심입니다.
            </p>
          </div>

          {/* Unified Infographic 5-Step Process Block */}
          <div className="mt-12 sm:mt-16 max-w-6xl mx-auto px-1">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden text-left">
              {/* Background soft glowing highlights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative">
                {/* Infographic Steps: Always stacked vertically for clean structure on all screens */}
                <div className="flex flex-col gap-10 md:gap-12 relative">
                  {[
                    {
                      step: '01',
                      title: '사전 자격 진단',
                      duration: '1~2일 소요',
                      desc: '채무자의 평균소득·순자산·총채무를 분석해 최적의 변제계획안을 작성해 최저 월변제금을 산출해 냅니다. 또한 청산가치 보장이 필요한 경우 월 변제금 상향조정 또는 변제기간 연장을 채무자의 상황에 맞도록 완벽히 도출해 냅니다.',
                      icon: <Target className="w-5 h-5 text-emerald-600" />,
                      badge: '1:1 무료 상담',
                      colorClass: 'emerald'
                    },
                    {
                      step: '02',
                      title: '신청서접수',
                      duration: '5~7일 소요',
                      desc: '개인회생 신청서와 금지명령(필요시 중지명령) 신청서 및 부속서류를 완벽히 준비해 제출해야, 법원으로 부터 불필요한 보정명령 없이 단 기간 내에 금지명령(또는 중지명령)을 받아 낼 수 있으며, 이 절차가 개인회생의 가장 중요한 기간이라 할 수 있습니다.',
                      icon: <FileText className="w-5 h-5 text-violet-600" />,
                      badge: '당일 원스톱 처리',
                      colorClass: 'violet'
                    },
                    {
                      step: '03',
                      title: '금지 / 중지명령',
                      duration: '접수 후 3~5일',
                      desc: '법원의 금지명령 결정이 있으면 채권자의 주소지로 금지명령 결정문을 송달합니다. 금지명령 결정문이 채권자에게 도달하면 그 즉시 채권추심 및 강제집행 등이 금지되는 효력이 발생합니다. 참고로, 중지명령은 장래의 강제집행을 금지하는 것이 아니고, 기왕에 집행되어 있던 강제집행을 개인회생 개시결정 시까지 정지시키는 역할을 합니다.',
                      icon: <Lock className="w-5 h-5 text-blue-600" />,
                      badge: '빚 독촉 즉시 차단',
                      colorClass: 'blue'
                    },
                    {
                      step: '04',
                      title: '개시 결정',
                      duration: '3~5개월 소요',
                      desc: '법원 신청서와 부속서류를 검토한 다음 개인회생절차 개시결정을 하면, 법원의 서류 심사는 거의 마무리 되었다 생각해도 됩니다. 참고로 울산지방법원은 개시결정이 있기 전이라도 변제계획안에 기재된 첫 변제일에 1회 변제가 시작되며, 통상 신청일로부터 3개월 뒤 입니다.',
                      icon: <Landmark className="w-5 h-5 text-amber-600" />,
                      badge: '채권자 이의 방어',
                      colorClass: 'amber'
                    },
                    {
                      step: '05',
                      title: '인가결정 및 면책결정',
                      duration: '최종 결정',
                      desc: '법원의 인가결정이 있으면 개인회생이 법원에서 완벽히 통과되었다고 생각하면 되며, 이제 부터는 변제 기간(통상 36개월) 동안 법원 가상계좌로 변제금 납부만 이행하면 되며, 납부가 모두 완료되면 면책신청을 별도로 해야 면책결정을 받을 수 있습니다.',
                      icon: <CheckCircle2 className="w-5 h-5 text-cyan-600" />,
                      badge: '신용 정보 완벽 회복',
                      colorClass: 'cyan'
                    }
                  ].map((item, idx) => {
                    // Dynamic visual properties based on theme classes
                    let theme = {
                      dotBg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
                      numBg: 'text-emerald-500 bg-emerald-50',
                    };
                    if (item.colorClass === 'violet') {
                      theme = {
                        dotBg: 'bg-violet-50 border-violet-200 text-violet-600',
                        numBg: 'text-violet-500 bg-violet-50',
                      };
                    } else if (item.colorClass === 'blue') {
                      theme = {
                        dotBg: 'bg-blue-50 border-blue-200 text-blue-600',
                        numBg: 'text-blue-500 bg-blue-50',
                      };
                    } else if (item.colorClass === 'amber') {
                      theme = {
                        dotBg: 'bg-amber-50 border-amber-200 text-amber-600',
                        numBg: 'text-amber-500 bg-amber-50',
                      };
                    } else if (item.colorClass === 'cyan') {
                      theme = {
                        dotBg: 'bg-cyan-50 border-cyan-200 text-cyan-600',
                        numBg: 'text-cyan-500 bg-cyan-50',
                      };
                    }

                    return (
                      <div key={idx} className="relative flex flex-col items-start gap-3 group">
                        {/* Circular Icon & Stage Number Node */}
                        <div className="relative shrink-0 z-10">
                          <div className="absolute -inset-2 bg-slate-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 ${theme.dotBg} flex items-center justify-center shadow-3xs group-hover:scale-105 transition-transform duration-300`}>
                            {item.icon}
                            <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-md text-[11px] font-black tracking-tighter ${theme.numBg} border border-slate-200/50 flex items-center justify-center`}>
                              {item.step}
                            </span>
                          </div>
                        </div>

                        {/* Stage Descriptive Content Bubble */}
                        <div className="flex-1 space-y-3 w-full">
                          <div className="flex flex-row items-center gap-1.5 sm:gap-4">
                            <h4 className="font-extrabold text-slate-900 text-[19px] sm:text-[21px] tracking-tight leading-tight">
                              {item.title}
                            </h4>
                            <span className="inline-block text-[13px] font-extrabold tracking-wide text-slate-500 py-0.5 px-2 bg-slate-100/80 rounded-md border border-slate-200/30 w-fit">
                              {item.duration}
                            </span>
                          </div>

                          <p className="text-[16px] sm:text-[17px] md:text-[18px] text-slate-600 font-bold leading-relaxed font-sans max-w-none w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion FAQ Area ("세상의 이야기") */}
        <div id="faq" className="scroll-mt-16 sm:scroll-mt-28 mt-12 md:mt-24 lg:mt-32 pt-12 md:pt-24 lg:pt-32 border-t border-[#FAF4E5]">
          <div className="text-center">
            <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.12]">자주 묻는 질문</h3>
          </div>

          <div className="mt-10 sm:mt-12 max-w-3xl mx-auto space-y-4">
            {faqItems.map((faq) => {
              const isSelected = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  id={`faq-item-${faq.id}`}
                  className="rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all duration-200 scroll-mt-24 md:scroll-mt-28"
                >
                  <button
                    onClick={() => setActiveFaq(isSelected ? null : faq.id)}
                    className="w-full px-6 py-5 text-left font-bold text-[17px] sm:text-[18px] text-slate-800 hover:bg-slate-50 flex justify-between items-center gap-4 cursor-pointer"
                  >
                    <span className="flex items-start gap-2.5 w-full text-justify flex-1">
                      <HelpCircle className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-1" />
                      <span className="block text-justify break-all w-full leading-normal">{faq.question}</span>
                    </span>
                    {isSelected ? <ChevronUp className="w-4.5 h-4.5 text-slate-550 shrink-0" /> : <ChevronDown className="w-4.5 h-4.5 text-slate-450 shrink-0" />}
                  </button>

                  {isSelected && (
                    <div className="px-6 pb-6 pt-3 text-[15px] sm:text-[16px] md:text-[18px] text-slate-500 font-medium leading-relaxed border-t border-slate-100/50 bg-slate-50/30 text-justify break-all w-full">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
