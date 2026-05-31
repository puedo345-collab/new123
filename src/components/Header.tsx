import React, { useState } from 'react';
import { ShieldCheck, Menu, X, Scale } from 'lucide-react';

const processLogoImage = (base64Str: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Calculate grayscale value
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // If the pixel is close to pure white, make it transparent
          if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0;
          } else {
            // Otherwise, color the non-white emblem to deep slate (#0F172A = RGB 15, 23, 42)
            data[i] = 15;
            data[i + 1] = 23;
            data[i + 2] = 42;
            
            // Adjust transparency to preserve anti-aliasing smooth edges
            const factor = Math.max(0, 255 - gray) / 255;
            data[i + 3] = Math.round(a * factor);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL());
      } catch (e) {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

interface HeaderProps {
  onNavClick: (section: string) => void;
  onStartSurvey: () => void;
}

export default function Header({ onNavClick, onStartSurvey }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logoImg, setLogoImg] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);
  const headerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const loadLogo = () => {
      setLogoLoading(true);
      fetch('/api/logo-image')
        .then((res) => res.json())
        .then(async (data) => {
          if (data && data.image) {
            const processed = await processLogoImage(data.image);
            setLogoImg(processed);
          } else {
            setLogoImg(null);
          }
        })
        .catch((err) => console.error("Error loading logo:", err))
        .finally(() => {
          setLogoLoading(false);
        });
    };

    loadLogo();

    window.addEventListener("logo-updated", loadLogo);
    return () => {
      window.removeEventListener("logo-updated", loadLogo);
    };
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        if (window.history.state?.type === 'mobileMenu') {
          window.history.back();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  // Intercept browser back button to close mobile menu gracefully instead of site exit
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen && window.history.state?.type !== 'mobileMenu') {
      window.history.pushState({ type: 'mobileMenu' }, '');
    }
  }, [isOpen]);

  const navItems = [
    { id: 'brand', label: '법무사 소개' },
    { id: 'stories', label: '개인회생 신청자격' },
    { id: 'bankruptcy', label: '개인파산 신청자격' },
    { id: 'faq', label: '자주 묻는 질문' }
  ];

  return (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#FAF4E5] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Brand area */}
          <div className="flex items-center gap-1.5 sm:gap-[7.2px] select-none h-full min-w-0">
            <div 
              id="header-logo-container"
              onClick={() => onNavClick('hero')}
              className={`relative w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer overflow-hidden shrink-0 bg-transparent`}
            >
              {!logoLoading && (
                logoImg ? (
                  <img 
                    src={logoImg} 
                    alt="여환동 법률 로고" 
                    className="w-full h-full object-contain p-0.5 transition-all duration-300" 
                  />
                ) : (
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2] text-[#0F172A]" />
                )
              )}
            </div>
 
            <div 
              className="flex flex-col cursor-pointer justify-center min-w-0" 
              onClick={() => onNavClick('hero')}
            >
              <span className="text-[13.5px] min-[360px]:text-[15.5px] min-[390px]:text-[19px] sm:text-[22px] font-black tracking-tight text-[#0F172A] block leading-tight pt-0.5 whitespace-nowrap break-keep">
                법무사 여환동 사무소
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 break-keep h-full">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavClick(item.id)}
                className="text-lg font-bold text-slate-600 hover:text-amber-600 transition-colors duration-200 cursor-pointer py-2 flex items-center h-full"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Button Area */}
          <div className="hidden md:flex items-center gap-4 h-full">
            <button
              onClick={onStartSurvey}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm tracking-tight shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              1분 자격진단 시작
            </button>
          </div>

          {/* Mobile hamburger icon */}
          <div className="md:hidden flex items-center gap-1 sm:gap-2">
            <button
              onClick={onStartSurvey}
              className="px-2 py-1.5 min-[360px]:px-3 min-[360px]:py-2 text-[10.5px] min-[360px]:text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-95 rounded-lg sm:rounded-xl transition-all cursor-pointer shadow-xs duration-100 whitespace-nowrap shrink-0"
              id="mobile-header-accent-btn"
            >
              1분 자격진단
            </button>
            <button
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false);
                  if (window.history.state?.type === 'mobileMenu') {
                    window.history.back();
                  }
                } else {
                  setIsOpen(true);
                }
              }}
              className="p-1.5 sm:p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-all cursor-pointer flex items-center justify-center min-w-8 min-h-8 sm:min-w-10 sm:min-h-10"
              aria-label="Toggle Menu"
              id="mobile-header-hamburger-btn"
            >
              {isOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-[#FAF4E5] bg-[#FAF9F5] shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setIsOpen(false);
                  if (window.history.state?.type === 'mobileMenu') {
                    (window as any).isProgrammaticBack = true;
                    window.history.back();
                    setTimeout(() => {
                      onNavClick(item.id);
                    }, 100);
                  } else {
                    onNavClick(item.id);
                  }
                }}
                className="block w-full text-left px-4 py-3 rounded-xl text-base font-bold text-slate-700 hover:bg-amber-500/10 hover:text-amber-700 transition-all cursor-pointer"
              >
                {item.label}
              </button>
            ))}
            <div className="border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (window.history.state?.type === 'mobileMenu') {
                    (window as any).isProgrammaticBack = true;
                    window.history.back();
                    setTimeout(() => {
                      onStartSurvey();
                    }, 100);
                  } else {
                    onStartSurvey();
                  }
                }}
                className="w-full py-3.5 text-center bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl shadow-md tracking-wide cursor-pointer flex justify-center items-center gap-2"
              >
                신청자격 무료 알아보기 (약 1분)
              </button>
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium">
              ※ 법무사 여환동 직접 검토 및 철저한 개인정보 보호 보장
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
