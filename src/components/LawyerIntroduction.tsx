import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, 
  ShieldCheck, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  FileCheck, 
  ThumbsUp, 
  Briefcase
} from 'lucide-react';

interface LawyerIntroductionProps {
  onBack: () => void;
  onStartSurvey: () => void;
}

export default function LawyerIntroduction({ onBack, onStartSurvey }: LawyerIntroductionProps) {
  const [imgSrc, setImgSrc] = React.useState<string>('/lawyer_yeo.jpg');
  const [fallbackIndex, setFallbackIndex] = React.useState(0);

  const fallbacks = [
    '/lawyer_yeo.jpg',
    '/lawyer_yeo.png',
    '/lawyer_yeo.jpeg',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400&h=533' // Elegant Asian professional fallback
  ];

  const handleImageError = () => {
    if (fallbackIndex < fallbacks.length - 1) {
      const nextIndex = fallbackIndex + 1;
      setFallbackIndex(nextIndex);
      setImgSrc(fallbacks[nextIndex]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="bg-[#FAF9F5] min-h-screen pt-7 pb-10 md:pt-9 md:pb-20 text-slate-800 font-sans"
      id="lawyer-intro-page"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-amber-700 font-extrabold text-sm transition-colors cursor-pointer mb-6"
          id="lawyer-intro-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          메인 화면으로 돌아가기
        </button>

        {/* Dynamic header banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-800 border border-amber-500/20 shadow-xs relative overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-amber-500/5 blur-2xl pointer-events-none" />
          <div className="relative z-10 space-y-2.5">
            <h1 className="inline-flex items-center gap-1.5 px-3 py-0.5 bg-amber-500/10 backdrop-blur-xs border border-amber-500/20 rounded-full text-[15px] sm:text-[17px] font-bold text-amber-700 tracking-wider uppercase font-sans">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              울산 개인회생·파산 전문 법무사 여환동 소개
            </h1>
            <p className="text-[15px] sm:text-[17px] text-slate-600 font-bold max-w-[104%] w-full leading-relaxed text-justify break-all">
              울산지방법원 맞춤 개인회생 진행 14년의 압도적 결정력.<br className="hidden md:inline" /> 사무장 대행 없이 대표 법무사가 모든 실무를 직접 소행하여 신속하고 정밀한 보정 권고 대응으로 인가율을 극대화 합니다.
            </p>
          </div>
        </div>

        {/* Individual Card Layout Blocks for Responsive Adaptability */}
        {(() => {
          const contactMapCard = (
            <div className="bg-white rounded-3xl p-5 sm:p-6 text-slate-700 flex flex-col h-full space-y-3 border border-slate-200/60 shadow-xs w-full">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[11px] font-bold text-amber-700 tracking-wider">
                  사무소 오시는 길
                </span>
                <span className="text-[10px] text-slate-500 font-extrabold bg-slate-100 border border-slate-200/40 px-2 py-0.5 rounded">
                  울산지방법원 앞
                </span>
              </div>
              
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-slate-100 space-y-4">
                 <div className="flex items-start gap-2.5">
                   <div className="space-y-1 w-full">
                     <p className="font-extrabold text-[15px] text-slate-900 leading-snug font-sans">
                       <span>울산 남구 법대로14번길 18, 1층</span>
                     </p>
                     <p className="text-[12px] font-bold text-slate-500 leading-normal">
                       옥서초등학교 정문 앞 (울산지방법원 정문 도보 5분)
                     </p>
                   </div>
                 </div>

                 <div className="border-t border-slate-200/40 pt-3 space-y-2">
                   <p className="text-[13px] text-slate-700 font-bold flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                     <span>전화번호: <a href="tel:052-933-5679" className="text-amber-700 font-black hover:underline">052-933-5679</a></span>
                   </p>
                   <p className="text-[13px] text-slate-500 font-semibold leading-relaxed flex items-start gap-1.5">
                     <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-1.5" />
                     <span className="block text-justify break-all w-full">주차 안내: 건물 주차 공간이 제공되나, 법원 정문앞 공영주차장에 주차하시면 도보로 1분 내의 거리이므로 편리할 수 있습니다.</span>
                   </p>
                 </div>
              </div>
            </div>
          );

          const promiseCard = (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-xs flex flex-col justify-between h-full space-y-6">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Embedded Profile Image within the same block! */}
                <div className="w-[180px] sm:w-[200px] shrink-0 rounded-2xl overflow-hidden aspect-[200/230] shadow-sm self-center md:self-start">
                  <img
                    src={imgSrc}
                    alt="대표 법무사 여환동"
                    onError={handleImageError}
                    className="w-full h-full object-cover object-top rounded-2xl transition-transform duration-500 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Information area */}
                <div className="flex-1 space-y-4">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    대표 법무사 여환동의 약속
                  </h2>
                  
                  <div className="text-sm sm:text-base text-slate-600 font-semibold space-y-4 leading-relaxed">
                    <p className="text-justify break-all w-full">
                      의뢰인 한 분 한 분의 월 평균 소득 산출, 보유하고 있는 순자산 가액, 최근대출의 성실한 소명 방법, 부동산 및 임차보증금 등 자산 처리안을 <span className="text-amber-600 font-black">법무사가 직접 개별 검토하고,</span>
                    </p>
                    <p className="text-justify break-all w-full">
                      개인회생,파산 신청에 필요한 핵심 서류들인 <b>채권자목록, 변제계획안, 수입 및 지출에 관한 목록, 재산목록, 진술서</b> 등을 <span className="text-amber-700 font-black">대표 법무사가 직접 작성해 실무적 완성도를 높이며,</span>
                    </p>
                    <p className="text-justify break-all w-full">
                      신청서 작성의 시작 단계부터 까다로운 법원의 보정 권고 대응, 개시결정(파산선고), 그리고 마지막 최종 <span className="text-amber-600 font-black">인가결정(면책결정)에 이르는 모든 절차를 직접 안전하게 챙기도록 하겠습니다.</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-150 pt-6">
                <div className="text-center p-3 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <span className="block text-[11px] text-slate-400 font-extrabold">실무 경력</span>
                  <span className="block text-base sm:text-lg font-black text-slate-800 mt-1 font-sans">14년 경력</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <span className="block text-[11px] text-slate-400 font-extrabold">인가결정 누적</span>
                  <span className="block text-base sm:text-lg font-black text-slate-800 mt-1 font-sans">1,000건+</span>
                </div>
                <div className="text-center p-3 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <span className="block text-[11px] text-slate-400 font-extrabold">주요 법원</span>
                  <span className="block text-base sm:text-lg font-black text-amber-700 mt-1 font-sans">울산지방법원</span>
                </div>
              </div>
            </div>
          );

          const coreValuesCard = (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-xs space-y-6">
              <h2 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-3">
                의뢰자 중심의 안심 케어 정책
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-500/20">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-[16px] md:text-[18.1px] font-black text-slate-900 whitespace-nowrap">3~5일내 신속한 추심·금지명령</h3>
                    <p className="text-[14px] md:text-[15.8px] text-slate-600 font-semibold mt-1 text-justify break-all w-full">
                      빚 독촉과 압류의 고통에서 빠르게 벗어나 안심하고 생업에만 전념하실 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-500/20">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-[16px] md:text-[18.1px] font-black text-slate-900 whitespace-nowrap">청산가치 최소 반영·변제율 최소화</h3>
                    <p className="text-[14px] md:text-[15.8px] text-slate-600 font-semibold mt-1 text-justify break-all w-full">
                      주식/코인 투자 손실금 등 거주지역에 맞는 신중한 법리 전개로 청산가치 상쇄 보정을 적극 개척합니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-2xl bg-[#FAF9F5] border border-slate-100">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold border border-amber-500/20">
                    <ThumbsUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] sm:text-[16px] md:text-[18.1px] font-black text-slate-900 whitespace-nowrap">우편물 비밀 대리수령 보장</h3>
                    <p className="text-[14px] md:text-[15.8px] text-slate-600 font-semibold mt-1 text-justify break-all w-full">
                      가족, 직장 동료들에게 채무 내역 및 법원 우편물이 노출되지 않도록 대리 수령을 시행합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );

          return (
            <>
              {/* PC Layout: Vertical Stack */}
              <div className="hidden md:flex flex-col gap-6 mb-10">
                {promiseCard}
                {contactMapCard}
                {coreValuesCard}
              </div>

              {/* Mobile Layout: Sequenced Flow */}
              <div className="block md:hidden flex flex-col gap-6 mb-10">
                {/* Order 1: 약속 카드 (내부에 사진 포함) */}
                {promiseCard}

                {/* Order 2: 사무소 오시는 길 */}
                {contactMapCard}

                {/* Order 3: 안심 케어 정책 카드 */}
                {coreValuesCard}
              </div>
            </>
          );
        })()}

        {/* Action Button Section bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg md:text-[20.7px] font-black text-slate-900">나의 개인회생 자격과 탕감액은?</h3>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all hover:scale-[1.01] cursor-pointer text-center whitespace-nowrap"
            >
              메인으로
            </button>
            <button
              onClick={onStartSurvey}
              className="flex-1 sm:flex-none px-6 py-3.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl text-xs tracking-wide shadow-xs transition-all hover:scale-[1.01] cursor-pointer text-center whitespace-nowrap"
            >
              1분 자격 진단하기
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
