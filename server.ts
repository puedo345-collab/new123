import express from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Standard port is strictly 3000 or dynamically set by host (like Render)
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const DB_FILE_PATH = path.join(process.cwd(), "submissions.json");
const ADMIN_CONFIG_PATH = path.join(process.cwd(), "admin_config.json");

interface Submission {
  id: string;
  name: string;
  phone: string;
  occupation: string;
  debtAmount: string;
  monthlyIncome?: string;
  dependentsCount?: string;
  hasMoreDebtThanAssets: string;
  region: string;
  difficulties: string[];
  ageGroup: string;
  status: "신청완료" | "상담중" | "서류요청" | "접수완료" | "완료" | "기각";
  counselorNotes: string;
  createdAt: string;
  updatedAt: string;
  isSimpleConsultation?: boolean;
}

// Ensure database file exists
function initDatabase() {
  if (!fs.existsSync(DB_FILE_PATH)) {
    const seedSubmissions: Submission[] = [
      {
        id: "sub_1",
        name: "김민재",
        phone: "010-8234-9004",
        occupation: "regular_employee",
        debtAmount: "50m_100m",
        monthlyIncome: "200_300",
        dependentsCount: "2",
        hasMoreDebtThanAssets: "yes",
        region: "seoul_metropolitan",
        difficulties: ["high_interest", "living_cost"],
        ageGroup: "30대",
        status: "상담중",
        counselorNotes: "3천만원 추가 이자 부담으로 가용 소득의 부족을 호소함. 2026 최저생계비 기준 적용하여 월 120만원 수준 조정 및 최근 대출 소명안 논의 중.",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: "sub_2",
        name: "이지영",
        phone: "010-3345-7182",
        occupation: "business_owner",
        debtAmount: "over_100m",
        monthlyIncome: "300_400",
        dependentsCount: "3",
        hasMoreDebtThanAssets: "yes",
        region: "seoul_metropolitan",
        difficulties: ["debt_repayment", "guarantee"],
        ageGroup: "40대",
        status: "신청완료",
        counselorNotes: "",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: "sub_3",
        name: "최성우",
        phone: "010-5561-1209",
        occupation: "freelancer_parttime",
        debtAmount: "30m_50m",
        monthlyIncome: "150_200",
        dependentsCount: "1",
        hasMoreDebtThanAssets: "yes",
        region: "other_regions",
        difficulties: ["living_cost"],
        ageGroup: "20대",
        status: "접수완료",
        counselorNotes: "단독 거주 최저생계비 소득 보충 소명서 첨부 예정. 성실 상환 의사 매우 높음.",
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
      }
    ];
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(seedSubmissions, null, 2), "utf-8");
  }
}

const ARTICLES_FILE_PATH = path.join(process.cwd(), "articles.json");

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
  status?: string;
}

function initArticlesDatabase() {
  if (!fs.existsSync(ARTICLES_FILE_PATH)) {
    const seedArticles: Article[] = [
      {
        id: "art_1",
        category: "코인/투자 채무",
        title: "주식·코인 최근 채무 비율 85%, 청산가치 산정의 한계를 돌파한 30대 가장의 회생기",
        age: "30대 중반",
        job: "영업직 (프리랜서)",
        originalDebt: "1억 2,000만 원",
        reducedDebt: "2,160만 원",
        monthlyPayment: "60만 원 (36개월)",
        reductionRate: 82,
        content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black flex items-center gap-2 mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산에 거주하는 30대 중반의 직장인 A씨는 어린 딸을 홀로 양육하는 한부모 가장이었습니다. 고물가 속 생활비 부담을 덜고자 시작한 코인/선물 투자가 잇단 손실로 이어졌고, 이를 메우기 위해 연 20%가 넘는 카드론과 대부업 고금리 대출에 손을 대면서 불과 1년 만에 채무가 1억 2천만 원까지 급증했습니다. 최근 발생한 대출 비중이 전체의 85%에 달해 일반적인 대리인 사무소에서는 기각 가능성이 매우 높다고 판단한 고위험 사건이었습니다.
  </p>

  <div class="my-6">
    <img src="/rehab_success_infographic.png" alt="개인회생 성공 리포트" class="w-full rounded-2xl shadow-md border border-slate-200/50" />
  </div>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    울산지방법원은 주식/사행성 채무 및 최근 채무 비율이 높은 사건에 대해 매우 엄격한 보정 명령을 내립니다. 본 사건의 가장 큰 걸림돌은 두 가지였습니다.<br/>
    <strong>첫째</strong>, 코인 거래소로 흘러 들어간 자금 전액을 '청산가치(본인 재산)'에 반영하라는 법원의 보정 권고가 내려질 위기였습니다. 만약 투자 손실액이 전부 재산으로 잡히면 월 변제금이 터무니없이 높아져 회생을 중도 포기해야 하는 상황이었습니다.<br/>
    <strong>둘째</strong>, 프리랜서 성격이 섞인 영업직 소득으로 월 소득이 매달 불규칙하여 소득 산정 시 법원의 의심을 받는 상황이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 여환동 법무사 사무소의 독보적 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    저희 사무소는 14년 법원 실무 경력의 노하우를 바탕으로, 단순 실패가 아닌 배우자와의 이혼 과정에서 발생한 위자료 및 자녀 양육비 지출 내역을 세부 통장 내역 거래를 통해 1원 단위까지 분리 입증했습니다. 코인 손실금 중 실제 소비로 사라진 부분과 투자 실패로 소멸한 실질 자산을 소명 도표로 정리하여 법원이 요구하는 '최근 채무 소명 자료'를 완벽히 메웠습니다. 또한, 1인 생계비 외에 한부모 가정으로서의 '추가 생계비(자녀 치료비 및 교육비)' 필요성을 강력하게 소명하여 월 소득 대비 가용소득을 최소화하는 데 성공했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 인가 결과 및 법률적 교훈</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-none list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 2,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,160만 원 (원금의 18%만 변제)</li>
      <li><span class="text-emerald-700">탕감율: 82% 면책 결정</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 60만 원 (36개월 납입)</li>
    </ul>
  </div>
  <p class="leading-relaxed pl-1 text-slate-650">
    본 사건은 법원의 청산가치 반영 원칙에 맞서, 채무자의 실질적 갱생을 위해 법무사가 얼마나 집요하게 소명 서류를 다듬는지가 인가 성공의 핵심 열쇠임을 다시 한번 보여준 모범 사례입니다.
  </p>
</div>`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 120
      },
      {
        id: "art_2",
        category: "생활비/다중채무",
        title: "자녀 교육 및 생활비 다중 카드 대출 탕감",
        age: "40대 중반",
        job: "4대 가입 직장인",
        originalDebt: "8,500만 원",
        reducedDebt: "2,550만 원",
        monthlyPayment: "70만 원 (36개월)",
        reductionRate: 70,
        content: "코로나19 여파와 가계 지출 급증으로 다중 채무가 누적되어, 매달 원금보다 많은 이자만 갚아나가는 상황에 처한 가장이었습니다. 본인과 부양가족의 최저생계비를 변제금 산정에서 전액 공제받아 실질적인 생활비를 확보하면서도, 전체 채무의 70%를 탕감받는 변제 계획을 법원으로부터 인가받았습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 95
      },
      {
        id: "art_3",
        category: "사업 실패 채무",
        title: "식자재 대리점 폐업, 이직 후 성공한 사례",
        age: "30대 후반",
        job: "개인사업자 -> 프리랜서 이직",
        originalDebt: "1억 2,000만 원",
        reducedDebt: "2,400만 원",
        monthlyPayment: "66만 원 (36개월)",
        reductionRate: 80,
        content: "매출 부진으로 점포를 정리하는 과정에서 임대료 연체 채무와 물품을 납품받은 채무가 겹쳐 상당한 부채를 안고 통장 등에 압류를 당하게 되었습니다. 저희와 함께 보유 재산의 시가를 적정하게 산정한 결과, 최종 변제율을 낮춰 채무의 약 80%를 탕감받고, 개인회생 인가결정과 동시에 모든 압류를 일괄 해제할 수 있었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 180
      },
      {
        id: "art_4",
        category: "생활비/병원비",
        title: "병원비와 생활비로 불어난 신용카드 채무 해결",
        age: "30대 초반",
        job: "4대 보험 직장인",
        originalDebt: "3,800만 원",
        reducedDebt: "1,140만 원",
        monthlyPayment: "32만 원 (36개월)",
        reductionRate: 70,
        content: "가족의 갑작스러운 병원비를 마련하기 위해 카드론과 현금서비스를 반복하다 다중 연체 상태에 빠진 직장인이었습니다.많지 않던 월급으로 매달 불어나는 이자에 극심한 부담을 겪던 중 울산지방법원에 개인회생을 신청하였고, 원금의 70% 탕감과 이자 전액 면제를 포함한 변제 계획이 인가되어 월 변제금 32만 원으로 확정되었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 74
      },
      {
        id: "art_5",
        category: "사기 피해 채무",
        title: "보이스피싱 사기로 인해 발생한 대출금",
        age: "20대 중반",
        job: "중소기업 직장인",
        originalDebt: "2,600만 원",
        reducedDebt: "910만 원",
        monthlyPayment: "25만 원 (36개월)",
        reductionRate: 65,
        content: "사회초년생 직장인으로 명의도용 보이스피싱 피해를 입어 갑자기 불어난 대출금 채무로 고통받던 중, 저희 사무소의 사기피해 진술서 작성을 통해 사기 피해 사실을 소명하고 정직한 직장 소득과 부양가족을 인정받아 65%의 높은 원금 면책결정을 받았습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 112
      },
      {
        id: "art_6",
        category: "초기 생활 안정",
        title: "소득 불균형에 따른 카드 연체 해결",
        age: "30대 중반",
        job: "학원 강사 (프리랜서)",
        originalDebt: "4,200만 원",
        reducedDebt: "1,470만 원",
        monthlyPayment: "40만 원 (36개월)",
        reductionRate: 65,
        content: "학원 강사직 특성상 비정기적인 소득과 소득 공백 기간에 카드 연체와 현금서비스를 누적했던 프리랜서입니다. 불안정한 소득 증빙 조건에서도 최근 소득 평균값을 명확히 소명하여 청산가치를 낮추고 원금의 65%를 법원으로부터 면책 승인받았습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 89
      },
      {
        id: "art_7",
        category: "다중 카드 대출",
        title: "일용직 소득자의 소액 다중 연체 채무 정리",
        age: "40대 초반",
        job: "건설 일용직 프리랜서",
        originalDebt: "3,100만 원",
        reducedDebt: "1,085만 원",
        monthlyPayment: "30만 원 (36개월)",
        reductionRate: 65,
        content: "일용직 소득이 불규칙하여 월세와 식비를 대부업 소액 대출로 때우다 연체 위기에 몰렸던 의뢰인이었습니다. 법무사 여환동 사무소의 빠른 금지명령 접수로 당일 추심 정지를 이끌어냈으며, 가용한 자금을 성실히 계산해 월 30만 원 변제 계획으로 조속히 안정을 취하셨습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 65
      },
      {
        id: "art_8",
        category: "창업 실패/미수금",
        title: "온라인 쇼핑몰 폐업 후 잔존 소량 경영빚 해결",
        age: "30대 초반",
        job: "온라인 개인사업자",
        originalDebt: "4,800만 원",
        reducedDebt: "1,680만 원",
        monthlyPayment: "46만 원 (36개월)",
        reductionRate: 65,
        content: "경쟁 심화로 운영하던 1인 온라인 쇼핑몰을 접으며, 회사에 취업 후 울산지방법원에 접수하였으며, 잔존 자산이 전무하다는 사실을 입증하여 청산가치를 최저 수준으로 인정받았으나, 채무액이 다소 적어 전체 채무의 65%를 탕감 받을 수 있었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 93
      },
      {
        id: "art_9",
        category: "점포 확장 실패",
        title: "카페 매장 운영하면서 신청 후 인가결정 사례",
        age: "50대 초반",
        job: "영세 외식업 개인사업자",
        originalDebt: "3,900만 원",
        reducedDebt: "1,365만 원",
        monthlyPayment: "37만 원 (37개월)",
        reductionRate: 65,
        content: "울산 성남동에서 카페를 운영하며 매장 유지비와 원자재 구매용 전용 신용카드 결제 대금이 여러 항목으로 누적되어 사실상 변제가 불가능한 상황에 이른 자영업자입니다. 실제 사업 소득과 고정 운영비를 근거로 기본 유지 경영비를 공제받아 매달 실질적으로 감당 가능한 수준으로 변제금을 최소화하는 플랜을 설계받고 한시름 놓을 수 있었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 110
      },
      {
        id: "art_10",
        category: "주식/투자 실패",
        title: "무리한 주식 미수 및 신용융자 채무 대기업 직장인 구제",
        age: "30대 중반",
        job: "대기업 생산직 직장인",
        originalDebt: "7,800만 원",
        reducedDebt: "2,340만 원",
        monthlyPayment: "65만 원 (36개월)",
        reductionRate: 70,
        content: "주식 시장 급락으로 인한 미수금 및 신용융자 반대매매로 발생한 긴급 대환대출 압박을 해결한 사례입니다. 매달 높은 원리금 부담에서 보증인 동원 없이 70%의 높은 감면율로 울산지법 개시 결정을 받아 안정을 되찾았습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 145
      },
      {
        id: "art_11",
        category: "보증 채무",
        title: "지인 보증 채무 연대인수 연체 공무원 직장인 구제",
        age: "40대 초반",
        job: "공기업 근무 직장인",
        originalDebt: "1억 1,000만 원",
        reducedDebt: "3,850만 원",
        monthlyPayment: "106만 원 (36개월)",
        reductionRate: 65,
        content: "과거 호의로 제공한 연대보증이 주채무자 파산으로 이관되어 고액 추심에 직면했던 공공기관 재직자입니다. 법무사 여환동 특화 설계를 바탕으로 공무원 신분 불이익 처분 규정 등을 방어하며 법원에 원금 65% 감면 계획안을 통과시켰습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 82
      },
      {
        id: "art_12",
        category: "생활비/교육기금",
        title: "자녀 학비 마련 다중 카드론 및 신용대출 상환 구제",
        age: "40대 후반",
        job: "일반 중소기업 직장인",
        originalDebt: "6,200만 원",
        reducedDebt: "2,170만 원",
        monthlyPayment: "60만 원 (36개월)",
        reductionRate: 65,
        content: "중소기업 재직 고객으로 자녀 학자금과 부모님 병원비를 동시에 대출받아 생긴 이중고를 극복한 사례입니다. 근로 고유 수당 일부 소명을 거치며 가용 소득을 정밀하게 조정한 결과 총 채무액의 65%를 감면받는 가시적 효과를 얻었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 104
      },
      {
        id: "art_13",
        category: "사기 및 가전대출",
        title: "전세 사기 피해 및 카드 다중 채무 직장인 구제",
        age: "30대 후반",
        job: "금융사 마케터 직장인",
        originalDebt: "9,500만 원",
        reducedDebt: "3,325만 원",
        monthlyPayment: "92만 원 (36개월)",
        reductionRate: 65,
        content: "역전세 및 지인 사기로 전세자금대출 상환 부족액이 카드 신용 대부업 다중 채무로 부풀어 올랐던 금융사 마케팅 담당자입니다. 철저한 재산 내역 소명으로 총 가계 빚의 65%를 감면받는 회생안 인가를 성공적으로 완료했습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 137
      },
      {
        id: "art_14",
        category: "장비 리스 연체",
        title: "특수 장비 리스료 연체 및 현장 대금 미지급 복구",
        age: "40대 중반",
        job: "건설 현장 일용직 프리랜서",
        originalDebt: "5,800만 원",
        reducedDebt: "1,740만 원",
        monthlyPayment: "48만 원 (36개월)",
        reductionRate: 70,
        content: "화물 장비 대여 및 건설 리스 연체 압박에 시달리던 현장 특수직 프리랜서입니다. 불안정한 기후 및 소득 주기를 완만하게 법원 재판부에 피력함으로써, 청산가치를 대폭 보정받아 이자 100% 감면 및 원금 70% 탕감을 완료하였습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 92
      },
      {
        id: "art_15",
        category: "개발 지연 채무",
        title: "소프트웨어 프로젝트 아웃소싱 무산 연대채무 해소",
        age: "30대 중반",
        job: "IT 소프트웨어 개발 프리랜서",
        originalDebt: "8,900만 원",
        reducedDebt: "2,670만 원",
        monthlyPayment: "74만 원 (36개월)",
        reductionRate: 70,
        content: "외주 개발 단가 상승과 대금 미수령으로 카드론과 2금융권 채무를 메우다 파산 일보 직전이었던 IT 엔지니어입니다. 법무사 여환동 사무소의 빠른 부채 증명 절차 개시로 최근 채무 사유에 대한 타당성을 입증해 70% 면책 승인을 유치하였습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 119
      },
      {
        id: "art_16",
        category: "임대료/수수료 채무",
        title: "코로나 시기 학원 유지비 및 다중 수수료 채무 정리",
        age: "40대 초반",
        job: "학원 수학 강사 프리랜서",
        originalDebt: "7,200만 원",
        reducedDebt: "2,520만 원",
        monthlyPayment: "70만 원 (36개월)",
        reductionRate: 65,
        content: "비대면 수업 전환으로 프리랜서 정기 인센티브 수령 지출 비용이 누적되어 상환액이 늘어난 고객입니다. 자격진단 분석으로 월 가용소득 합계를 합리적으로 법원에 제출하여 법무사 대리 진행으로 원금의 65% 공제 인가를 받았습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 71
      },
      {
        id: "art_17",
        category: "물품 대금 연체",
        title: "의류 도,소매업 오프라인 매장 운영하면서 진행",
        age: "40대 중반",
        job: "의류 도소매 개인사업자",
        originalDebt: "1억 6,000만 원",
        reducedDebt: "4,800만 원",
        monthlyPayment: "133만 원 (36개월)",
        reductionRate: 70,
        content: "울산 무거동에서 의류 매장을 운영하다 매출 급감으로 폐업하게 된 자영업자입니다. 재고 매입 미수금과 시설(인테리어) 리스 대출이 겹쳐 도합 1억 6천만 원의 연체 채무를 안게 되었습니다. 세무·회계 자료를 통해 실질 영업 손실과 소득 감소를 입증하고 청산가치를 절반 가량 낮춰 보정한 결과, 원리금 전체의 70%를 면제받을 수 있었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 153
      },
      {
        id: "art_18",
        category: "공장 보강 부채",
        title: "설비 기계 수리비 누적 공장 자금 가계 대환 승인",
        age: "50대 중반",
        job: "제조업 공장 유통 개인사업자",
        originalDebt: "2억 3,000만 원",
        reducedDebt: "6,900만 원",
        monthlyPayment: "191만 원 (36개월)",
        reductionRate: 70,
        content: "영세 유통라인 하청 실패로 설비리스 압류가 들어온 제조 사업자입니다. 법무사 여환동 사무소의 대외 자금 흐름 고지 정비로 공장 유지를 위한 필수 최저 생계 여력을 인정받어 70% 탕감을 수반하며 정상 회복되었습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 111
      },
      {
        id: "art_19",
        category: "가맹 전대 연체",
        title: "프랜차이즈 가맹 전대 매매 보증 연합 부도 차단",
        age: "40대 초반",
        job: "화장품 유통업 개인사업자",
        originalDebt: "8,800만 원",
        reducedDebt: "3,080만 원",
        monthlyPayment: "85만 원 (36개월)",
        reductionRate: 65,
        content: "유통 채널 철수로 상품 도매 잔대금 수억 동반 과입력이 발생했던 영세 자영업자입니다. 법률 대리 자문 특혜로 매출 이익율 하락 공제를 적극 반영받아 안정적인 월 85만 원 36개월 변제 계획으로 안식을 취했습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 124
      },
      {
        id: "art_20",
        category: "매장 유지 부채",
        title: "인테리어 자재 공사 지연 및 임대료 자영업 부채 면제",
        age: "50대 초반",
        job: "프랜차이즈 가맹점 개인사업자",
        originalDebt: "1억 2,500만 원",
        reducedDebt: "4,375만 원",
        monthlyPayment: "121만 원 (36개월)",
        reductionRate: 65,
        content: "가맹 비용 지출 대비 상권 매출이 나오지 않아 매달 수백만 원 임대료 손실을 가계 대출로 충당하던 업주입니다. 울산지방법원 회생 절차를 통해 보증금 잔존액을 시가에서 소거하고 원금의 65% 고정 탕감 판결을 이뤘습니다.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 139
      }
    ];
    fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(seedArticles, null, 2), "utf-8");
  }
}

const FAQS_FILE_PATH = path.join(process.cwd(), "faqs.json");

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

function initFaqsDatabase() {
  if (!fs.existsSync(FAQS_FILE_PATH)) {
    const seedFaqs: FAQItem[] = [
      {
        id: "faq_1",
        question: "울산 거주자가 울산법무사 사무실에서 진행할 때 어떤 장점이 있나요?",
        answer: "울산지방법원 앞에서 14년 간 개인회생, 개인파산 실무를 경험한 법무사 사무실이므로, 울산지방법원의 회생위원이나 파산관재인의 성향과 고유한 예규 기준에 맞춰 변제계획안을 도출해 낼 수 있으며, 회생위원이나 관재인의 추가 질문이나 보정명령에 지체없이 실시간으로 대처 가능해 불필요한 청산가치 반영 또는 재산 환가를 최소한으로 방어해 최고의 탕감 비율을 이끌어 내는 등, 언제든 수시로 사무실을 방문해 법무사와 상담이 가능한 장점이 있습니다."
      },
      {
        id: "faq_2",
        question: "채권자가 주택(아파트)에 경매를 넣었어요. 개인회생으로 정지 시킬 수 있나요?",
        answer: "채권자가 경매를 신청해서 경매 절차가 개시되었다 하더라도, 주택(아파트) 소유자는 개인회생 신청과 동시에 중지명령을 신청할 수 있고, 법원으로부터 중지명령 결정문을 수령한 다음, 경매가 진행되고 있는 해당 경매법원에 경매 절차를 정지 시켜달라는 \"부동산 강제경매(또는 임의경매) 정지 신청서\"를 제출해 경매 절차 개인회생 개시결정 시까지 일시적으로 정지 시킬 수 있습니다. 다만 개인회생 인가결정 후 정지되어 있던 경매 절차를 완전히 취소 시킬 수 있는지 여부는, 그 경매가 \"일반 채권자가 신청한 강제경매\"인지 또는 \"근저당권자 등 담보권자가 신청한 임의경매\"인지 여부에 따라 달라지므로 이 부분을 잘 파악하고 대응해야 합니다."
      },
      {
        id: "faq_3",
        question: "1년 이내에 발생한 최근대출이 채무의 대부분인데, 개인회생 신청이 가능할까요?",
        answer: "네, 충분히 가능합니다. 단순히 최근 1년 이내에 대출 건수나 금액이 많다는 이유만으로 법원이 기각을 내릴 수 있다는 법은 없습니다. 핵심은 최근 대출금의 '사용처' 소명인데요. 대출을 내어 생계비로 사용한 경우, 기존 카드론 대부업 대출금의 돌려막기를 한 경우, 본인이나 가족의 치료비 등으로 사용한 경우와 같이 어쩔 수 없는 사유로 사용된 금액은 낭비로 보지 않아 전혀 문제가 되지 않습니다. 다만, 대출을 내어 증빙할 수 없는 곳에 사용하기 위해 현금을 인출한 경우, 지인에게 돈을 빌려 준 경우, 고가의 사치품을 산 경우와 같이 낭비로 볼수 있는 경우에는 그 낭비 금액 만큼을 청산가치에 반영해 더 많은 금액을 변제해야 하는 상황에 처할 수는 있으나, 이 마저도 개인회생을 기각하는 사유는 되지 않으므로 걱정 마시고 사용처 소명을 완벽히 할 수 있는 방안을 찾으시기 바랍니다."
      },
      {
        id: "faq_4",
        question: "집 가전제품에 빨간딱지(유체동산 압류 경매)가 붙었어요..어떻게 해야 하나요?",
        answer: "집 안의 가전제품이나 고가품 등에 이른바 '빨간딱지'가 붙는 유체동산 압류를 당하시면 엄청난 심리적 압박을 느끼게 됩니다. 하지만 아래 절차와 같이 개인회생 절차에서 충분히 해결이 가능합니다. 1.즉시 개인회생을 신청 해야 합니다.(유체동산 경매가 시작되면 2~3주 이내에 경매기일이 잡히기 때문입니다) 2.개인회생 절차 개시 신청서 접수 시 '유체동산 압류 중지명령 신청서'를 함께 접수합니다. 3.법원으로 부터 송달받은 '중지명령 결정문'을 집행관실에 제출해 매각기일은 잠정 연기합니다. 4.개인회생 인가결정 후 중지되어 있는 유체동산경매 절차를 취소 시킵니다.(사실 이절차는 하지 않는 경우가 대부분입니다) ※경매 기일이 지정되기 전에 빠르게 중지명령을 받아내는 것이 핵심이므로, 즉시 개인회생 전문가의 도움을 받아 대응해야 합니다."
      },
      {
        id: "faq_5",
        question: "채권자의 전화 방문 독촉, 압류 추심 등은 언제 금지될까요?",
        answer: "울산회생법원에 신청서 및 부속 서류가 접수되면, 법원은 통상 평균 3~5일 이내에 채권사에게 '금지명령문'을 우편 송달합니다. 금지명령이 채권사들에게 전달되는 시점부터 일체의 전화 추심, 자택 방문, 급여 압류 등 강제집행이 전면 차단되므로 심리적 안정을 되찾으실 수 있습니다. 다만 금지명령 결정문이 채권자에게 도달되어야 금지명령의 효력이 발생하므로 송달 여부를 잘 챙겨야 합니다."
      },
      {
        id: "faq_6",
        question: "주식, 코인, 토토 등에 투자하기 위해 발생한 빚도 탕감받나요?",
        answer: "네, 충분히 가능합니다. 최근 대출로 주식이나 코인, 가상자산에 투자해 발생한 손실 역시 회생 탕감의 대상입니다. 최근 울산지방법원의 실무에 따르면 주식 및 코인 등으로 발생한 투자 손실금 자체를 예전처럼 전액 청산가치에 반영하지 않고 있으므로, 과거 대비 탕감율이 극적으로 높아졌습니다."
      },
      {
        id: "faq_7",
        question: "직장이나 가족 배우자 모르게 개인회생 절차 진행이 가능한가요?",
        answer: "네, 가능합니다. 저희 법무사 사무소는 법원에서 송달하는 일체의 보정명령문·이의신청서·결정문 등을 전자소송 사이트를 통해 100% 안전하게 대리 송달 받고 있습니다. 이에 따라 소속 회사나 동거 가족 들이 해당 상황을 눈치채지 못하도록 철저한 비밀 유지 절차를 보장합니다. 또한 원칙적으로 배우자 서류는 첨부서류가 아니며, 부양가족 등을 무리하게 산정하지 않는 한 배우자 서류를 제출하지 않는 것이 원칙입니다."
      },
      {
        id: "faq_8",
        question: "자영업자는 사업을 폐업해야지만 개인회생을 신청할 수 있는 건가요?",
        answer: "아닙니다. 사업을 폐업하지 않아도 되는데요. 그 이유는 개인회생 절차는 채무자가 하고 있는 업을 그대로 유지하게 하면서 신용을 회복 시키기 위한 제도이므로, 사업을 하고 있는 사람은 그 사업에서 발생하는 매출에서 지출 경비를 뺀 나머지를 소득으로 신고해, 월 변제금을 산정하는 방법으로 회생을 진행하는 것입니다. 즉 개인사업자는 회생 준비를 위해 일부러 사업을 폐업하지 마시기 바랍니다."
      },
      {
        id: "faq_9",
        question: "회생을 하고 싶은데, 남편의 연봉이 많아서 내가 개인회생을 할 수 없는 것 아닌가요?",
        answer: "아닙니다. 남편의 연봉이 많아도 개인회생을 할 수 있는 것이 원칙입니다. 예를 들어 볼게요 개인회생을 하고자 하는 여성의 월 소득이 250만원이며 현재 부담하고 있는 채무는 약 8,000만원 정도입니다. 이 여성은 월급의 일부를 생계비로 사용하고 난 나머지로 약 8천만 원의 채무를 부담하기 힘들 것입니다. 그런데 남편의 연봉이 1억2천만 원이라서 좀 도와주면 쉽게 빚을 갚을 수 있을것 같은데 사실 도와 달라고 말을 못하는 상황이 있을수 있습니다. 그렇다면 개인회생을 신청하면 법원이 항상 남편의 연봉 자료를 제출하라고 할까요? 아닙니다. 그럼 언제 제출하라고 할까요? 만일 위 여성에게 미성년 자녀가 있는데 그 자녀를 부양가족으로 인정받고자 할 때 남편의 소득이 얼마인지 확인하고자 남편의 소득 서류를 제출하라고 하는 것입니다. 따라서 위 여성도 자신의 소득에서 1인 최저생계비를 제외한 나머지 모두를 법원에 납부하겠다고 한다면 남편의 소득은 전혀 문제가 되지 않는 경우로서 개인회생을 진행할 수 있는 것이죠."
      }
    ];
    fs.writeFileSync(FAQS_FILE_PATH, JSON.stringify(seedFaqs, null, 2), "utf-8");
  }
}

initDatabase();
initArticlesDatabase();
initFaqsDatabase();

// Read from JSON DB
function readSubmissions(): Submission[] {
  try {
    const data = fs.readFileSync(DB_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return [];
  }
}

// Write to JSON DB
function writeSubmissions(data: Submission[]) {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database:", error);
  }
}

// In-Memory Secure Session Map to prevent Reverse Base64 password decoding
const secureSessions = new Map<string, { expiresAt: number }>();

// Helper function to hash password with a secure salt
function hashPassword(password: string, salt: string): string {
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

// Check input password against stored (salted hash or plaintext config)
function verifyPassword(input: string, stored: string): boolean {
  if (stored.startsWith("sha256:")) {
    const parts = stored.split(":");
    if (parts.length === 3) {
      const [, salt, hash] = parts;
      return hashPassword(input, salt) === hash;
    }
  }
  return input === stored;
}

// XSS input sanitization to strip unsafe HTML markup
function sanitizeInput(str: string): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

async function startServer() {
  const app = express();

  // Limit JSON payloads to 10MB to prevent Server Resource DoS Attacks
  app.use(express.json({ limit: "10mb" }));

  // Check admin password (supports dynamic file override or environment variable setup)
  const getAdminPassword = () => {
    try {
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
        if (configData && configData.adminPassword) {
          return String(configData.adminPassword);
        }
      }
    } catch (err) {
      console.error("[getAdminPassword] Error reading admin config:", err);
    }
    return process.env.ADMIN_PASSWORD || "1234";
  };

  // Helper middleware to verify token (using cryptographically secure session-lookup map)
  const verifyAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "권한이 없습니다. 로그인이 필요합니다." });
      return;
    }

    const token = authHeader.replace("Bearer ", "");
    
    // Lazy session expiration lookup (sessions expire after 2 hours)
    const session = secureSessions.get(token);
    if (session && session.expiresAt > Date.now()) {
      // Touch session to renew active lifespan
      session.expiresAt = Date.now() + 7200000;
      next();
    } else {
      if (session) {
        secureSessions.delete(token);
      }
      res.status(403).json({ error: "세션이 만료되었거나 권한이 맞지 않습니다." });
    }
  };

  // Helper function to send simple SMS alert via Solapi
  const sendSolapiSms = async (text: string, toPhone?: string): Promise<boolean> => {
    try {
      if (!fs.existsSync(ADMIN_CONFIG_PATH)) {
        console.log("[Solapi] Configuration file not found. Skipping send.");
        return false;
      }
      const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      const apiKey = configData.solapiApiKey || "NCSILNXQCTP5G38I";
      const apiSecret = configData.solapiApiSecret || "WP9OAFRBQNU9XZRXWCU7OHGOBCTH8JKB";
      const receiverPhone = configData.solapiReceiverPhone || "01054105679";

      if (!apiKey || !apiSecret || !receiverPhone) {
        console.log("[Solapi] Credentials or recipient phone not configured. Skipping.", { apiKey, receiverPhone });
        return false;
      }

      const senderPhone = receiverPhone.replace(/[^0-9]/g, "");
      const cleanPhone = toPhone ? toPhone.replace(/[^0-9]/g, "") : senderPhone;
      
      if (!cleanPhone || !senderPhone) {
        console.log("[Solapi] Recipient or sender phone empty after sanitization.");
        return false;
      }

      // Solapi HMAC v4 authentication signatures
      const date = new Date().toISOString();
      const salt = crypto.randomBytes(16).toString("hex");
      const signature = crypto
        .createHmac("sha256", apiSecret)
        .update(date + salt)
        .digest("hex");

      const authHeaderValue = `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;

      // Payload for single transmission
      const payload = {
        message: {
          to: cleanPhone,
          from: senderPhone, // Registered sender ID in Solapi setting (usually user's same number)
          text: text
        }
      };

      console.log(`[Solapi] Standard single dispatch triggered to ${cleanPhone}:`, text);

      // We'll perform standard POST request
      const response = await fetch("https://api.solapi.com/messages/v4/send", {
        method: "POST",
        headers: {
          "Authorization": authHeaderValue,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.warn(`[Solapi] Single dispatch failed (Status: ${response.status}). Trying send-many payload:`, errorDetail);

        // Fallback option: Use send-many endpoint if single /send is rejected
        const fallbackPayload = {
          messages: [
            {
              to: cleanPhone,
              from: senderPhone,
              text: text
            }
          ]
        };

        const fallbackResponse = await fetch("https://api.solapi.com/messages/v4/send-many", {
          method: "POST",
          headers: {
            "Authorization": authHeaderValue,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(fallbackPayload)
        });

        if (!fallbackResponse.ok) {
          const fallbackErr = await fallbackResponse.text();
          console.error(`[Solapi] Fallback dispatch also failed (Status: ${fallbackResponse.status}):`, fallbackErr);
          return false;
        }

        const fbData = await fallbackResponse.json();
        console.log("[Solapi] Fallback SMS alert completed successfully:", fbData);
        return true;
      }

      const resData = await response.json();
      console.log("[Solapi] SMS alert completed successfully:", resData);
      return true;
    } catch (e) {
      console.error("[Solapi] Critical error occurred on dispatching SMS notification:", e);
      return false;
    }
  };

  // API: Get Solapi configuration
  app.get("/api/admin/solapi-config", verifyAdmin, (req, res) => {
    try {
      let configData: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      res.json({
        solapiApiKey: configData.solapiApiKey || "NCSILNXQCTP5G38I",
        solapiApiSecret: configData.solapiApiSecret || "WP9OAFRBQNU9XZRXWCU7OHGOBCTH8JKB",
        solapiReceiverPhone: configData.solapiReceiverPhone || "01054105679"
      });
    } catch (err) {
      console.error("[getSolapiConfig] Error:", err);
      res.status(500).json({ error: "솔라피 설정을 불러오는 도중 오류가 발생했습니다." });
    }
  });

  // API: Update Solapi configuration
  app.post("/api/admin/solapi-config", verifyAdmin, (req, res) => {
    const { solapiApiKey, solapiApiSecret, solapiReceiverPhone } = req.body;
    if (!solapiApiKey || !solapiApiSecret || !solapiReceiverPhone) {
      res.status(400).json({ error: "모든 항목을 올바르게 기입해 주세요." });
      return;
    }

    try {
      let configObj: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configObj = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      configObj.solapiApiKey = solapiApiKey.trim();
      configObj.solapiApiSecret = solapiApiSecret.trim();
      configObj.solapiReceiverPhone = solapiReceiverPhone.replace(/[^0-9]/g, "");

      fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(configObj, null, 2), "utf-8");
      res.json({ success: true, message: "솔라피 알림 설정이 안전하게 업데이트 되었습니다." });
    } catch (err) {
      console.error("[saveSolapiConfig] Error:", err);
      res.status(500).json({ error: "솔라피 설정을 저장하는 도중 서버 오류가 발생했습니다." });
    }
  });

  // API: Get App configuration info
  app.get("/api/config", (req, res) => {
    let kakaoChannelUrl = "http://pf.kakao.com/_xhTqgG/chat";
    try {
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
        if (configData && configData.kakaoChannelUrl) {
          kakaoChannelUrl = configData.kakaoChannelUrl;
        }
      }
    } catch (err) {
      console.error("[getConfig] Error reading config:", err);
    }
    res.json({
      hasAdminPasswordConfigured: true,
      kakaoChannelUrl,
    });
  });

  // API: Update Kakao Channel URL (Protected)
  app.post("/api/admin/kakao-url", verifyAdmin, (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string" || !url.startsWith("http")) {
      res.status(400).json({ error: "올바른 http/https 형식의 카카오 채널 URL을 입력해 주세요." });
      return;
    }

    try {
      let configObj: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configObj = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      configObj.kakaoChannelUrl = url.trim();
      fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(configObj, null, 2), "utf-8");
      res.json({ success: true, message: "카카오톡 채널 연동 주소가 안전하게 변경되었습니다." });
    } catch (err) {
      console.error("[changeKakaoUrl] Error:", err);
      res.status(500).json({ error: "설정 저장 도중 서버 에러가 발생했습니다." });
    }
  });

  // API: Get lawyer profile image
  app.get("/api/profile-image", (req, res) => {
    try {
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
        if (configData && configData.profileImage) {
          res.json({ image: configData.profileImage });
          return;
        }
      }
    } catch (err) {
      console.error("[getProfileImage] Error reading profile image:", err);
    }
    // Return empty or default
    res.json({ image: null });
  });

  // API: Update lawyer profile image (Protected with verifyAdmin)
  app.post("/api/profile-image", verifyAdmin, (req, res) => {
    const { image } = req.body;
    if (image !== "" && (!image || typeof image !== "string")) {
      res.status(400).json({ error: "유효하지 않은 이미지 데이터입니다." });
      return;
    }

    try {
      let configObj: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configObj = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      if (image === "") {
        delete configObj.profileImage;
      } else {
        configObj.profileImage = image;
      }
      fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(configObj, null, 2), "utf-8");
      res.json({ success: true, message: "프로필 이미지 설정이 완료되었습니다." });
    } catch (err) {
      console.error("[updateProfileImage] Error storing profile image:", err);
      res.status(500).json({ error: "프로필 이미지 저장 도중 오류가 발생했습니다." });
    }
  });

  // API: Get custom logo image
  app.get("/api/logo-image", (req, res) => {
    try {
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
        if (configData && configData.logoImage) {
          res.json({ image: configData.logoImage });
          return;
        }
      }
    } catch (err) {
      console.error("[getLogoImage] Error reading logo image:", err);
    }
    res.json({ image: null });
  });

  // API: Update custom logo image (Protected with verifyAdmin)
  app.post("/api/logo-image", verifyAdmin, (req, res) => {
    const { image } = req.body;
    if (image !== "" && (!image || typeof image !== "string")) {
      res.status(400).json({ error: "유효하지 않은 로고 이미지 데이터입니다." });
      return;
    }

    try {
      let configObj: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configObj = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      if (image === "") {
        delete configObj.logoImage;
      } else {
        configObj.logoImage = image;
      }
      fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(configObj, null, 2), "utf-8");
      res.json({ success: true, message: "로고 이미지 설정이 완료되었습니다." });
    } catch (err) {
      console.error("[updateLogoImage] Error storing logo image:", err);
      res.status(500).json({ error: "로고 이미지 저장 도중 오류가 발생했습니다." });
    }
  });

  // API: Auth / Verification (Uses secure SHA-256 validation and returns random secure bearer token)
  app.post("/api/admin/verify", (req, res) => {
    const { password } = req.body;
    if (password && verifyPassword(String(password), getAdminPassword())) {
      // Generate a brand new cryptographically secure random session token
      const secureToken = crypto.randomBytes(32).toString("hex");
      secureSessions.set(secureToken, { expiresAt: Date.now() + 7200000 }); // 2 hours expiration
      res.json({ success: true, token: secureToken });
    } else {
      res.status(401).json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }
  });

  // API: Change admin password (Protected - implements secure salted hashing)
  app.post("/api/admin/change-password", verifyAdmin, (req, res) => {
    const { newPassword } = req.body;
    if (!newPassword || typeof newPassword !== "string" || newPassword.trim().length < 4) {
      res.status(400).json({ error: "새 비밀번호는 최소 4자 이상이어야 합니다." });
      return;
    }

    try {
      let configObj: any = {};
      if (fs.existsSync(ADMIN_CONFIG_PATH)) {
        configObj = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
      }
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = hashPassword(newPassword.trim(), salt);
      configObj.adminPassword = `sha256:${salt}:${hash}`;
      fs.writeFileSync(ADMIN_CONFIG_PATH, JSON.stringify(configObj, null, 2), "utf-8");
      
      // Invalidate current sessions to force relogin
      secureSessions.clear();
      
      res.json({ success: true, message: "비밀번호가 안전하게 변경되었습니다. 다시 로그인 하십시오." });
    } catch (err) {
      console.error("[ChangePassword] Error storing new password configuration:", err);
      res.status(500).json({ error: "서버 설정 보관 도중 오류가 발생했습니다." });
    }
  });

  // API: Insert new Submission
  app.post("/api/submissions", (req, res) => {
    try {
      const body = req.body;
      if (!body.name || !body.phone) {
        res.status(400).json({ error: "이름과 연락처는 필수 입력항목입니다." });
        return;
      }

      const isSimple = !!body.isSimpleConsultation;

      if (!isSimple) {
        // 실시간 자격진단 완료 시 관리자페이지 저장 및 SMS 전송 기능 제거 (사용자 요청)
        res.status(200).json({ success: true, message: "실시간 자격진단 결과 전송 및 SMS 알림이 비활성화되었습니다." });
        return;
      }

      const list = readSubmissions();
      const newId = "sub_" + Math.random().toString(36).substr(2, 9);

      const newSubmission: Submission = {
        id: newId,
        name: sanitizeInput(body.name),
        phone: sanitizeInput(body.phone),
        occupation: isSimple ? "" : sanitizeInput(body.occupation || "regular_employee"),
        debtAmount: isSimple ? "" : sanitizeInput(body.debtAmount || "30m_50m"),
        monthlyIncome: isSimple ? undefined : sanitizeInput(body.monthlyIncome),
        dependentsCount: isSimple ? undefined : sanitizeInput(body.dependentsCount),
        hasMoreDebtThanAssets: isSimple ? "" : sanitizeInput(body.hasMoreDebtThanAssets || "yes"),
        region: isSimple ? "" : sanitizeInput(body.region || "seoul_metropolitan"),
        difficulties: Array.isArray(body.difficulties) ? body.difficulties.map((x: any) => sanitizeInput(String(x))) : [],
        ageGroup: isSimple ? "" : sanitizeInput(body.ageGroup || "30대"),
        status: "신청완료",
        counselorNotes: sanitizeInput(body.counselorNotes || ""),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isSimpleConsultation: isSimple
      };

      list.unshift(newSubmission); // prepend so newest is first
      writeSubmissions(list);

      // Send instant SMS notification to administrator securely via Solapi (non-blocking)
      let smsText = "";
      if (isSimple) {
        const typeLabel = (body.difficulties && body.difficulties[0]) ? body.difficulties[0] : "실시간간편예약";
        const notes = body.counselorNotes || "";
        
        let formattedSchedule = "즉시상담";
        if (notes.includes("즉시 상담 희망") || notes.includes("ASAP") || !notes.includes("-")) {
          formattedSchedule = "즉시상담";
        } else {
          const match = notes.match(/(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/);
          if (match) {
            const [, y, m, d, hh] = match;
            const hourInt = parseInt(hh, 10);
            const ampm = hourInt >= 12 ? "오후" : "오전";
            const displayHour = hourInt > 12 ? hourInt - 12 : (hourInt === 0 ? 12 : hourInt);
            const padHour = String(displayHour).padStart(2, '0');
            formattedSchedule = `${y}년 ${m}월 ${d}일 ${ampm} ${padHour}시`;
          }
        }

        smsText = `[실시간 상담 예약]\n상담구분: ${typeLabel}\n희망일시: ${formattedSchedule}\n연락처: ${body.phone}`;

        // Send confirmation SMS to the applicant (non-blocking)
        let kakaoChannelUrl = "http://pf.kakao.com/_xhTqgG/chat";
        try {
          if (fs.existsSync(ADMIN_CONFIG_PATH)) {
            const configData = JSON.parse(fs.readFileSync(ADMIN_CONFIG_PATH, "utf-8"));
            if (configData && configData.kakaoChannelUrl) {
              kakaoChannelUrl = configData.kakaoChannelUrl;
            }
          }
        } catch (err) {
          console.error("Error reading config for kakao link in submissions:", err);
        }

        let applicantSms = `[실시간 상담 예약 완료]\n상담구분: ${typeLabel}\n희망일시: ${formattedSchedule}\n연락처: ${body.phone}\n\n신청하신 정보로 여환동 법무사가 친절히 연락드리겠습니다.`;
        if (typeLabel.includes("카카오톡") || typeLabel.includes("카톡")) {
          applicantSms += `\n\n💬 카카오톡 바로 상담하기:\n${kakaoChannelUrl}`;
        }

        sendSolapiSms(applicantSms, body.phone).catch(err => {
          console.error("[Solapi] Failed to send background applicant confirmation SMS:", err);
        });
      } else {
        smsText = `[종합 실시간 자가진단 접수]\n의뢰인 성함: ${body.name}\n의뢰인 연락처: ${body.phone}\n상태: 신청완료 수령`;
      }

      sendSolapiSms(smsText).catch(err => {
        console.error("[Solapi] Failed to send background SMS alert to admin:", err);
      });

      res.status(201).json({ success: true, submissionId: newId });
    } catch (routeErr: any) {
      console.error("[CRITICAL] Error in POST /api/submissions handler:", routeErr);
      res.status(500).json({ error: "상담 접수를 처리하는 도중 서버 내부 오류가 발생했습니다: " + (routeErr.message || routeErr) });
    }
  });

  // API: Get List of Submissions (Protected)
  app.get("/api/submissions", verifyAdmin, (req, res) => {
    const list = readSubmissions();
    res.json(list);
  });

  // API: Update Submission Notes/Status (Protected)
  app.patch("/api/submissions/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { status, counselorNotes } = req.body;

    const list = readSubmissions();
    const index = list.findIndex(sub => sub.id === id);

    if (index === -1) {
      res.status(404).json({ error: "해당 제출물 정보를 찾을 수 없습니다." });
      return;
    }

    const updated = {
      ...list[index],
      ...(status !== undefined && { status: sanitizeInput(status) as any }),
      ...(counselorNotes !== undefined && { counselorNotes: sanitizeInput(counselorNotes) }),
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    writeSubmissions(list);

    res.json({ success: true, data: updated });
  });

  // API: Delete Submission (Protected)
  app.delete("/api/submissions/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const list = readSubmissions();
    const filtered = list.filter(sub => sub.id !== id);

    if (list.length === filtered.length) {
      res.status(404).json({ error: "해당 제출물 정보를 찾을 수 없습니다." });
      return;
    }

    writeSubmissions(filtered);
    res.json({ success: true, message: "접수 내역이 안전하게 영구 삭제되었습니다." });
  });

  // API: Bulk Delete Submissions (Protected)
  app.post("/api/submissions/bulk-delete", verifyAdmin, (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      res.status(400).json({ error: "삭제할 대상 아이디 목록이 올바르지 않습니다." });
      return;
    }

    const list = readSubmissions();
    const filtered = list.filter(sub => !ids.includes(sub.id));

    writeSubmissions(filtered);
    res.json({ success: true, message: "선택한 의뢰인 정보들이 성공적으로 영구 일괄 삭제되었습니다." });
  });

  // Helper functions for FAQs
  const readFaqs = (): FAQItem[] => {
    try {
      if (!fs.existsSync(FAQS_FILE_PATH)) return [];
      const data = fs.readFileSync(FAQS_FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading faqs database:", error);
      return [];
    }
  };

  const writeFaqs = (data: FAQItem[]) => {
    try {
      fs.writeFileSync(FAQS_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing to faqs database:", error);
    }
  };

  // API: Get List of FAQs (Public)
  app.get("/api/faqs", (req, res) => {
    const list = readFaqs();
    res.json(list);
  });

  // API: Create FAQ (Protected)
  app.post("/api/faqs", verifyAdmin, (req, res) => {
    const { question, answer } = req.body;
    if (!question || !answer) {
      res.status(400).json({ error: "질문과 답변 내용은 필수 항목입니다." });
      return;
    }

    const list = readFaqs();
    const newId = "faq_" + Math.random().toString(36).substr(2, 9);
    const newFaq: FAQItem = {
      id: newId,
      question: sanitizeInput(question),
      answer: sanitizeInput(answer)
    };

    list.push(newFaq);
    writeFaqs(list);
    res.status(201).json({ success: true, faq: newFaq });
  });

  // API: Update FAQ (Protected)
  app.patch("/api/faqs/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;

    const list = readFaqs();
    const index = list.findIndex(faq => String(faq.id) === String(id));
    if (index === -1) {
      res.status(404).json({ error: "해당 자주 묻는 질문을 찾을 수 없습니다." });
      return;
    }

    const updated: FAQItem = {
      ...list[index],
      ...(question !== undefined && { question: sanitizeInput(question) }),
      ...(answer !== undefined && { answer: sanitizeInput(answer) })
    };

    list[index] = updated;
    writeFaqs(list);
    res.json({ success: true, faq: updated });
  });

  // API: Delete FAQ (Protected)
  app.delete("/api/faqs/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const list = readFaqs();
    const filtered = list.filter(faq => String(faq.id) !== String(id));

    if (list.length === filtered.length) {
      res.status(404).json({ error: "해당 자주 묻는 질문을 찾을 수 없습니다." });
      return;
    }

    writeFaqs(filtered);
    res.json({ success: true, message: "자주 묻는 질문이 안전하게 영구 삭제되었습니다." });
  });

  // Helper functions for articles
  const readArticles = (): Article[] => {
    try {
      if (!fs.existsSync(ARTICLES_FILE_PATH)) return [];
      const data = fs.readFileSync(ARTICLES_FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading articles database:", error);
      return [];
    }
  };

  const writeArticles = (data: Article[]) => {
    try {
      fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
    } catch (error) {
      console.error("Error writing to articles database:", error);
    }
  };

  // API: Get List of Articles (Public)
  app.get("/api/articles", (req, res) => {
    const list = readArticles();
    // Only return articles that are not drafts (published or undefined status for backward compatibility)
    const publishedList = list.filter(art => art.status !== "draft");
    res.json(publishedList);
  });

  // API: Get List of All Articles including Drafts (Protected for Admin)
  app.get("/api/admin/articles", verifyAdmin, (req, res) => {
    const list = readArticles();
    res.json(list);
  });

  // API: Get Single Article (Public - and increments views)
  app.get("/api/articles/:id", (req, res) => {
    const { id } = req.params;
    const list = readArticles();
    const index = list.findIndex(art => art.id === id);
    if (index === -1) {
      res.status(404).json({ error: "해당 글을 찾을 수 없습니다." });
      return;
    }
    // Increment view count
    list[index].views = (list[index].views || 0) + 1;
    writeArticles(list);
    res.json(list[index]);
  });

  // API: Create Article (Protected)
  app.post("/api/articles", verifyAdmin, (req, res) => {
    const { category, title, age, job, originalDebt, reducedDebt, monthlyPayment, reductionRate, content, status, createdAt } = req.body;
    if (!category || !title || !content) {
      res.status(400).json({ error: "카테고리, 제목, 본문 내용은 필수 항목입니다." });
      return;
    }

    const list = readArticles();
    const newId = "art_" + Math.random().toString(36).substr(2, 9);
    const newArticle: Article = {
      id: newId,
      category: sanitizeInput(category),
      title: sanitizeInput(title),
      age: age ? sanitizeInput(age) : undefined,
      job: job ? sanitizeInput(job) : undefined,
      originalDebt: originalDebt ? sanitizeInput(originalDebt) : undefined,
      reducedDebt: reducedDebt ? sanitizeInput(reducedDebt) : undefined,
      monthlyPayment: monthlyPayment ? sanitizeInput(monthlyPayment) : undefined,
      reductionRate: reductionRate ? Number(reductionRate) : undefined,
      content: content, // HTML content containing Base64 images - DO NOT escape HTML tags to support custom blogs
      status: status ? sanitizeInput(status) : "published",
      createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0
    };

    list.unshift(newArticle);
    writeArticles(list);
    res.status(201).json({ success: true, article: newArticle });
  });

  // API: Update Article (Protected)
  app.patch("/api/articles/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { category, title, age, job, originalDebt, reducedDebt, monthlyPayment, reductionRate, content, status, createdAt } = req.body;

    const list = readArticles();
    const index = list.findIndex(art => art.id === id);
    if (index === -1) {
      res.status(404).json({ error: "해당 글을 찾을 수 없습니다." });
      return;
    }

    const updated: Article = {
      ...list[index],
      ...(category !== undefined && { category: sanitizeInput(category) }),
      ...(title !== undefined && { title: sanitizeInput(title) }),
      ...(age !== undefined && { age: sanitizeInput(age) }),
      ...(job !== undefined && { job: sanitizeInput(job) }),
      ...(originalDebt !== undefined && { originalDebt: sanitizeInput(originalDebt) }),
      ...(reducedDebt !== undefined && { reducedDebt: sanitizeInput(reducedDebt) }),
      ...(monthlyPayment !== undefined && { monthlyPayment: sanitizeInput(monthlyPayment) }),
      ...(reductionRate !== undefined && { reductionRate: Number(reductionRate) }),
      ...(content !== undefined && { content: content }),
      ...(status !== undefined && { status: sanitizeInput(status) }),
      ...(createdAt !== undefined && { createdAt: new Date(createdAt).toISOString() }),
      updatedAt: new Date().toISOString()
    };

    list[index] = updated;
    writeArticles(list);
    res.json({ success: true, article: updated });
  });

  // API: Delete Article (Protected)
  app.delete("/api/articles/:id", verifyAdmin, (req, res) => {
    const { id } = req.params;
    const list = readArticles();
    const filtered = list.filter(art => art.id !== id);

    if (list.length === filtered.length) {
      res.status(404).json({ error: "해당 글을 찾을 수 없습니다." });
      return;
    }

    writeArticles(filtered);
    res.json({ success: true, message: "성공사례/칼럼 글이 안전하게 영구 삭제되었습니다." });
  });

  // Dynamic XML Sitemap for Naver, Google, and Daum search engines
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = "https://www.law-office.co.kr";
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      
      // Core pages
      const corePages = ["", "/brand", "/bankruptcy", "/success", "/check", "/repayment-plan", "/faq"];
      corePages.forEach(p => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${p}</loc>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>${p === "" ? "1.0" : "0.8"}</priority>\n`;
        xml += `  </url>\n`;
      });
      
      // Add all success story individual articles dynamically from DB!
      if (fs.existsSync(ARTICLES_FILE_PATH)) {
        const articles: Article[] = JSON.parse(fs.readFileSync(ARTICLES_FILE_PATH, "utf-8"));
        articles.forEach(art => {
          if (art.status !== "private" && art.category !== "칼럼") {
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/success/${art.id}</loc>\n`;
            xml += `    <changefreq>weekly</changefreq>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += `  </url>\n`;
          }
        });
      }
      
      // Add all FAQs dynamically!
      if (fs.existsSync(FAQS_FILE_PATH)) {
        const faqs: FAQItem[] = JSON.parse(fs.readFileSync(FAQS_FILE_PATH, "utf-8"));
        faqs.forEach(faq => {
          xml += `  <url>\n`;
          xml += `    <loc>${baseUrl}/faq/${faq.id}</loc>\n`;
          xml += `    <changefreq>monthly</changefreq>\n`;
          xml += `    <priority>0.5</priority>\n`;
          xml += `  </url>\n`;
        });
      }
      
      xml += `</urlset>\n`;
      
      res.setHeader("Content-Type", "application/xml; charset=utf-8");
      res.send(xml);
    } catch (e) {
      console.error("[Sitemap] Error generating dynamic sitemap:", e);
      res.status(500).send("Error generating sitemap");
    }
  });

  // robots.txt rule definition
  app.get("/robots.txt", (req, res) => {
    let robots = `User-agent: *\n`;
    robots += `Allow: /\n`;
    robots += `Disallow: /admin\n`;
    robots += `Disallow: /api/\n`;
    robots += `Sitemap: https://www.law-office.co.kr/sitemap.xml\n`;
    
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(robots);
  });

  // Use Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      try {
        const indexPath = path.join(distPath, "index.html");
        if (fs.existsSync(indexPath)) {
          let html = fs.readFileSync(indexPath, "utf-8");
          const proto = req.headers["x-forwarded-proto"] || "https";
          const host = req.headers.host || "localhost";
          const originalUrl = req.originalUrl || "/";
          
          let pageTitle = "울산 개인회생 법무사 여환동 | 울산개인파산 | 울산채무탕감 신청자격 조회| 울산신용회복위원회| 새도약기금 새출발기금 채무조정";
          let pageDescription = "울산 전담 개인회생 13년 경력, 1,000건 이상 성공의 법무사 여환동 사무소입니다. 투자 실패, 보이스피싱 사기, 일용직/프리랜서 채무도 높은 탕감률로 밀착 조력합니다. 실시간으로 월 변제금과 탕감률을 직접 조회해 보세요.";
          
          // Detect specific routes and customize metadata
          if (originalUrl === "/brand") {
            pageTitle = "대표 법무사 여환동 소개 | 울산 개인회생·개인파산 법무사";
            pageDescription = "울산지방법원 14년 경력의 대표 법무사 여환동을 소개합니다. 사무장 대행 없이 모든 실무를 직접 소행하여 보정 권고를 최소화하고 높은 인가율을 보장합니다.";
          } else if (originalUrl === "/bankruptcy") {
            pageTitle = "울산 개인파산 신청자격 요건 가이드 | 법무사 여환동";
            pageDescription = "울산 개인파산 신청을 위해 필요한 3가지 핵심 신청 자격(최저생계비 미달, 면책불허가 사유 유무, 보유 재산 요건)을 14년 경력 법무사가 정밀 분석해 드립니다.";
          } else if (originalUrl === "/success") {
            pageTitle = "울산 개인회생·파산 성공사례 리포트 | 법무사 여환동";
            pageDescription = "울산지방법원에서 인가 및 면책결정을 받아낸 실제 성공 사례를 확인하세요. 직장인, 프리랜서, 자영업자의 고금리 대환 및 사행성 채무 탕감 실적을 제공합니다.";
          } else if (originalUrl.startsWith("/success/")) {
            const artId = originalUrl.substring("/success/".length);
            if (artId && fs.existsSync(ARTICLES_FILE_PATH)) {
              const articles: Article[] = JSON.parse(fs.readFileSync(ARTICLES_FILE_PATH, "utf-8"));
              const matched = articles.find(a => a.id === artId);
              if (matched) {
                pageTitle = `${matched.title} | 법무사 여환동 성공사례`;
                // Clean HTML tags from content for description
                const cleanDesc = matched.content
                  .replace(/<[^>]*>/g, " ")
                  .replace(/\s+/g, " ")
                  .trim()
                  .substring(0, 150);
                pageDescription = `${cleanDesc}... 법무사 여환동의 성공사례 분석 보고서입니다.`;
              }
            }
          } else if (originalUrl === "/check") {
            pageTitle = "개인회생 신청자격 1분 자격진단 | 법무사 여환동";
            pageDescription = "2026년 최신 소득 및 최저생계비 기준을 적용해 나의 개인회생 신청 자격 가능 여부와 예상 원금 탕감률을 1분 만에 실시간으로 진단해 드립니다.";
          } else if (originalUrl === "/repayment-plan") {
            pageTitle = "1:1 실시간 변제금 시뮬레이션 계산기 | 법무사 여환동";
            pageDescription = "소득과 재산, 부양가족 수 등을 기입해 월 예상 변제액과 총 탕감 비율을 실시간으로 산출해 주는 고성능 계산기입니다.";
          } else if (originalUrl.startsWith("/faq/")) {
            const faqId = originalUrl.substring("/faq/".length);
            if (faqId && fs.existsSync(FAQS_FILE_PATH)) {
              const faqs: FAQItem[] = JSON.parse(fs.readFileSync(FAQS_FILE_PATH, "utf-8"));
              const matched = faqs.find(f => f.id === faqId);
              if (matched) {
                pageTitle = `${matched.question} | 법무사 여환동 자주 묻는 질문`;
                pageDescription = `${matched.answer.substring(0, 150)}... 울산 개인회생 파산 법률 해결안입니다.`;
              }
            }
          }

          // Apply meta tags replacements
          html = html.replace(/<title>[^<]*<\/title>/, `<title>${pageTitle}</title>`);
          html = html.replace(
            /<meta name="description" content="[^"]*" \/>/,
            `<meta name="description" content="${pageDescription}" />`
          );
          
          // Check if custom og_image.png is in dist, public, or root
          const hasCustomOg = fs.existsSync(path.join(process.cwd(), "public", "og_image.png")) || 
                              fs.existsSync(path.join(distPath, "og_image.png")) ||
                              fs.existsSync(path.join(process.cwd(), "og_image.png"));
          
          let ogImageUrl = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&h=630&q=80";
          if (hasCustomOg) {
            ogImageUrl = `${proto}://${host}/og_image.png`;
          }

          html = html.replace(
            /<meta property="og:image" content="[^"]+" \/>/,
            `<meta property="og:image" content="${ogImageUrl}" />`
          );
          html = html.replace(
            /<meta property="og:url" content="[^"]+" \/>/,
            `<meta property="og:url" content="${proto}://${host}${req.originalUrl || '/'}" />`
          );
          html = html.replace(
            /<meta property="og:title" content="[^"]+" \/>/,
            `<meta property="og:title" content="${pageTitle}" />`
          );
          html = html.replace(
            /<meta property="og:description" content="[^"]+" \/>/,
            `<meta property="og:description" content="${pageDescription}" />`
          );

          res.setHeader("Content-Type", "text/html");
          res.send(html);
        } else {
          res.sendFile(indexPath);
        }
      } catch (e) {
        console.error("Error serving dynamic index:", e);
        res.sendFile(path.join(distPath, "index.html"));
      }
    });
  }

  // Bind to 0.0.0.0 and port 3000
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Real-time Full-Stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
