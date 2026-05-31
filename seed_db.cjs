const fs = require('fs');
const path = require('path');

const ARTICLES_FILE_PATH = path.join(__dirname, 'articles.json');

const seedArticles = [
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
    울산에 거주하는 30대 중반의 영업직 직장인 A씨는 어린 딸을 홀로 양육하는 한부모 가장이었습니다. 생활비 부담을 덜고자 시작한 주식과 코인 선물 투자가 손실로 이어졌고, 이를 메우기 위해 연 20%가 넘는 카드론과 대부업 고금리 대출에 손을 대면서 불과 1년 만에 채무가 1억 2천만 원까지 급증했습니다. 최근 발생한 대출 비중이 전체의 85%에 달해 일반적인 대리인 사무소에서는 기각 가능성이 매우 높다고 판단한 고위험 사건이었습니다.
  </p>

  <div class="my-6">
    <img src="/rehab_success_infographic.png" alt="개인회생 성공 리포트" class="w-full rounded-2xl shadow-md border border-slate-200/50" />
  </div>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2026년 2월 24일</li>
    <li><strong>금지명령 결정일:</strong> 2026년 2월 28일 (접수 후 4일 만에 독촉 차단)</li>
    <li><strong>개시결정일:</strong> 2026년 4월 12일</li>
    <li><strong>채권자집회기일:</strong> 2026년 5월 18일</li>
    <li><strong>인가결정일:</strong> 2026년 5월 20일 (신청 후 약 3개월 내 초고속 인가)</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    울산지방법원은 주식/사행성 채무 및 최근 채무 비율이 높은 사건에 대해 매우 엄격한 보정 명령을 내립니다. 본 사건의 가장 큰 걸림돌은 두 가지였습니다.<br/>
    <strong>첫째</strong>, 코인 거래소로 흘러 들어간 자금 전액을 '청산가치(본인 재산)'에 반영하라는 법원의 보정 권고가 내려질 위기였습니다. 만약 투자 손실액이 전액 재산으로 잡히면 월 변제금이 터무니없이 높아져 회생을 중도 포기해야 하는 상황이었습니다.<br/>
    <strong>둘째</strong>, 프리랜서 성격이 섞인 영업직 소득으로 월 소득이 매달 불규칙하여 소득 산정 시 법원의 의심을 받는 상황이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    저희 사무소는 14년 법원 실무 경력의 노하우를 바탕으로, 단순 실패가 아닌 배우자와의 이혼 과정에서 발생한 위자료 및 자녀 양육비 지출 내역을 세부 통장 내역 거래를 통해 1원 단위까지 분리 입증했습니다. 코인 손실금 중 실제 소비로 사라진 부분과 투자 실패로 소멸한 실질 자산을 소명 도표로 정리하여 법원이 요구하는 '최근 채무 소명 자료'를 완벽히 메웠습니다. 또한, 1인 생계비 외에 한부모 가정으로서의 '추가 생계비(자녀 치료비 및 교육비)' 필요성을 강력하게 소명하여 월 소득 대비 가용소득을 최소화하는 데 성공했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과 및 법률적 교훈</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
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
    createdAt: "2026-05-20T10:00:00.000Z",
    updatedAt: "2026-05-20T10:00:00.000Z",
    views: 142
  },
  {
    id: "art_2",
    category: "사업 실패 채무",
    title: "식자재 대리점 폐업 후 채권 추심 방어 및 양육비 전액 공제 성공 사례",
    age: "40대 중반",
    job: "식자재 유통 자영업자",
    originalDebt: "1억 6,500만 원",
    reducedDebt: "3,300만 원",
    monthlyPayment: "91만 원 (36개월)",
    reductionRate: 80,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산 북구에서 식자재 대리점을 운영하던 40대 가장 B씨는 대형 마트의 골목 상권 진입과 코로나 사태 장기화로 매출이 급락하며 가게를 정리했습니다. 매장 보증금마저 임대료 연체로 차감되었고, 물품 거래처 미수금 대환 대출 등으로 인해 1억 6천만 원이 넘는 빚을 떠안은 채 신용불량 위기에 처했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2019년 2월 11일</li>
    <li><strong>금지명령/중지명령 결정일:</strong> 2019년 2월 14일 (압류 및 추심 전격 차단)</li>
    <li><strong>개시결정일:</strong> 2019년 5월 10일</li>
    <li><strong>채권자집회기일:</strong> 2019년 6월 22일</li>
    <li><strong>인가결정일:</strong> 2019년 7월 15일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    이미 사업장 물품 및 장비에 대한 가압류 조치가 들어가 있어 조속히 중지명령을 받아내는 것이 급선무였습니다. 또한 배우자와 협의 이혼을 진행하며 자녀 2명에 대한 매달 80만 원의 양육비 지급 의무가 있어 소득 대비 생계비 공제를 확보하지 못하면 파산이 우려되었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    저희는 법원에 신속히 회생 개시 신청과 동시에 금지 및 중지명령을 신청하여 진행 중이던 장비 유치권 행사를 중단시켰습니다. 나아가 이혼 합의서 상의 양육비 판결문과 송금 약정 내역을 철저히 증명하여 일반 최저생계비 외에 추가적으로 양육비 지출액 80만 원 전부를 가용소득 산정 시 공제받도록 유도했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 6,500만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 3,300만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금의 80% 탕감</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 91만 원 (36개월 납입)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2019-02-15T09:00:00.000Z",
    updatedAt: "2019-02-15T09:00:00.000Z",
    views: 210
  },
  {
    id: "art_3",
    category: "생활비/다중채무",
    title: "제조업 건설 일용직근로자의 불규칙 소득 소명 및 75% 원금 면책 사례",
    age: "50대 초반",
    job: "제조 공장 일용직",
    originalDebt: "7,200만 원",
    reducedDebt: "1,800만 원",
    monthlyPayment: "50만 원 (36개월)",
    reductionRate: 75,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    50대 초반 C씨는 울산 삼산동 인근의 아파트 공사 현장 및 선박 블록 공장에서 일용직 근로자로 근무해 왔습니다. 불규칙한 건설 수주와 겨울철 비수기로 수개월간 소득이 끊기자 고령의 부모님 병원비와 생활비를 대부업 소액 대출로 때우며 빚이 7,200만 원까지 불어났습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2020년 4월 02일</li>
    <li><strong>금지명령 결정일:</strong> 2020년 4월 07일</li>
    <li><strong>개시결정일:</strong> 2020년 7월 18일</li>
    <li><strong>채권자집회기일:</strong> 2020년 8월 29일</li>
    <li><strong>인가결정일:</strong> 2020년 9월 10일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    일용직 특성상 고정급여 명세서가 없고 소득 변동 폭이 너무 컸습니다. 울산지방법원 재판부는 일용 소득의 불규칙성을 이유로 최근 소득 산정에 현저한 의심을 품었으며, 평균치 환산 방법을 엄격하게 요구했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    과거 1년간의 계좌 입출금 내역을 세밀하게 분해하여 현장 발주처로부터 입금된 일당 내역 전체를 엑셀 도표로 시각화해 냈습니다. 최근 3개월의 고소득 구간 대신 1년 평균 월 실질소득을 법률적으로 소명하여 월 소득 기준점을 대폭 낮추고 최저생계비를 온전히 사수하였습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 7,200만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,800만 원</li>
      <li><span class="text-emerald-700">탕감율: 75% 탕감 결정</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 50만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2020-04-10T11:00:00.000Z",
    updatedAt: "2020-04-10T11:00:00.000Z",
    views: 185
  },
  {
    id: "art_4",
    category: "사기 피해 채무",
    title: "20대 대학 졸업자 주식 투자 권유 리딩방 사기 피해 구제 사례",
    age: "20대 후반",
    job: "사무직 (사회초년생)",
    originalDebt: "4,800만 원",
    reducedDebt: "1,200만 원",
    monthlyPayment: "33만 원 (36개월)",
    reductionRate: 75,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    대학 졸업 후 겨우 중소기업 계약직으로 입사한 20대 여성 D씨는 가짜 주식투자 리딩 프로그램에 속아 2금융권 카드 대출로 투자금을 입금하는 사기 범죄 피해를 입었습니다. 사기 일당은 흔적도 없이 사라졌고, 고스란히 4,800만 원의 채무 독촉만 남게 되었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2021년 6월 05일</li>
    <li><strong>금지명령 결정일:</strong> 2021년 6월 09일</li>
    <li><strong>개시결정일:</strong> 2021년 8월 24일</li>
    <li><strong>채권자집회기일:</strong> 2021/10/05</li>
    <li><strong>인가결정일:</strong> 2021년 10월 22일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    주식 리딩 투자 사기는 법원에서 단순 '사행성 오락 투자'로 오인하기 십상입니다. 사행성 투자 실패는 탕감율이 극도로 낮아지거나 청산가치에 100% 가산되므로, 본 사건이 명백한 사기 범죄의 피해로 인한 채무임을 입증해야 했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    경찰서에 접수한 사건사고사실확인원과 리딩 사기 단톡방 캡처본, 대화 거래 내역을 첨부하여 법무사 명의의 '사기 피해 상세 진술서'를 작성했습니다. 피해자의 고의 없는 채무 증대 사유를 명백히 소명하여 사행성 오락이 아님을 인정받았습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 4,800만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,200만 원</li>
      <li><span class="text-emerald-700">탕감율: 75% 탕감 결정</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 33만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2021-06-22T14:00:00.000Z",
    updatedAt: "2021-06-22T14:00:00.000Z",
    views: 120
  },
  {
    id: "art_5",
    category: "보증 채무",
    title: "이혼 가정 주부의 전배우자 연대보증 무단 대출 독촉 해결 사례",
    age: "30대 후반",
    job: "서비스직 사원",
    originalDebt: "9,600만 원",
    reducedDebt: "1,920만 원",
    monthlyPayment: "53만 원 (36개월)",
    reductionRate: 80,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    30대 후반 여성 E씨는 이혼한 전남편이 혼인 기간 중 본인의 명의와 인감증명서를 도용해 받아둔 대부업체 연대보증 대출 독촉장에 직면했습니다. 이미 자녀 양육권만 쥔 채 생계비 벌이에 급급했던 의뢰인은 통장 압류 위기에 내몰렸습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2021년 10월 22일</li>
    <li><strong>금지명령 결정일:</strong> 2021년 10월 26일</li>
    <li><strong>개시결정일:</strong> 2021년 11월 30일</li>
    <li><strong>채권자집회기일:</strong> 2021년 12월 28일</li>
    <li><strong>인가결정일:</strong> 2022년 1월 12일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    보증채무는 채권자들의 저항과 보정 압박이 심합니다. 특히 명의도용에 대한 필적 감정과 형사 고소 절차가 수반되지 않으면 보증 책임을 그대로 져야 하는 법률적 쟁점이 있었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    형사 고소장 사본과 실제 보증 계약서 필적 대조 자료를 활용해 명의 도용 정황을 재판부에 강력 소명했습니다. 동시에 자녀 1명을 부양가족으로 올린 2인 가구 최저생계비를 철저히 고수하고 가용소득을 최소화하는 방향으로 변제계획안을 관철시켰습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 9,600만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,920만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금의 80% 탕감 인가</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 53만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2021-11-05T15:00:00.000Z",
    updatedAt: "2021-11-05T15:00:00.000Z",
    views: 145
  },
  {
    id: "art_6",
    category: "초기 생활 안정",
    title: "코로나19 학원 매출 급감으로 발생한 프리랜서 강사의 채무 극복기",
    age: "40대 초반",
    job: "수학 전문 강사",
    originalDebt: "8,500만 원",
    reducedDebt: "2,975만 원",
    monthlyPayment: "82만 원 (36개월)",
    reductionRate: 65,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산 남구 옥동 일대에서 학원 프리랜서 강사로 일하던 40대 F씨는 코로나 사태 이후 수강생이 대거 결석하고 비대면 전환이 늦어지며 소득이 100만 원 미만으로 감소했습니다. 연체 돌려막기로 월변제 의무가 꼬이며 생활 대출금 8,500만 원이 누적되었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2022년 3월 02일</li>
    <li><strong>금지명령 결정일:</strong> 2022년 3월 07일</li>
    <li><strong>개시결정일:</strong> 2022년 5월 15일</li>
    <li><strong>채권자집회기일:</strong> 2022년 6월 20일</li>
    <li><strong>인가결정일:</strong> 2022년 7월 10일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    학원 강사는 월마다 수수료 형식으로 정산금을 수령하기 때문에 원천징수 영수증이나 세금신고 내역이 완벽하지 못하여 법원 심사관이 추가 자료 보정 명령을 빈번하게 제기하는 대상이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    학원 측과의 위임 계약서, 2년치 정산 영수증 대조표를 제출하여 실질적인 세후 평잔 소득을 유도하였습니다. 울산법원 재판관에게 강사 수입 변동의 특수성을 성실히 피력하여 단 4개월 만에 인가 승인을 획득해 드렸습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 8,500만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,975만 원</li>
      <li><span class="text-emerald-700">탕감율: 65% 면책 판결</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 82만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2022-03-12T10:00:00.000Z",
    updatedAt: "2022-03-12T10:00:00.000Z",
    views: 130
  },
  {
    id: "art_7",
    category: "다중 카드 대출",
    title: "60대 고령 화물 운전기사의 영업 차량 청산가치 제외 소명 성공 사례",
    age: "60대 초반",
    job: "개인화물 운전기사",
    originalDebt: "5,800만 원",
    reducedDebt: "2,030만 원",
    monthlyPayment: "56만 원 (36개월)",
    reductionRate: 65,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    60대 G씨는 울산 울주군을 기점으로 2.5톤 개별화물 트럭을 운전해 오던 중 고장 수리비 및 차량 캐피탈 할부금 상환 지연이 겹치며 독촉에 내몰렸습니다. 빚은 5,800만 원에 달했고 생계용 트럭이 강제 압류될 위기에 처했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2020년 8월 14일</li>
    <li><strong>금지명령 결정일:</strong> 2020년 8월 18일</li>
    <li><strong>개시결정일:</strong> 2020년 11월 05일</li>
    <li><strong>채권자집회기일:</strong> 2020년 12월 14일</li>
    <li><strong>인가결정일:</strong> 2021년 1월 05일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    가장 큰 난제는 영업용 화물 트럭이 본인 재산(청산가치)으로 잡혀 매월 변제금이 터무니없이 급증하는 문제였습니다. 영업용 필수 자산을 청산가치에서 어떻게 제외시키느냐가 승패의 관건이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    해당 화물 트럭이 압류되어 매각될 경우 의뢰인의 소득 활동 자체가 완전 불가능해진다는 점을 재판부에 강력 소명하였습니다. 차량 담보 캐피탈 채무를 미압류 대상으로 분리하고, 필수 생계 도구 배제 조항을 적용받도록 유치하여 청산가치 합산액을 낮추는 법률 방어를 완수했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 5,800만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,030만 원</li>
      <li><span class="text-emerald-700">탕감율: 65% 원금 면책</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 56만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2020-08-30T13:00:00.000Z",
    updatedAt: "2020-08-30T13:00:00.000Z",
    views: 95
  },
  {
    id: "art_8",
    category: "생활비/다중채무",
    title: "30대 맞벌이 부부 적자 가계대출 및 주택 담보 대환 부담 극복 사례",
    age: "30대 후반",
    job: "중소기업 대리",
    originalDebt: "9,000만 원",
    reducedDebt: "2,700만 원",
    monthlyPayment: "75만 원 (36개월)",
    reductionRate: 70,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    맞벌이를 하며 근로 소득이 있음에도 치솟는 변동금리 이자 부담과 어린 두 자녀의 교육비/아이돌봄비 누적으로 적자 재정을 겪던 30대 부부의 사례입니다. 2금융권 신용대출 9,000만 원을 감당하기 어려운 한계에 도달했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2022년 9월 01일</li>
    <li><strong>금지명령 결정일:</strong> 2022년 9월 05일</li>
    <li><strong>개시결정일:</strong> 2022년 11월 20일</li>
    <li><strong>채권자집회기일:</strong> 2022년 12월 28일</li>
    <li><strong>인가결정일:</strong> 2023년 1월 15일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    부부 공동 소득이 잡혀 부양가족 수 산정에서 혜택을 받기 어려웠으며, 최근 금리 인상 폭에 따른 고정 비용 부담을 일반 최저생계비만으로 방어해 내기가 곤란한 기술적 난점이 있었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    부부 각자의 소득을 완전 분리 소명하고, 부부 공동 재산 중 주택 대출 담보액을 청산가치에서 안전하게 상쇄시켰습니다. 자녀 부양가족 배분을 조율하여 추가 생계비를 극대화하는 맞춤형 가용소득 최적화 설계를 제공했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 9,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,700만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금의 70% 탕감</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 75만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2022-09-18T16:00:00.000Z",
    updatedAt: "2022-09-18T16:00:00.000Z",
    views: 110
  },
  {
    id: "art_9",
    category: "사업 실패 채무",
    title: "울산 동구 조선소 하청업체 구조조정 실직자 80% 채무 탕감 사례",
    age: "50대 중반",
    job: "조선소 하청 근로자",
    originalDebt: "1억 3,000만 원",
    reducedDebt: "2,600만 원",
    monthlyPayment: "72만 원 (36개월)",
    reductionRate: 80,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    동구 조선소 구조조정 여파로 권고사직을 당한 50대 가장 H씨는 실직 기간이 길어지며 신용 카드로 생계를 때우다 다중 신용 채무 1억 3,000만 원이 누적된 상태였습니다. 겨우 경비직으로 재취업했으나 저임금으로 파산에 직면했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2023년 1월 05일</li>
    <li><strong>금지명령 결정일:</strong> 2023년 1월 09일</li>
    <li><strong>개시결정일:</strong> 2023년 3월 20일</li>
    <li><strong>채권자집회기일:</strong> 2023년 4월 28일</li>
    <li><strong>인가결정일:</strong> 2023년 5월 12일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    과거 고소득 시기의 채무 원인이 사업적 연대보증 및 실직에 근거하여 발생하였으나, 현재 재취업한 곳의 월급이 너무 낮아 법원 회생위원으로부터 고의적인 저임금 이직이 아니냐는 해명 요건이 걸림돌이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    연령 및 울산 지역 조선업 경기 하락에 따른 재취업의 한계를 객관적 수치(조선업 고용동향 및 건강보험 득실 변경 내역)로 적극 입증했습니다. 소득 대비 가용소득을 최소화하는 정당성을 구축하여 변제율을 원금의 20% 선으로 극단적으로 낮춰 드렸습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 3,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,600만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금의 80% 탕감 완료</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 72만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2023-01-25T11:00:00.000Z",
    updatedAt: "2023-01-25T11:00:00.000Z",
    views: 242
  },
  {
    id: "art_10",
    category: "사업 실패 채무",
    title: "40대 1인 헤어숍 자영업자 가공 경비 배제 및 65% 원금 면책 성공기",
    age: "40대 초반",
    job: "자영업 (헤어숍 운영)",
    originalDebt: "8,500만 원",
    reducedDebt: "2,975만 원",
    monthlyPayment: "82만 원 (36개월)",
    reductionRate: 65,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산 중구에서 1인 헤어숍을 개업했던 40대 여성 I씨는 상가 권리금 대출과 프랜차이즈 가맹료 부담에 시달리다 매달 적자를 메우기 위해 고금리 대부업 신용대출을 빌리기 시작해 8,500만 원의 부채를 지게 되었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2023년 7월 01일</li>
    <li><strong>금지명령 결정일:</strong> 2023년 7월 05일</li>
    <li><strong>개시결정일:</strong> 2023년 9월 18일</li>
    <li><strong>채권자집회기일:</strong> 2023년 10월 28일</li>
    <li><strong>인가결정일:</strong> 2023년 11월 12일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    개인자영업자는 소득 산정이 복잡하여 장부상의 가공 경비나 현금 매출 누락을 의심받기 십상입니다. 매출과 영업 지출을 투명하게 입증하지 못하면, 법원 회생위원이 임의로 소득을 대폭 높여 변제금을 무리하게 올리는 악수가 벌어집니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    포스기 매출 정산 내역과 입고 재료비 내역, 임대료 및 카드 수수료 증빙 자료를 정밀 복식 대조표로 작성했습니다. 실제 손에 쥐는 마진율을 회계적으로 명명백백히 입증하여 법원이 요구하는 성실 가용소득 기준을 지켜냈습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 8,500만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,975만 원</li>
      <li><span class="text-emerald-700">탕감율: 65% 면책 판결</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 82만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2023-07-14T10:00:00.000Z",
    updatedAt: "2023-07-14T10:00:00.000Z",
    views: 119
  },
  {
    id: "art_11",
    category: "생활비/다중채무",
    title: "20대 대학원생 다중 대부업 연체 채무 70% 면책 승인 사례",
    age: "20대 중반",
    job: "대학 연구 보조원",
    originalDebt: "3,800만 원",
    reducedDebt: "1,140만 원",
    monthlyPayment: "31만 원 (36개월)",
    reductionRate: 70,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    연구원 학자금 대환 부족액과 주거 임차 비용 마련을 위해 2금융권 카드론 및 소액 대부업 다중 채무 3,800만 원을 연체하게 된 생활고 사건입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2024년 2월 10일</li>
    <li><strong>금지명령 결정일:</strong> 2024년 2월 14일</li>
    <li><strong>개시결정일:</strong> 2024년 4월 02일</li>
    <li><strong>채권자집회기일:</strong> 2024년 5월 10일</li>
    <li><strong>인가결정일:</strong> 2024년 5월 28일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    의뢰인은 정규 직장인이 아닌 연구 보조 수당 수령자로서 계속적·반복적 소득 요건을 법원에 성실히 소명해야 하는 신분상의 법률적 약점이 있었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    대학 산학협력단에서 정기 발행하는 연구원 급여 명세 및 계좌 입금증을 성실히 바인딩하고, 졸업 후 연구 연장이 가능함을 소명하여 계속적 소득 창출 의사를 입증해 내어 법원 인가를 완료시켰습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 3,800만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,140만 원</li>
      <li><span class="text-emerald-700">탕감율: 70% 탕감 승인</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 31만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2024-02-28T09:00:00.000Z",
    updatedAt: "2024-02-28T09:00:00.000Z",
    views: 88
  },
  {
    id: "art_12",
    category: "코인/투자 채무",
    title: "30대 대기업 생산직 도박 채무 반성 소명 및 70% 탕감 인가 사례",
    age: "30대 중반",
    job: "대기업 공장 근로자",
    originalDebt: "1억 500만 원",
    reducedDebt: "3,150만 원",
    monthlyPayment: "87만 원 (36개월)",
    reductionRate: 70,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    안정적인 대기업 공장에 재직 중임에도 일시적 인터넷 배팅으로 카드 다중 대환 대출 및 대부업체 고액 연쇄 대출이 1억 500만 원까지 번져 기각 위기에 처했던 근로자의 사건 분석입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2024년 9월 12일</li>
    <li><strong>금지명령 결정일:</strong> 2024년 9월 18일</li>
    <li><strong>개시결정일:</strong> 2024년 11월 05일</li>
    <li><strong>채권자집회기일:</strong> 2024년 12월 14일</li>
    <li><strong>인가결정일:</strong> 2025년 1월 05일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    울산법원은 불법 도박이나 무리한 사행성 배팅 채무에 대해 극도로 보수적이며 기각 명령을 자주 내립니다. 신청 이후 채무 전액을 청산가치에 과대 산입시키거나 변제율을 90% 이상으로 극단적으로 올리라는 압박이 존재했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    단순 탕감 호소 대신, 의뢰인의 도박 중독 치료 확인서, 중독 예방 센터 상담 내역, 그리고 매달 작성한 자필 반성 소명서를 지속 제출했습니다. 대기업 급여 특성상 변제 여력이 충분함을 입증하되, 향후 성실 납부 의지를 강력히 내비쳐 원금 70% 탕감율을 극적으로 확정시켰습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 500만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 3,150만 원</li>
      <li><span class="text-emerald-700">탕감율: 70% 원금 면책 성공</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 87만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2024-10-05T10:00:00.000Z",
    updatedAt: "2024-10-05T10:00:00.000Z",
    views: 180
  },
  {
    id: "art_13",
    category: "생활비/병원비",
    title: "50대 사별 후 만성 투병 병원비 누적 카드 채무 75% 대폭 감면 사례",
    age: "50대 후반",
    job: "요식업 매장 파트타이머",
    originalDebt: "5,400만 원",
    reducedDebt: "1,350만 원",
    monthlyPayment: "37만 원 (36개월)",
    reductionRate: 75,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    남편과 사별 후 식당 아르바이트로 홀로 생계를 이어가던 50대 여성 L씨는 만성 척추 협착증 투병으로 비급여 수술비와 주사 비용을 카드로 돌려막으며 5,400만 원까지 이자가 쌓인 생계 파탄 사건입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2023년 10월 20일</li>
    <li><strong>금지명령 결정일:</strong> 2023년 10월 24일</li>
    <li><strong>개시결정일:</strong> 2023년 11월 20일</li>
    <li><strong>채권자집회기일:</strong> 2023년 12월 28일</li>
    <li><strong>인가결정일:</strong> 2024년 1월 12일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    의뢰인의 월 소득이 140만 원에 불과해 1인 최저생계비(약 120만 원)를 제외하면 월 변제 가능 액수가 너무 낮았습니다. 법원은 추가 병원비 영수증을 성실히 소명하지 않으면 생계 여건 부적합을 이유로 기각을 검토했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    지속적인 치료가 필수적임을 입증하기 위해 의사 소견서와 향후 약제비 추정 자료를 첨부해 추가 생계비(월 30만 원)를 강력 신청했습니다. 가용소득을 월 37만 원으로 조율하는 데 합의하여 75% 대폭 감면 승인을 따냈습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 5,400만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,350만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금의 75% 탕감</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 37만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2023-11-20T09:00:00.000Z",
    updatedAt: "2023-11-20T09:00:00.000Z",
    views: 112
  },
  {
    id: "art_14",
    category: "생활비/다중채무",
    title: "40대 프리랜서 배달 라이더 유류비 경비 공제 및 원금 70% 탕감 성공기",
    age: "40대 초반",
    job: "배달 라이더 (플랫폼 근로자)",
    originalDebt: "6,000만 원",
    reducedDebt: "1,800만 원",
    monthlyPayment: "50만 원 (36개월)",
    reductionRate: 70,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    40대 오토바이 배달대행 플랫폼 라이더 M씨는 배달 중 교통사고를 입어 오토바이 수리 비용과 치료비를 메우고자 다중 고금리 카드대출 6,000만 원을 받아 감당 불능 상태가 된 실무 사건입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2025년 3월 02일</li>
    <li><strong>금지명령 결정일:</strong> 2025년 3월 06일</li>
    <li><strong>개시결정일:</strong> 2025년 5월 12일</li>
    <li><strong>채권자집회기일:</strong> 2025년 6월 20일</li>
    <li><strong>인가결정일:</strong> 2025년 7월 05일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    배달 플랫폼 소득은 국세청에 잡히는 세전 정산액 기준이라 유류비, 오토바이 리스료, 식비 등 실질 영업 경비가 공제되지 않아 매달 가용소득이 터무니없이 과다 계상되는 법원 보정의 맹점이 존재했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    플랫폼 정산 엑셀 보고서와 오토바이 리스 명세서, 주유 내역 카드 거래 내역 전체를 취합하여 실제 필요 경비 비율 35%를 산정하고 법무사 보정서로 반박 제출했습니다. 실질 세후 소득을 160만 원대로 현실화하여 원금의 70% 면책 승인을 완료했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 6,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,800만 원</li>
      <li><span class="text-emerald-700">탕감율: 70% 원금 면책 성공</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 50만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2025-03-15T11:00:00.000Z",
    updatedAt: "2025-03-15T11:00:00.000Z",
    views: 165
  },
  {
    id: "art_15",
    category: "사업 실패 채무",
    title: "30대 요식업 프랜차이즈 가맹점주 폐업 상가보증금 청산가치 상쇄 성공기",
    age: "30대 중반",
    job: "자영업자 (치킨전문점)",
    originalDebt: "1억 4,000만 원",
    reducedDebt: "3,500만 원",
    monthlyPayment: "97만 원 (36개월)",
    reductionRate: 75,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산 울주군에서 치킨 가맹점을 운영하다 임대료 연체와 함께 원자재 대금 1억 4,000만 원의 다중 연체가 누적된 극심한 고통의 사건이었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2022년 11월 02일</li>
    <li><strong>금지명령 결정일:</strong> 2022년 11월 06일</li>
    <li><strong>개시결정일:</strong> 2022년 12월 24일</li>
    <li><strong>채권자집회기일:</strong> 2023년 2월 10일</li>
    <li><strong>인가결정일:</strong> 2023년 2월 28일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    남은 상가 보증금 3,000만 원이 전액 청산가치로 산입되어 법원에서 그만큼을 갚으라는 보정 요구가 핵심 쟁점이었습니다. 권리금은 전무한 상태였지만 보증금이 재산으로 반영되면 생계 유지가 불가능했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    임대인의 월세 연체 차감 확약서를 신속히 발부받아 잔존 보증금 실질 가치가 500만 원 미만으로 하락했음을 서류로 명확히 입증했습니다. 보증금 청산가치 산정을 완벽히 배제시켜 75%의 높은 탕감율로 인가 판결을 성사시켰습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 4,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 3,500만 원</li>
      <li><span class="text-emerald-700">탕감율: 75% 원금 면책 성공</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 97만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2022-12-05T10:00:00.000Z",
    updatedAt: "2022-12-05T10:00:00.000Z",
    views: 140
  },
  {
    id: "art_16",
    category: "생활비/다중채무",
    title: "20대 1인 유튜브 크리에이터 MCN 정산 소득 3년 평균치 환산 방어 성공 사례",
    age: "20대 후반",
    job: "1인 크리에이터 (프리랜서)",
    originalDebt: "5,200만 원",
    reducedDebt: "1,820만 원",
    monthlyPayment: "50만 원 (36개월)",
    reductionRate: 65,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    최근 유튜브 채널 조회수가 급락하면서 정산금 수익이 거의 소멸한 20대 크리에이터 O씨의 사례입니다. 과거 높은 수익 시절의 장비 구매 리스료와 신용카드 5,200만 원이 연체 위기에 빠진 쟁점이 복잡한 경우였습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2025년 8월 10일</li>
    <li><strong>금지명령 결정일:</strong> 2025년 8월 14일</li>
    <li><strong>개시결정일:</strong> 2025년 10월 22일</li>
    <li><strong>채권자집회기일:</strong> 2025년 11월 28일</li>
    <li><strong>인가결정일:</strong> 2025년 12월 10일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    유튜브 애드센스 정산금은 계절성 및 조회수에 따라 0원에서 수천만 원까지 변동폭이 극심합니다. 법원 재판부는 최근 잘 나오던 달의 고소득을 기준으로 변제율을 올리라는 무리한 보정을 권고했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    최근 3년치의 구글 및 MCN 플랫폼 정산 통계 원장을 취합하여, 정산 소득의 하강 주기를 과학적으로 입증했습니다. 일시적 고소득 대신 3개년 연 평균 소득 환산법을 제시하는 법무사 소명 논리로 65%의 최종 탕감률 승인을 관철했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 5,200만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 1,820만 원</li>
      <li><span class="text-emerald-700">탕감율: 원금 65% 면책 판결</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 50만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2025-08-22T10:00:00.000Z",
    updatedAt: "2025-08-22T10:00:00.000Z",
    views: 105
  },
  {
    id: "art_17",
    category: "사업 실패 채무",
    title: "50대 건설 하도급 업자의 공사대금 미수금 부채 전이 극복 및 인가 사례",
    age: "50대 초반",
    job: "건설 하도급 사업자",
    originalDebt: "1억 8,000만 원",
    reducedDebt: "5,400만 원",
    monthlyPayment: "150만 원 (36개월)",
    reductionRate: 70,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울주군에서 영세 토목 건설 하청업을 하던 50대 P씨는 원청 업체의 연쇄 부도로 대금 2억 원을 받지 못하자, 자재 납품처와 현장 근로자 임금 체불을 막기 위해 가계 신용대출을 끌어쓰며 1억 8,000만 원의 부채를 안게 된 부도성 채무 사건입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2019년 10월 05일</li>
    <li><strong>금지명령 결정일:</strong> 2019년 10월 09일</li>
    <li><strong>개시결정일:</strong> 2019년 11월 20일</li>
    <li><strong>채권자집회기일:</strong> 2019년 12월 28일</li>
    <li><strong>인가결정일:</strong> 2020년 1월 15일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    현장 자재처 채권자가 많아 신청서 접수 시 채권자 목록 누락 우려가 컸으며, 누락된 채무는 인가 결정 후에도 면책되지 않는 심각한 법적 리스크가 동반되었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    신용조회 외에 미결제 거래 원장 전체를 전수 추적하여 미등록 사채 채권까지 채권자 목록에 확실하게 편입시켰습니다. 원청 부도사실증명원과 부실 공사 채권 확인서를 법원에 소명 자료로 첨부하여 70% 감면 승인을 무사히 완료시켰습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 1억 8,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 5,400만 원</li>
      <li><span class="text-emerald-700">탕감율: 70% 탕감 인가 완료</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 150만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2019-10-18T10:00:00.000Z",
    updatedAt: "2019-10-18T10:00:00.000Z",
    views: 180
  },
  {
    id: "art_18",
    category: "사기 피해 채무",
    title: "40대 보육교사 명의대여 대출 피싱 사기 연체 방어 성공기",
    age: "40대 초반",
    job: "어린이집 보육교사",
    originalDebt: "6,000만 원",
    reducedDebt: "2,100만 원",
    monthlyPayment: "58만 원 (36개월)",
    reductionRate: 65,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    어린이집 보육교사로 일하는 40대 Q씨는 저금리 대환 대출을 유도하는 보이스피싱 명의대여 사기에 연루되어, 본인 모르게 실행된 모바일 비대면 대출 6,000만 원이 즉시 이체되어 연체 위기에 빠진 안타까운 소송 사건입니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2024년 5월 20일</li>
    <li><strong>금지명령 결정일:</strong> 2024년 5월 24일</li>
    <li><strong>개시결정일:</strong> 2024년 7월 18일</li>
    <li><strong>채권자집회기일:</strong> 2024년 8월 29일</li>
    <li><strong>인가결정일:</strong> 2024년 9월 10일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    비대면 대출은 신청인의 모바일 기기로 실행되어 본인이 빌린 것이나 마찬가지로 취급되므로, 고의로 빌려 은닉했다는 채권 은행의 강력한 이의신청 및 고의 기각 공세가 가장 험난한 고비였습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    피해 직후 경찰서에 즉각 신고한 수사 정보 제공 내역서와 범죄 계좌 거래 정지 사실 확인원을 제출했습니다. 피싱 범죄자가 송금받아 취득한 내역을 금융 기록으로 완벽 증명함으로써 채무자의 무죄성을 법원으로부터 소명 인정받았습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 6,000만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,100만 원</li>
      <li><span class="text-emerald-700">탕감율: 65% 원금 면책 성공</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 58만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2024-06-11T12:00:00.000Z",
    updatedAt: "2024-06-11T12:00:00.000Z",
    views: 119
  },
  {
    id: "art_19",
    category: "생활비/다중채무",
    title: "30대 대기업 공장 생산직 특근수당 제외 및 72% 원금 면책 인가 성공 사례",
    age: "30대 초반",
    job: "제조 공장 생산직원",
    originalDebt: "7,800만 원",
    reducedDebt: "2,184만 원",
    monthlyPayment: "60만 원 (36개월)",
    reductionRate: 72,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    울산 중공업 및 자동차 생산 공장에서 특교 교대근무로 일하던 30대 근로자 R씨는 잦은 야근 수당 축소와 잔업 중단으로 실수령액이 절반가량 급감하자 가계 생활비 7,800만 원의 다중 채무가 덮쳐 회생을 의뢰했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2021년 7월 12일</li>
    <li><strong>금지명령 결정일:</strong> 2021년 7월 16일</li>
    <li><strong>개시결정일:</strong> 2021년 9월 10일</li>
    <li><strong>채권자집회기일:</strong> 2021년 10월 22일</li>
    <li><strong>인가결정일:</strong> 2021년 11월 05일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    법원은 대기업 생산직의 경우 기본급 외에 불규칙한 특근 수당과 잔업 수당 전액을 월 고정 소득에 가산하라는 보정 권고를 내립니다. 이를 그대로 받아들이면 이자 변제금이 엄청나게 상승하게 됩니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    근무 회사의 경영 악화 통지서 및 연도별 잔업 특근 수량 추이 분석서를 법원에 제출했습니다. 향후 수당 소득이 비정기적이며 고정 수령이 불가능하다는 합리적 증명을 전개하여, 특근수당을 과세 소득 합계에서 성공적으로 도려내고 72% 감면율로 승인을 이끌어 냈습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 7,800만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 2,184만 원</li>
      <li><span class="text-emerald-700">탕감율: 72% 원금 면책 성공</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 60만 원 (36개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2021-08-14T10:00:00.000Z",
    updatedAt: "2021-08-14T10:00:00.000Z",
    views: 125
  },
  {
    id: "art_20",
    category: "생활비/병원비",
    title: "50대 암 투병 환자의 기초생활수급 전환 전 신속 면책 90% 승인 사례",
    age: "50대 초반",
    job: "단순 가사 노동자",
    originalDebt: "4,600만 원",
    reducedDebt: "460만 원",
    monthlyPayment: "12만 원 (38개월)",
    reductionRate: 90,
    content: `<div class="space-y-6 text-slate-700 font-semibold leading-loose text-xs sm:text-[14.5px] text-left">
  <div class="bg-amber-500/[0.06] text-amber-900 px-4 py-3 rounded-2xl border border-amber-500/20 font-black mb-4">
    <span>💡 법무사 여환동의 정밀 사건 분석 보고서</span>
  </div>
  
  <p class="font-bold text-slate-800 leading-relaxed text-sm sm:text-[15px] border-b border-dashed border-slate-200 pb-4">
    만성 위암 3기 진단을 받고 근로 능력이 완전 소멸될 위기에 빠졌던 50대 여성 S씨의 사건 리포트입니다. 수년 전 얻은 생활 가계 카드 빚 4,600만 원에 직면하여 매달 극심한 독촉장 수령으로 건강 악화를 겪고 있었습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">1. 법원의 주요 타임라인</h3>
  <ul class="list-disc list-inside space-y-1 text-xs sm:text-[13.5px] text-slate-600 pl-1 mb-4">
    <li><strong>신청일:</strong> 2026년 2월 02일</li>
    <li><strong>금지명령 결정일:</strong> 2026년 2월 06일</li>
    <li><strong>개시결정일:</strong> 2026년 3월 10일</li>
    <li><strong>채권자집회기일:</strong> 2026년 4월 22일</li>
    <li><strong>인가결정일:</strong> 2026년 5월 10일</li>
  </ul>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">2. 법무사의 시선에서 본 핵심 쟁점 (난제)</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    투병으로 인해 근로 활동이 거의 불가능하여 가용소득을 사실상 낼 수 없는 상태였습니다. 이 경우 법무사를 통해 생계 유지 곤란에 대한 엄격한 소명이 없으면 회생 신청 자체가 기각되어 파산으로 넘어가야 하는 복잡한 재정적 과도기였습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">3. 여환동 법무사의 전략</h3>
  <p class="leading-relaxed pl-1 text-slate-650">
    중증 질환자 증명서 및 병원 정밀 진단 진료 차트를 토대로 임시 근로 여력 최하 등급을 받아 냈습니다. 곧 기초생활수급자로 편입될 가능성을 증명하여, 법원이 인정할 수 있는 최저 수준의 성실 변제금인 월 12만 원의 특별 승인을 유치하는 데 성공했습니다.
  </p>

  <h3 class="text-sm sm:text-base font-black text-slate-900 border-l-4 border-amber-600 pl-2 pt-2">4. 인가 결과</h3>
  <div class="bg-slate-50 p-4 rounded-xl border border-slate-200/60 my-2 space-y-2">
    <ul class="list-disc list-inside space-y-1.5 font-bold text-slate-800 text-xs sm:text-[13.5px]">
      <li><span class="text-slate-400 font-medium">총 채무액:</span> 4,600만 원</li>
      <li><span class="text-slate-400 font-medium">조정 후 총변제액:</span> 460만 원</li>
      <li><span class="text-emerald-700">탕감율: 90% 원금 면책 승인 완료</span></li>
      <li><span class="text-slate-400 font-medium">월 변제금:</span> 12만 원 (38개월)</li>
    </ul>
  </div>
</div>`,
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-02-10T10:00:00.000Z",
    views: 139
  }
];

fs.writeFileSync(ARTICLES_FILE_PATH, JSON.stringify(seedArticles, null, 2), 'utf-8');
console.log('Database successfully seeded with 20 premium legal reports!');
