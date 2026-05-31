import React from 'react';
import { Scale, PhoneCall, HelpCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onAdminClick?: () => void;
}

export default function Footer({ onAdminClick }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-400 py-10 md:py-12 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Main Hotline and Core Anchors */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <h4 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight">
              필요한 만큼, 꼭 필요한 방식으로
            </h4>
          </div>

          <div className="w-full md:w-auto flex flex-row justify-start md:justify-end">
            <a
              href="tel:010-5410-5679"
              className="px-4 py-2 sm:px-6 sm:py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 font-black rounded-xl sm:rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 sm:gap-2.5 shadow-xs hover:shadow-md text-[13px] sm:text-base active:scale-[0.98] select-none"
            >
              <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
              법무사 즉시 상담  010-5410-5679
            </a>
          </div>
        </div>

        {/* Corporate bottom row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[12px] sm:text-[14px] pt-1">
          <div className="space-y-1.5">
            <p className="text-[14px] font-bold text-white tracking-wider">상호: 법무사 여환동 사무소 | 대표 법무사 여환동</p>
            <div className="flex flex-col md:flex-row md:items-center md:gap-x-4 space-y-1 md:space-y-0">
              <p className="text-[14px] font-bold text-white tracking-wider">사업자등록번호: 610-06-65592</p>
              <p className="text-[14px] font-bold text-white tracking-wider">주소: 울산 남구 법대로14번길 18 1층</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-extrabold text-[#94a3b8]">© {currentYear} 법무사 여환동 사무소. All rights reserved.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
