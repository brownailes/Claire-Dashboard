/* ============================================
   JARVIS-Yooha — Data Layer
   localStorage-based CRUD with JSON export/import
   ============================================ */

const JarvisData = (() => {
  const STORAGE_KEY = 'jarvis_yooha_data';
  const VERSION = '1.0.0';

  // Default data structure
  const DEFAULT_DATA = {
    version: VERSION,
    profile: {
      name: '엄유하',
      birthDate: '2013-12-10',
      address: '서울특별시 강남구 광평로31길 27 (수서삼성아파트)',
      elementarySchool: '서울대모초등학교',
      currentGrade: '중1',
      targetUniversity: '서울대학교',
      targetDepartment: '수의과대학',
      targetYear: 2032,
      ddayDate: '2031-09-10', // Approximate 수시 원서 마감
      cefrLevel: 'C2 (원어민 수준)',
      lexile: '1400L+ (해외 저널 강독 가능)'
    },
    exams: [],
    schedules: [
      { id: 's1', name: '생각하는 수학', dayOfWeek: '월', startTime: '17:00', endTime: '22:00', type: 'academy' },
      { id: 's2', name: '생각하는 수학', dayOfWeek: '금', startTime: '17:00', endTime: '22:00', type: 'academy' }
    ],
    feedbacks: [],
    academies: [
      { id: 'a1', name: '생각하는 수학', subject: '수학', cost: 0, memo: '월, 금 17:00-22:00' }
    ],
    strategies: [
      {
        id: 'st-2028-reform',
        title: '2028 대학입시제도 개편 및 수의대 입시 전략',
        category: 'analysis',
        createdAt: new Date().toISOString(),
        content: `**[1. 2028학년도 대학입시제도 개편 핵심]**
• 고교 내신 5등급제: 절대평가와 상대평가 병기 (단, 사회/과학 융합선택 9과목은 절대평가만 실시)
• 수능 통합형 체제 전환: 국어/수학 공통과목 전환, 탐구는 전체 '통합사회+통합과학' 응시 (심화수학 최종 제외)

**[2. 개편에 따른 수의대 입시 전략]**
① 전략적 심화 과목 선택 & 세특 관리: 수능 범위 밖이더라도 미적분, 생명과학Ⅱ, 화학Ⅱ 등 핵심 권장과목을 반드시 이수해 전공 역량 증명 필요
② 수능 최저학력기준 대비: 내신/수능 변별력 하락으로 최상위권 동점자 속출 예상, 의약학계열 수능 최저 강화 대비 필수
③ 다중미니면접(MMI) 집중 훈련: 서울대 정시 수의학 적성·인성면접 20점 신규 도입 등 서류/수능의 한계를 면접으로 가려냄
④ 정시에서도 학교생활 유지: 서울대 정시는 [수능 60 + 교과역량 40]으로 선발하므로 끝까지 학생부 관리가 필요함`
      },
      {
        id: 'st-eng-vet',
        title: '원어민급 영어 실력의 합법적 생기부 활용 전략',
        category: 'general',
        createdAt: new Date().toISOString(),
        content: `**[생기부 내 공신력 확보 3대 전략]**
외부 공인어학성적(토플/토익/텝스 등) 기재는 0점 처리 사유이므로, 전공적합성과 연계한 '과정 중심 세특'으로 우회하여 승부합니다.

**① 진로선택 과목(고급 영어, 영미문학 등) 세특 활용**
• 해외 수의학/바이러스학 SCI급 논문과 네이처(Nature) 등 과학 학술지를 번역본 없이 직독직해하고 심층 분석함.
• "최신 영문 수의학 논문을 강독하여 깊이 있는 지식을 학급에 공유함" 등을 통해 자기주도적 학력의 한계가 없음을 증명.

**② 동아리 및 창의적 체험 활동 (창체/자율) 연계**
• 복잡한 동물행동학, 뇌과학 관련 TED 최신 강연 스크립트를 원문 뉘앙스까지 분석하여 영어 시각화 자료로 제작/재능기부.
• 수의학 글로벌 이슈 리서치 및 영자 칼럼 작성 등 동아리 특화 활동.

**③ 다중미니면접(MMI) 역량 극대화**
• 해외 최신 저널과 윤리 강령을 빠르게 이해하는 독해력(Lexile 1400+)을 십분 발휘하여, 수의사가 마주하는 글로벌 딜레마 상황과 최신 과학 이슈에 대한 배경지식을 폭넓고 깊게 흡수하여 면접 점수 격차 확보.`
      }
    ],
    milestones: getDefaultMilestones(),
    portfolio: [
      {
        id: 'pf-snu-lesec-2026',
        category: 'other',
        title: '서울대 생물학실험시설(LESEC) 중학생 실험 프로그램 수료',
        period: '2026.02.02 ~ 2026.02.03',
        role: '실험 참여자',
        description: '서울대학교 관악캠퍼스에서 진행된 생명과학 실험 집중 프로그램 이수.\n1. 중등 M1. 미생물 배양 및 관찰\n2. 중등 M2. CSI 속 과학이야기\n3. 중등 M3. Blood 관찰 및 DNA 추출\n4. 중등 M4. Soil Science Project\n\n중학교 수준을 넘어서는 전문적인 미생물학 및 유전학(DNA 추출) 실험을 직접 수행하며, 수의학 전공의 토대가 되는 생명과학 탐구 역량을 증명함.',
        evaluationMapping: '학업능력',
        importance: 'high',
        createdAt: '2026-04-20T01:00:00.000Z'
      }
    ],
    programs: [
      {
        id: 'prg-snu-lesec-2026',
        name: '서울대 생명과학 중학생 프로그램 (LESEC)',
        organizer: '서울대학교 생명과학부 생물학실험시설',
        targetGrade: '중학생',
        applicationDeadline: '2026-01-31',
        period: '2026.02.02 ~ 2026.02.03',
        status: 'completed',
        description: '미생물/DNA/토양과학 등 4개 전문 실험 모듈 집중 이수 프로그램',
        requirements: '선발 프로그램',
        tags: ['서울대', '생명과학', '실험'],
        url: 'https://lesec.snu.ac.kr/program/middle_semester/apply-individual',
        memo: 'DNA 추출 및 미생물 배양 실험 수료. 과학 심화 탐구 세특에 매우 적합한 소재.'
      },
      {
        id: 'prg-snu-gosuah-2029',
        name: '서울대 고교생 수의학 아카데미 (고수아)',
        organizer: '서울대학교 수의과대학',
        targetGrade: '고1~고2',
        applicationDeadline: '2029-07-01',
        period: '2029.08 여름방학 (1박 2일 일정)',
        status: 'scheduled',
        description: '서울대 수의과대학 교수진의 특강, 실험실 체험, 멘토링으로 구성된 고교생 대상 프로그램. 매년 여름 8월경 개최, 1차와 2차로 나뉘어 진행. 서류 심사 및 선착순 선발.',
        requirements: '고1~고2 재학생, 온라인 신청서 및 지원동기 작성 필수',
        tags: ['서울대', '수의학', '캠프'],
        url: 'https://vet.snu.ac.kr/category/board-3-BL-8Piv9u51-20211029154329/',
        memo: '고1 때부터 신청 가능. 중학교 탐구 활동 사례를 지원동기에 충분히 담아두는 것이 가장 중요. 6월경부터 공식 홈페이지 상시 체크.'
      },
      {
        id: 'prg-gov-vet-experience',
        name: '수의사 직업 체험 프로그램 (농림축산식품부)',
        organizer: '농림축산식품부 / 지자체 동물진료소',
        targetGrade: '중학생~고등학생',
        applicationDeadline: '',
        period: '매년 방학기 (단기 체험)',
        status: 'scheduled',
        description: '정부 주관 수의사 직업 체험 프로그램. 동물병원 실습, 필드 체험 등 포함. 생기부 종합 의진란 자율활동 소재로 활용 가능.',
        requirements: '매 회차 구체적인 지원 자격 확인 필요',
        tags: ['수의학', '정부지원', '연구체험'],
        url: '',
        memo: '농림축산식품부 및 지자체 수의과 연동 프로그램을 수시로 확인할 것. 생기부 종합 기록란에 자율활동 소재로 사용.'
      }
    ],

    settings: {
      theme: 'dark',
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  };

  function getDefaultMilestones() {
    return [
      {
        id: 'm1',
        grade: '중1',
        period: '2026.3 ~ 2027.2',
        title: '학습 기반 다지기',
        description: '자기주도적 학습 습관 형성, 진로 탐색, 기초 학력 향상',
        checklist: [
          { text: '자기주도 학습 계획표 작성 및 실천', done: false },
          { text: '수의학 관련 도서 3권 이상 독서', done: false },
          { text: '수학/과학 기본 개념 완벽 이해', done: false },
          { text: '영어 독해 기초 다지기', done: false },
          { text: '진로 탐색 활동 (동물병원 견학 등)', done: false },
        ],
        status: 'current',
      },
      {
        id: 'm2',
        grade: '중2',
        period: '2027.3 ~ 2028.2',
        title: '심화 학습 & 진로 구체화',
        description: '수학/과학 심화, 구체적 진로 목표 설정, 독서 확장',
        checklist: [
          { text: '수학 심화 문제 풀이 훈련', done: false },
          { text: '과학(생명과학/화학) 심화 학습', done: false },
          { text: '과학 동아리 또는 탐구 활동 참여', done: false },
          { text: '수의학 전문 서적/논문 읽기 시작', done: false },
          { text: '영어 원서 읽기 도전', done: false },
        ],
        status: 'upcoming',
      },
      {
        id: 'm3',
        grade: '중3',
        period: '2028.3 ~ 2029.2',
        title: '고교 진학 준비',
        description: '고등학교 선택 결정, 수학 선행, 내신 완벽 관리',
        checklist: [
          { text: '고등학교 유형 분석 및 최종 선택', done: false },
          { text: '고등 수학 기초 예습', done: false },
          { text: '중학교 내신 최상위권 유지', done: false },
          { text: '고교 입학 후 과목 선택 전략 수립', done: false },
          { text: '비교과 활동 계획 초안 작성', done: false },
        ],
        status: 'upcoming',
      },
      {
        id: 'm4',
        grade: '고1',
        period: '2029.3 ~ 2030.2',
        title: '전략적 과목 선택 & 내신 확보',
        description: '전공 연계 과목 선택, 비교과 활동 본격 시작, 내신 1등급대 목표',
        checklist: [
          { text: '서울대 고교생 수의학 아카데미(고수아) 신청 (여름방학)', done: false },
          { text: '서울대 수의대 권장 과목 이수 계획', done: false },
          { text: '내신 1등급대 진입 및 세특 전략 수립', done: false },
          { text: '과학 탐구 동아리 활동', done: false },
          { text: '봉사 활동 시작 (동물보호 관련)', done: false },
        ],
        status: 'upcoming',
      },
      {
        id: 'm5',
        grade: '고2',
        period: '2030.3 ~ 2031.2',
        title: '세특 심화 & 수능 대비 시작',
        description: '생명과학Ⅱ/화학Ⅱ 이수, 세특 심화 활동, 수능 대비 본격 시작',
        checklist: [
          { text: '서울대 수의학 아카데미(고수아) 2차 지원 (심화 수료)', done: false },
          { text: '생명과학Ⅱ 이수 (핵심 권장과목)', done: false },
          { text: '화학Ⅱ 이수', done: false },
          { text: '심화 탐구 보고서 작성 (영어 논문 강독 연계)', done: false },
          { text: '모의고사 국/수/영/탐 1등급 목표', done: false },
        ],
        status: 'upcoming',
      },
      {
        id: 'm6',
        grade: '고3',
        period: '2031.3 ~ 2031.11',
        title: '최종 입시 돌입',
        description: '수시 원서 접수, 면접 준비, 수능 최종 대비',
        checklist: [
          { text: '수시 원서 전략 수립 (일반vs지균)', done: false },
          { text: '서울대 수시 원서 접수', done: false },
          { text: '면접 대비 (제시문 기반)', done: false },
          { text: '수능 최종 대비', done: false },
          { text: '정시 원서 전략 (백업)', done: false },
        ],
        status: 'upcoming',
      },
    ];
  }

  // ---- Core functions ----
  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return initData();
      const data = JSON.parse(raw);
      
      // Deep merge for profile
      data.profile = { ...DEFAULT_DATA.profile, ...(data.profile || {}) };

      // Migration: Remove englishName, update targetDepartment
      if (data.profile) {
        delete data.profile.englishName;
        if (data.profile.targetDepartment === '수의과대학 (수의예과)') {
          data.profile.targetDepartment = '수의과대학';
        }
      }

      // Migration: forcefully remove the bugged zombie item 'p-eng-vet-1'
      if (data.portfolio) {
        data.portfolio = data.portfolio.filter(p => p.id !== 'p-eng-vet-1');
      }
      
      // Migrations: Merge defaults by ID to auto-inject new prepopulated items
      if (!data.schedules) data.schedules = [];
      if (!data.academies) data.academies = [];
      if (!data.strategies) data.strategies = [];
      if (!data.portfolio) data.portfolio = [];

      DEFAULT_DATA.schedules.forEach(d => { if (!data.schedules.find(x => x.id === d.id)) data.schedules.push(d); });
      DEFAULT_DATA.academies.forEach(d => { if (!data.academies.find(x => x.id === d.id)) data.academies.push(d); });
      DEFAULT_DATA.strategies.forEach(d => { if (!data.strategies.find(x => x.id === d.id)) data.strategies.push(d); });
      DEFAULT_DATA.portfolio.forEach(d => { if (!data.portfolio.find(x => x.id === d.id)) data.portfolio.push(d); });

      if (!data.feedbacks) data.feedbacks = [];
      
      if (!data.programs) data.programs = [];
      DEFAULT_DATA.programs.forEach(d => { if (!data.programs.find(x => x.id === d.id)) data.programs.push(d); });

      
      // Auto-update milestone checklists for m4 and m5
      if (data.milestones) {
        const defMilestones = getDefaultMilestones();
        ['m4', 'm5'].forEach(mid => {
          const mData = data.milestones.find(m => m.id === mid);
          const mDef = defMilestones.find(m => m.id === mid);
          if (mData && mDef) {
            // Keep user's 'done' state if text matches, otherwise use new text
            mDef.checklist.forEach((defItem, idx) => {
              if (!mData.checklist[idx] || mData.checklist[idx].text !== defItem.text) {
                 mData.checklist[idx] = { text: defItem.text, done: false };
              }
            });
            // Truncate if default is shorter
            mData.checklist.length = mDef.checklist.length;
          }
        });
      }

      return { ...DEFAULT_DATA, ...data };
    } catch (e) {
      console.error('Data load failed:', e);
      return initData();
    }
  }

  function initData() {
    const data = JSON.parse(JSON.stringify(DEFAULT_DATA));
    data.settings.createdAt = new Date().toISOString();
    data.settings.lastUpdated = new Date().toISOString();
    saveData(data);
    return data;
  }

  let syncTimeout = null;

  async function pushToSupabase(data) {
    if (typeof SupabaseClient === 'undefined' || !SupabaseClient.client) return;
    const sb = SupabaseClient.client;
    
    try {
      const { data: existing, error: fetchErr } = await sb.from('yooha_state').select('id').limit(1);
      if (existing && existing.length > 0) {
        await sb.from('yooha_state').update({ data: data, updated_at: new Date().toISOString() }).eq('id', existing[0].id);
      } else {
        await sb.from('yooha_state').insert({ data: data });
      }
    } catch(err) {
      console.warn("Supabase push failed:", err);
    }
  }

  function saveData(data) {
    data.settings.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      pushToSupabase(data).catch(console.error);
    }, 1500);
  }

  async function syncFromSupabase() {
    if (typeof SupabaseClient === 'undefined' || !SupabaseClient.client) return;
    try {
      const sb = SupabaseClient.client;
      const { data, error } = await sb.from('yooha_state').select('data, updated_at').limit(1);
      
      if (error) throw error;

      if (data && data.length > 0 && data[0].data) {
         const remoteData = data[0].data;
         const localRaw = localStorage.getItem(STORAGE_KEY);
         let doSaveLocally = false;
         
         if (localRaw) {
            const localData = JSON.parse(localRaw);
            const localTime = new Date(localData.settings?.lastUpdated || 0).getTime();
            const remoteTime = new Date(remoteData.settings?.lastUpdated || 0).getTime();
            
            if (remoteTime > localTime) {
               doSaveLocally = true;
            }
         } else {
            doSaveLocally = true;
         }
         
         if (doSaveLocally) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
         }
      } else {
         const curData = loadData();
         pushToSupabase(curData);
      }
    } catch(err) {
      console.warn("Supabase sync failed:", err);
      throw err;
    }
  }

  function getData() {
    return loadData();
  }

  // ---- ID Generator ----
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // ---- CRUD: Exams ----
  function addExam(exam) {
    const data = loadData();
    exam.id = generateId();
    exam.createdAt = new Date().toISOString();
    data.exams.push(exam);
    addActivity(data, `시험 성적 추가: ${exam.subject} (${exam.examType})`);
    saveData(data);
    return exam;
  }

  function updateExam(id, updates) {
    const data = loadData();
    const idx = data.exams.findIndex((e) => e.id === id);
    if (idx !== -1) {
      data.exams[idx] = { ...data.exams[idx], ...updates };
      addActivity(data, `시험 성적 수정: ${data.exams[idx].subject}`);
      saveData(data);
    }
    return data.exams[idx];
  }

  function deleteExam(id) {
    const data = loadData();
    data.exams = data.exams.filter((e) => e.id !== id);
    addActivity(data, '시험 성적 삭제');
    saveData(data);
  }

  function getExams() {
    return loadData().exams;
  }

  // ---- CRUD: Portfolio ----
  function addPortfolio(item) {
    const data = loadData();
    item.id = generateId();
    item.createdAt = new Date().toISOString();
    data.portfolio.push(item);
    addActivity(data, `포트폴리오 추가: ${item.title} (${item.category})`);
    saveData(data);
    return item;
  }

  function updatePortfolio(id, updates) {
    const data = loadData();
    const idx = data.portfolio.findIndex((p) => p.id === id);
    if (idx !== -1) {
      data.portfolio[idx] = { ...data.portfolio[idx], ...updates };
      addActivity(data, `포트폴리오 수정: ${data.portfolio[idx].title}`);
      saveData(data);
    }
    return data.portfolio[idx];
  }

  function deletePortfolio(id) {
    const data = loadData();
    data.portfolio = data.portfolio.filter((p) => p.id !== id);
    addActivity(data, '포트폴리오 삭제');
    saveData(data);
  }

  function getPortfolio(category) {
    const items = loadData().portfolio;
    if (category && category !== 'all') {
      return items.filter((p) => p.category === category);
    }
    return items;
  }

  // ---- CRUD: Schedules ----
  function addSchedule(schedule) {
    const data = loadData();
    schedule.id = generateId();
    data.schedules.push(schedule);
    addActivity(data, `일정 추가: ${schedule.name}`);
    saveData(data);
    return schedule;
  }

  function updateSchedule(id, updates) {
    const data = loadData();
    const idx = data.schedules.findIndex((s) => s.id === id);
    if (idx !== -1) {
      data.schedules[idx] = { ...data.schedules[idx], ...updates };
      saveData(data);
    }
    return data.schedules[idx];
  }

  function deleteSchedule(id) {
    const data = loadData();
    data.schedules = data.schedules.filter((s) => s.id !== id);
    addActivity(data, '일정 삭제');
    saveData(data);
  }

  function getSchedules() {
    return loadData().schedules;
  }

  // ---- CRUD: Academies ----
  function addAcademy(academy) {
    const data = loadData();
    academy.id = generateId();
    data.academies.push(academy);
    addActivity(data, `학원 추가: ${academy.name}`);
    saveData(data);
    return academy;
  }

  function updateAcademy(id, updates) {
    const data = loadData();
    const idx = data.academies.findIndex((a) => a.id === id);
    if (idx !== -1) {
      data.academies[idx] = { ...data.academies[idx], ...updates };
      saveData(data);
    }
    return data.academies[idx];
  }

  function deleteAcademy(id) {
    const data = loadData();
    data.academies = data.academies.filter((a) => a.id !== id);
    addActivity(data, '학원 삭제');
    saveData(data);
  }

  function getAcademies() {
    return loadData().academies;
  }

  // ---- CRUD: Strategies ----
  function addStrategy(strategy) {
    const data = loadData();
    strategy.id = generateId();
    strategy.createdAt = new Date().toISOString();
    data.strategies.push(strategy);
    addActivity(data, `전략 메모 추가: ${strategy.title}`);
    saveData(data);
    return strategy;
  }

  function updateStrategy(id, updates) {
    const data = loadData();
    const idx = data.strategies.findIndex((s) => s.id === id);
    if (idx !== -1) {
      data.strategies[idx] = { ...data.strategies[idx], ...updates };
      saveData(data);
    }
    return data.strategies[idx];
  }

  function deleteStrategy(id) {
    const data = loadData();
    data.strategies = data.strategies.filter((s) => s.id !== id);
    addActivity(data, '전략 메모 삭제');
    saveData(data);
  }

  function getStrategies() {
    return loadData().strategies;
  }

  // ---- Milestones ----
  function getMilestones() {
    return loadData().milestones;
  }

  function updateMilestone(id, updates) {
    const data = loadData();
    const idx = data.milestones.findIndex((m) => m.id === id);
    if (idx !== -1) {
      data.milestones[idx] = { ...data.milestones[idx], ...updates };
      saveData(data);
    }
    return data.milestones[idx];
  }

  function toggleMilestoneCheckItem(milestoneId, checkIndex) {
    const data = loadData();
    const m = data.milestones.find((m) => m.id === milestoneId);
    if (m && m.checklist[checkIndex] !== undefined) {
      m.checklist[checkIndex].done = !m.checklist[checkIndex].done;
      saveData(data);
    }
    return m;
  }

  // ---- Activity Log ----
  function addActivity(data, message) {
    if (!data.activities) data.activities = [];
    data.activities.unshift({
      message,
      timestamp: new Date().toISOString(),
    });
    // Keep only last 50
    if (data.activities.length > 50) {
      data.activities = data.activities.slice(0, 50);
    }
  }

  function getActivities() {
    return loadData().activities || [];
  }

  // ---- D-Day Calculation ----
  function getDday() {
    const data = loadData();
    const target = new Date(data.profile.ddayDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  // ---- Progress Calculation ----
  function getOverallProgress() {
    // From March 2026 (start of middle school) to Nov 2031 (수능)
    const start = new Date('2026-03-01');
    const end = new Date('2031-11-20');
    const now = new Date();

    if (now <= start) return 0;
    if (now >= end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  }

  // ---- Current Grade Calculation ----
  function getCurrentGrade() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12

    // Birth year 2013, enters middle school in March 2026
    const entryYear = 2026;
    const academicYear = month >= 3 ? year : year - 1;
    const yearDiff = academicYear - entryYear;

    if (yearDiff < 0) return '초6';
    if (yearDiff === 0) return '중1';
    if (yearDiff === 1) return '중2';
    if (yearDiff === 2) return '중3';
    if (yearDiff === 3) return '고1';
    if (yearDiff === 4) return '고2';
    if (yearDiff === 5) return '고3';
    return '졸업';
  }

  function getCurrentSemester() {
    const month = new Date().getMonth() + 1;
    return month >= 3 && month <= 8 ? '1학기' : '2학기';
  }

  // ---- Export / Import ----
  function exportJSON() {
    const data = loadData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jarvis-yooha-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJSON(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (imported.profile && imported.profile.name) {
            saveData({ ...DEFAULT_DATA, ...imported });
            resolve(true);
          } else {
            reject(new Error('유효하지 않은 데이터 형식입니다.'));
          }
        } catch (err) {
          reject(new Error('JSON 파싱 에러: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('파일 읽기 실패'));
      reader.readAsText(file);
    });
  }

  // ---- Stats ----
  function getStats() {
    const data = loadData();
    const exams = data.exams || [];
    const portfolio = data.portfolio || [];
    const academies = data.academies || [];

    // Average grade of recent exams
    let avgGrade = '-';
    if (exams.length > 0) {
      const grades = exams.filter((e) => e.grade).map((e) => parseFloat(e.grade));
      if (grades.length > 0) {
        avgGrade = (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1);
      }
    }

    // Portfolio count by category
    const portfolioCount = portfolio.length;

    // Competition count
    const competitionCount = portfolio.filter(
      (p) => p.category === 'competition'
    ).length;

    // Total monthly academy cost
    const monthlyCost = academies.reduce((sum, a) => sum + (parseInt(a.cost) || 0), 0);

    return {
      avgGrade,
      portfolioCount,
      competitionCount,
      monthlyCost,
      examCount: exams.length,
      academyCount: academies.length,
    };
  }

  // ---- Profile ----
  function getProfile() {
    return loadData().profile;
  }

  function updateProfile(updates) {
    const data = loadData();
    data.profile = { ...data.profile, ...updates };
    saveData(data);
    return data.profile;
  }

  // ---- Public API ----
  return {
    getData,
    getProfile,
    updateProfile,
    // Exams
    addExam,
    updateExam,
    deleteExam,
    getExams,
    // Portfolio
    addPortfolio,
    updatePortfolio,
    deletePortfolio,
    getPortfolio,
    // Schedules
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getSchedules,
    // Academies
    addAcademy,
    updateAcademy,
    deleteAcademy,
    getAcademies,
    // Strategies
    addStrategy,
    updateStrategy,
    deleteStrategy,
    getStrategies,
    // Milestones
    getMilestones,
    updateMilestone,
    toggleMilestoneCheckItem,
    // Activities
    getActivities,
    // Calculations
    getDday,
    getOverallProgress,
    getCurrentGrade,
    getCurrentSemester,
    getStats,
    // Export/Import
    exportJSON,
    importJSON,
    // Programs
    getPrograms: () => loadData().programs,

    // Feedback
    getFeedbacks: () => {
      const data = loadData();
      return [...(data.feedbacks || [])].sort((a,b) => new Date(b.date) - new Date(a.date));
    },
    addFeedback: (fb) => {
      const data = loadData();
      if (!data.feedbacks) data.feedbacks = [];
      const newFb = {
        id: 'fb-' + Date.now(),
        date: fb.date ? fb.date : new Date().toISOString(),
        academy: fb.academy || '기타',
        content: fb.content
      };
      // Keep activities generic too
      if (!data.activities) data.activities = [];
      data.activities.unshift({
        id: 'act-' + Date.now(),
        date: fb.date || new Date().toISOString().split('T')[0],
        message: `학원 SMS 피드백 등록 (${newFb.academy})`,
        type: 'msg'
      });
      if (data.activities.length > 50) data.activities.pop();

      data.feedbacks.unshift(newFb);
      saveData(data);
    },
    deleteFeedback: (id) => {
      const data = loadData();
      if(data.feedbacks) {
         data.feedbacks = data.feedbacks.filter(f => f.id !== id);
         saveData(data);
      }
    },
    updateFeedback: (id, updates) => {
      const data = loadData();
      if(data.feedbacks) {
         const idx = data.feedbacks.findIndex(f => f.id === id);
         if (idx !== -1) {
            data.feedbacks[idx] = { ...data.feedbacks[idx], ...updates };
            saveData(data);
         }
      }
    },
    
    // Remote
    syncFromSupabase,
    // Utils
    generateId,
  };
})();
