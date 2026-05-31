import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Sparkles,
  FileText,
  Library,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface BankruptcyNotesProps {
  onBack: () => void;
  onStartSurvey: () => void;
}

export default function BankruptcyNotes({ onBack, onStartSurvey }: BankruptcyNotesProps) {
  React.useEffect(() => {
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
    
    // Immediate scroll
    forceScrollTop();
    
    // Staggered scrolls to guarantee resetting on mobile browsers after menu transitions
    const t1 = setTimeout(forceScrollTop, 30);
    const t2 = setTimeout(forceScrollTop, 100);
    const t3 = setTimeout(forceScrollTop, 250);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="bg-[#FAF9F5] min-h-screen pt-4 pb-16 md:pt-16 lg:pt-20 md:pb-24 text-slate-800 font-sans break-keep"
      id="bankruptcy-notes-page"
    >
      <div className="max-w-5xl md:max-w-6xl mx-auto px-4 sm:px-8">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-amber-700 font-extrabold text-sm transition-colors cursor-pointer mb-6"
          id="bankruptcy-notes-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          메인 화면으로 돌아가기
        </button>

        {/* Bankruptcy Header Area */}
        <div className="text-center mb-12 md:mb-16">
          <div className="space-y-4 sm:space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-emerald-500/10 backdrop-blur-xs border border-emerald-550/20 rounded-full text-[15px] sm:text-[17px] font-bold text-emerald-800 tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              개인파산 가이드
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight px-1 text-center leading-[1.12] font-sans">
              울산 개인파산 신청자격 3가지 요건
            </h1>
          </div>
          <p className="mt-6 sm:mt-10 text-base sm:text-lg md:text-xl text-slate-650 font-bold max-w-3xl mx-auto leading-relaxed px-2 text-center">
            법원이 파산선고를 한 후 채무자 소유의 재산을 환가해 배당한 다음 그래도 남은 채무에 대해 100% 탕감 처리를 해주는 법원의 구제 수단입니다.
          </p>
        </div>

        {/* 3 Core Bankruptcy Rule cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-28 lg:mb-32">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-250/70 flex flex-col justify-start space-y-5 md:min-h-[280px] shadow-3xs hover:border-emerald-300 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-100">
              01
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">소득불능 및 최저생계비 미달</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                소득이 전혀 없거나 소득이 있더라도 보건복지부 기준 최저생계비 미만이어야 합니다. 특히 고령(통상 만 60세 이상), 큰 질병, 장애 등 객관적으로 경제 활동이 불가능하거나 곤란하다는 점을 증명하는 것이 최우선 과제입니다.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-250/70 flex flex-col justify-start space-y-5 md:min-h-[280px] shadow-3xs hover:border-emerald-300 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-lg border border-blue-100">
              02
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">재산보다 압도적으로 많은 채무</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                현재 본인 소유의 재산(집, 땅, 예적금, 보험 해약환급금, 임차 보증금 등)의 가치가 채무 총액보다 현격히 적어야 합니다. 채무보다 재산이 조금이라도 많다면 파산 면책 대상에서 원천적으로 제외됩니다.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-250/70 flex flex-col justify-start space-y-5 md:min-h-[280px] shadow-3xs hover:border-emerald-300 hover:shadow-md transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-lg border border-rose-100">
              03
            </div>
            <div className="space-y-2 text-left">
              <h4 className="font-extrabold text-slate-800 text-[19px] sm:text-[21px]">면책 불허가 사유의 배제</h4>
              <p className="text-[16px] sm:text-[18px] text-slate-500 font-bold leading-relaxed font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                고의로 고액의 재산을 타인 명의로 넘기거나 은닉하고 거짓 진술하는 행위가 없어야 합니다. 또한 단순 과도한 도박, 사치 등은 불합리한 행위나 소비로 판단되어 기각 사유가 될 수 있으므로 법무사 조력이 절대적으로 필요합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bankruptcy Step-by-Step Procedure Timeline */}
        <div className="mt-16 md:mt-24 lg:mt-32 pt-16 md:pt-24 lg:pt-32 border-t border-slate-200/50">
          <div className="text-center mb-12 md:mb-16">
            <div className="space-y-4 sm:space-y-6">
              <span className="text-amber-800 font-extrabold text-sm sm:text-base md:text-xl tracking-wider uppercase block">진행 단계</span>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight">개인파산 면책 과정</h3>
            </div>
            <p className="mt-6 sm:mt-10 text-base sm:text-lg md:text-xl text-slate-500 font-bold max-w-xl mx-auto">
              법무사 여환동 사무소와 함께 최종 면책 결정까지 진행되는 핵심 4단계 과정입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 relative shadow-2xs hover:border-amber-300 transition-all duration-300">
              <div className="absolute top-4 right-4 text-xs font-black text-slate-350">STAGE 01</div>
              <FileText className="w-8 h-8 text-indigo-650 mb-3" />
              <h5 className="font-extrabold text-[19px] sm:text-[21px] text-slate-900">파산/면책신청서 접수</h5>
              <p className="text-[15.2px] sm:text-[16.5px] text-slate-500 font-bold leading-relaxed mt-2 font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                경제 소득 활동이 불능하거나 현저히 곤란하다는 소명 자료들을 취합한 다음 개인파산 및 면책 신청서를 함께 작성해 동시에 제출합니다. 파산 절차와 면책 절차는 별개의 절차이기 때문입니다.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 relative shadow-2xs hover:border-amber-300 transition-all duration-300">
              <div className="absolute top-4 right-4 text-xs font-black text-slate-350">STAGE 02</div>
              <Library className="w-8 h-8 text-emerald-650 mb-3" />
              <h5 className="font-extrabold text-[19px] sm:text-[21px] text-slate-900 font-sans">파산선고/관재인 선임</h5>
              <p className="text-[15.2px] sm:text-[16.5px] text-slate-500 font-bold leading-relaxed mt-2 font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                법원은 재산 실태 및 면책 불허가 사유 유무 조사를 위해 관재인을 지정해 심사하며, 관재인은 재산 후 환가 배당 및 면책여부를 결정해 판사에게 보고서를 제출하게 됩니다.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 relative shadow-2xs hover:border-amber-300 transition-all duration-300">
              <div className="absolute top-4 right-4 text-xs font-black text-slate-350">STAGE 03</div>
              <HelpCircle className="w-8 h-8 text-amber-650 mb-3" />
              <h5 className="font-extrabold text-[19px] sm:text-[21px] text-slate-900 font-sans">채권자집회기일</h5>
              <p className="text-[15.2px] sm:text-[16.5px] text-slate-500 font-bold leading-relaxed mt-2 font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                채권자집회 기일에 채무자는 반드시 출석해야 하고, 채권자들의 이의신청 제기 여부를 확인하며 주로 개인 채권자들의 이의신청이 있으면 이의 신청 사유를 반박하는 자료를 제출해야 합니다.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 relative shadow-2xs hover:border-amber-300 transition-all duration-300">
              <div className="absolute top-4 right-4 text-xs font-black text-slate-350">STAGE 04</div>
              <CheckCircle2 className="w-8 h-8 text-cyan-650 mb-3" />
              <h5 className="font-extrabold text-[19px] sm:text-[21px] text-slate-900 font-sans">최종 면책 허가 결정</h5>
              <p className="text-[15.2px] sm:text-[16.5px] text-slate-500 font-bold leading-relaxed mt-2 font-sans w-full" style={{ textAlign: 'justify', textJustify: 'inter-character', wordBreak: 'break-all' }}>
                법원의 파산선고가 있더라도, 면책 허가를 받지 못하면 채무를 탕감 받지 못하므로, 면책 불허가 사유가 없음을 소명하고 관재인으로부터 면책 허가 의견을 받아내는 것이 핵심입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Cross Comparison Section: 회생 vs 파산 */}
        <div className="mt-16 md:mt-24 lg:mt-32 pt-16 md:pt-24 lg:pt-32 border-t border-slate-200/50 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h4 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight">개인회생 vs 개인파산</h4>
            <p className="mt-6 sm:mt-10 text-base sm:text-lg md:text-xl text-slate-500 font-bold max-w-xl mx-auto">어떤 제도가 나에게 더 유리할까? 정확히 구분해야 합니다.</p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-[14.5px] sm:text-[16px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 sm:p-5 font-black text-slate-800 w-1/4">구분 기준</th>
                  <th className="p-4 sm:p-5 font-black text-slate-850 bg-amber-500/5 w-3/8 text-amber-900">개인회생</th>
                  <th className="p-4 sm:p-5 font-black text-slate-850 bg-slate-100/40 w-3/8 text-slate-900">개인파산</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-655">
                <tr>
                  <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50/5">주요 대상자</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-bold text-justify break-all">임금소득자, 영업자형 등 반복 장래소득이 있는 자</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-bold text-justify break-all">소득 불능 상태, 고령, 중증 질환, 기초 수급자 등</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50/5">원금 감면율</td>
                  <td className="p-4 sm:p-5 bg-amber-500/[0.015] font-bold text-slate-900 font-sans text-justify break-all">법원 승인된 가용 소득 외 원금 <span className="text-amber-600 font-extrabold">최대 90% 상당 감면</span></td>
                  <td className="p-4 sm:p-5 bg-slate-50/25 font-bold text-slate-900 font-sans text-justify break-all">최종 면책 시 남은 채무액 <span className="text-slate-800 font-extrabold pb-0.5 border-b border-slate-350">100% 면제</span></td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50/5">최대 채무 한도</td>
                  <td className="p-4 sm:p-5 text-justify break-all">무담보 채무 10억 / 담보 채무 15억 이하</td>
                  <td className="p-4 sm:p-5 font-semibold text-slate-700 text-justify break-all">채무액 상한치 원칙적으로 전혀 한계 없음</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-black text-slate-800 bg-slate-50/5">신용 회복 기간</td>
                  <td className="p-4 sm:p-5 bg-amber-500/[0.015] font-sans text-slate-700 text-justify break-all">3년 ~ 5년 장래 변제금 분할 납부 시점 동안 유지</td>
                  <td className="p-4 sm:p-5 bg-slate-50/25 font-semibold text-slate-700 font-sans text-justify break-all">면책결정이 있은 후 일정기간 파산사실 등록됨</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Navigation Button */}
        <div className="mt-16 md:mt-24 lg:mt-32 text-center pb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black text-[16px] sm:text-[17px] tracking-tight hover:bg-slate-850 active:scale-95 transition-all duration-150 cursor-pointer shadow-lg hover:shadow-xl border border-slate-800"
            id="bankruptcy-notes-bottom-back-btn"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            메인 페이지로 이동하기
          </button>
        </div>

      </div>
    </motion.div>
  );
}
