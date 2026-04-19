/* ============================================
   JARVIS-Yooha — Strategy Module
   ============================================ */

const StrategyView = (() => {
  let currentTab = 'overview';

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Strategy</h1>
          <p class="page-subtitle">입시 전략 · 전형 분석 · 고교 선택 · 전략 메모</p>
        </div>
        <button class="btn btn-primary" onclick="StrategyView.showAddMemo()">+ 전략 메모</button>
      </div>

      <div class="tab-nav">
        <button class="tab-item ${currentTab === 'overview' ? 'active' : ''}" onclick="StrategyView.setTab('overview')"> 전형 분석</button>
        <button class="tab-item ${currentTab === 'highschool' ? 'active' : ''}" onclick="StrategyView.setTab('highschool')"> 고교 전략</button>
        <button class="tab-item ${currentTab === 'memo' ? 'active' : ''}" onclick="StrategyView.setTab('memo')"> 전략 메모</button>
      </div>

      ${currentTab === 'overview' ? renderOverview() : ''}
      ${currentTab === 'highschool' ? renderHighSchool() : ''}
      ${currentTab === 'memo' ? renderMemos() : ''}
    `;
  }

  // ---- Admission Overview ----
  function renderOverview() {
    return `
      <!-- 전형 비교 테이블 -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">서울대 수의과대학 전형 비교</span>
          <span class="card-badge">2032학년도 목표</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>일반전형 (학종)</th>
                <th>지역균형전형</th>
                <th>정시 (수능)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:600;">수능 최저</td>
                <td><span class="tag tag-green">없음</span></td>
                <td><span class="tag tag-gold">3개영역 합 7 이내</span></td>
                <td><span class="tag tag-cyan">수능 100% (1단계)</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">선발 방식</td>
                <td>1단계: 서류 (2배수)<br>2단계: 서류 + 면접</td>
                <td>서류 + 면접</td>
                <td>1단계: 수능 100%<br>2단계: 수능80+교과20</td>
              </tr>
              <tr>
                <td style="font-weight:600;">합격 내신</td>
                <td class="font-en" style="color:var(--cyan); font-weight:600;">1.3~1.6 등급</td>
                <td class="font-en" style="color:var(--gold); font-weight:600;">1.0~1.2 등급</td>
                <td class="text-secondary">-</td>
              </tr>
              <tr>
                <td style="font-weight:600;">핵심 권장과목</td>
                <td colspan="3"><span class="tag tag-gold">생명과학Ⅱ (필수)</span> &nbsp; <span class="tag tag-cyan">화학Ⅱ</span> &nbsp; <span class="tag tag-cyan">미적분</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">면접</td>
                <td style="color:var(--red); font-weight:600;"> 합불 결정적 변수</td>
                <td>인성 + 적성</td>
                <td>적성·인성 (결격 판단)</td>
              </tr>
              <tr>
                <td style="font-weight:600;">추천</td>
                <td>불필요</td>
                <td><span class="tag tag-gold">학교장 추천 필수</span></td>
                <td>불필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 건국대 전형 비교 테이블 -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">건국대 수의과대학 전형 비교</span>
          <span class="card-badge">참고 대학</span>
        </div>
        <div style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>KU자기추천 (학종)</th>
                <th>KU지역균형 (교과)</th>
                <th>정시 (가군)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:600;">수능 최저</td>
                <td><span class="tag tag-green">없음</span></td>
                <td><span class="tag tag-gold">3개영역 합 5 이내</span></td>
                <td><span class="tag tag-cyan">수능 100%</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">선발 방식</td>
                <td>1단계: 서류 (3배수)<br>2단계: 서류70+면접30</td>
                <td>교과70 + 서류30</td>
                <td>수능 100%</td>
              </tr>
              <tr>
                <td style="font-weight:600;">합격 내신</td>
                <td class="font-en" style="color:var(--cyan); font-weight:600;">1.5~2.2 등급</td>
                <td class="font-en" style="color:var(--gold); font-weight:600;">1.1~1.3 등급</td>
                <td class="text-secondary">-</td>
              </tr>
              <tr>
                <td style="font-weight:600;">핵심 권장과목</td>
                <td colspan="3"><span class="tag tag-gold">생명과학Ⅱ (필수)</span> &nbsp; <span class="tag tag-cyan">화학Ⅱ</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">면접</td>
                <td style="color:var(--red); font-weight:600;">제출 서류 기반 면접</td>
                <td><span class="tag tag-green">없음</span></td>
                <td><span class="tag tag-green">없음</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">추천</td>
                <td>불필요</td>
                <td><span class="tag tag-gold">학교장 추천 필수</span></td>
                <td>불필요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 평가 기준 -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">학생부종합 평가 기준</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:var(--space-md);">
          ${evalCard('📊', '학업능력', '폭넓은 지식을 깊이 있게 갖추고 활용할 수 있는가?', [
            '교과 성취도 (내신 등급)',
            '과목 선택의 적극성',
            '성적 추이 (향상도)',
            '학업 심화 탐구 과정',
          ], 'cyan')}
          ${evalCard('', '학업태도', '스스로 알고자 하며 적극적으로 배우고자 하는가?', [
            '자기주도적 학습 경험',
            '전공 관련 과목 선택',
            '수업 참여 적극성',
            '세특에 드러난 탐구 과정',
          ], 'green')}
          ${evalCard('', '학업 외 소양', '바른 인성과 공동체 의식을 갖추고 있는가?', [
            '리더십과 책임감',
            '봉사 및 나눔 실천',
            '공동체 기여 활동',
            '인성과 협업 역량',
          ], 'gold')}
        </div>
      </div>

      <!-- 2028 대입개편 요약 -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">2028 대학입시제도 개편 요약</span>
        </div>
        <div style="padding:var(--space-md); background:rgba(255,255,255,0.03); border-radius:var(--radius-md); font-size:14px; line-height:1.7;">
          <ul style="margin:0; padding-left:20px; color:var(--text-secondary);">
            <li style="margin-bottom:8px;"><strong style="color:var(--text-primary);">고교 내신 5등급제로 단순화:</strong> 전 학년·전 과목 5등급제 개편 및 절대평가/상대평가 병기 (단, 사회/과학 융합선택 9과목은 절대평가만 실시)</li>
            <li><strong style="color:var(--text-primary);">수능 통합형·융합형 체제로 전환:</strong> 선택과목 폐지 및 국어/수학 공통과목 전환. 탐구 영역 문·이과 구분 없이 '통합사회+통합과학' 필수 응시 (심화수학 최종 제외)</li>
          </ul>
        </div>
      </div>

      <!-- 핵심 전략 인사이트 -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">2028 개편에 따른 수의대 핵심 전략</span>
        </div>
        <div style="display:grid; gap:var(--space-md);">
          ${insightItem('', '전략적 심화 과목 이수 & 세특 관리', '내신 변별력 약화로 학생부 세특 중심의 정성평가가 합격을 완전히 좌우합니다. 수능 출제 범위에서 빠지더라도 미적분, 생명과학Ⅱ, 화학Ⅱ 등 수의학 핵심 권장과목을 학교에서 반드시 수강해 탐구 역량을 증명하십시오.', 'cyan')}
          ${insightItem('', '수능 최저학력기준 대폭 강화 대비', '통합 수능과 내신 5등급제 도입으로 최상위권의 동점자가 속출합니다. 변별력 확보를 위해 수능 최저를 신설하거나 대폭 높일 것이므로 전 과목 원점수 및 1등급 방어가 필수적입니다.', 'red')}
          ${insightItem('', '다중미니면접(MMI) 집중 훈련 시스템', '상위권 대학은 성적 한계를 보완하기 위해 심층 면접 비중을 극대화합니다. 서울대 예시처럼 정시 일반전형에도 MMI 면접(20점)이 신규 도입되므로 딜레마 상황, 커뮤니케이션, 생명윤리에 대한 지속적 훈련이 필요합니다.', 'gold')}
          ${insightItem('🎯', '정시 전형에서도 학교생활(교과역량) 유지', '더 이상 정시가 수능 100%로 결정되지 않습니다. 수능 60점 + 교과역량평가 40점으로 선발하는 기조가 강하므로, 수능만 믿고 수시를 포기하거나 자퇴 후 검정고시를 응시하는 전략은 치명적입니다.', 'green')}
          ${insightItem('🇬🇧', '원어민급 영어 실력의 합법적 생기부 활용', '외부 공인 어학 성적 기재가 전면 금지되었으므로, [고급 영어] 선택 등 교과 세특을 우회 활용해야 합니다. 해외 최신 수의학/바이러스학 영문 SCI급 논문을 직접 번역 없이 리서치하고 발표하는 심화 탐구 사례가 서울대 학종합격의 핵심 킬러 무기가 됩니다.', 'purple')}
        </div>
      </div>
    `;
  }

  function evalCard(icon, title, question, details, color) {
    return `
      <div style="padding:var(--space-lg); background:rgba(255,255,255,0.02); border-radius:var(--radius-md); border-top:3px solid var(--${color});">
        <div style="font-size:28px; margin-bottom:var(--space-sm);">${icon}</div>
        <div style="font-weight:700; font-size:16px; margin-bottom:4px;">${title}</div>
        <div style="font-size:13px; color:var(--text-secondary); margin-bottom:var(--space-md); font-style:italic;">"${question}"</div>
        <ul style="list-style:none; padding:0; margin:0;">
          ${details.map(d => `<li style="font-size:13px; padding:3px 0; color:var(--text-secondary);">• ${d}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function insightItem(icon, title, desc, color) {
    return `
      <div style="padding:var(--space-md); background:var(--${color}-dim); border-radius:var(--radius-md); border-left:3px solid var(--${color});">
        <div style="font-weight:600; margin-bottom:4px;">${icon} ${title}</div>
        <div style="font-size:13px; color:var(--text-secondary); line-height:1.7;">${desc}</div>
      </div>
    `;
  }

  // ---- High School Strategy ----
  function renderHighSchool() {
    return `
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">수의대 진학을 위한 고교 선택 딜레마</span>
          <span class="card-badge">2028 대입 개편 기준</span>
        </div>
        <div style="padding:var(--space-md); font-size:14px; line-height:1.7;">
          <p style="margin-bottom:12px;">현 중학생들이 치를 <strong>2028 대입 개편안(내신 5등급제 + 수능 통합)</strong>은 고교 선택의 패러다임을 완전히 바꾸어 놓았습니다. 단순한 '내신 따기 쉬운 곳'을 넘어선 전략이 필요합니다.</p>
        </div>
        
        <div style="overflow-x:auto;">
          <table class="data-table" style="margin-bottom:var(--space-md);">
            <thead>
              <tr>
                <th>평가 기준 (2028 개편)</th>
                <th>과학고/영재학교</th>
                <th>전국단위 자사고/명문 일반고</th>
                <th>일반고 (내신 확보형)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight:600;">내신 등급 (1등급 10%)</td>
                <td><span class="tag tag-red">매우 불리</span><br><span style="font-size:11px; color:var(--text-muted);">의학계열 지원 불이익</span></td>
                <td><span class="tag tag-gold">보통~다소 유리</span><br><span style="font-size:11px; color:var(--text-muted);">10% 확대로 1등급 진입 가능성↑</span></td>
                <td><span class="tag tag-cyan">매우 유리</span><br><span style="font-size:11px; color:var(--text-muted);">1등급(10%) 확보 필수</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">생기부 (탐구/세특)</td>
                <td><span class="tag tag-cyan">최상</span></td>
                <td><span class="tag tag-cyan">최상~상</span><br><span style="font-size:11px; color:var(--text-muted);">고급 과목 개설 많음</span></td>
                <td><span class="tag tag-red">불리</span><br><span style="font-size:11px; color:var(--text-muted);">개별적 심화 탐구 노력 절실</span></td>
              </tr>
              <tr>
                <td style="font-weight:600;">수능 대비 (통합수능)</td>
                <td><span class="tag tag-red">수능 준비 어려움</span></td>
                <td><span class="tag tag-cyan">매우 유리</span><br><span style="font-size:11px; color:var(--text-muted);">학교 자체가 수능 최적화</span></td>
                <td><span class="tag tag-gold">개인 역량 의존</span><br><span style="font-size:11px; color:var(--text-muted);">정시+내신 투트랙 부담</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">어떤 고등학교가 유리한가? (최종 결론)</span>
        </div>
        <div style="display:grid; gap:var(--space-md);">
          ${insightItem('', '1순위: "지역 내 면학 분위기가 좋은 명문 일반고" (가장 추천)', '2028 수능 개편으로 내신 1등급 비율이 4%에서 10%로 늘어났습니다. 과거에는 명문 일반고에서 1등급을 받기 위해 피를 말렸으나, 이제 10% 안에만 들면 최고 등급을 받습니다. 따라서 내신 획득의 리스크는 줄어들고, 우수한 수능 대비와 양질의 세특(심화과목 개설 등)이라는 장점만 온전히 누릴 수 있습니다.', 'cyan')}
          
          ${insightItem('', '2순위: "전국단위 자사고" (단, 기숙사 성향 고려 필수)', '내신 5등급제 혜택을 크게 보는 곳입니다. 상위 10% 안에 들 자신만 있다면, 최상위권 생기부와 탁월한 수능 대비 인프라를 누릴 수 있습니다. 단, 유하의 ESFP 성향(사람들과의 교류 중시, 스트레스에 민감)을 고려할 때 초경쟁적 기숙사 환경이 자칫 독이 될 수 있습니다.', 'gold')}
          
          ${insightItem('', '3순위: "내신 따기 쉬운 일반고" (위험도 상승)', '과거에는 의대/수의대 진학을 위해 전략적으로 많이 선택했습니다. 하지만 2028 대입에서는 동점자(내신 1등급 10%)가 대거 발생하므로 상위권 대학은 "수능 최저학력기준"과 "심층 면접"으로 학생을 거르게 됩니다. 혼자 수능 최저를 공부하고, 평이한 수업 환경에서 혼자 독창적인 수의학 세특을 창조해 내는 것은 상당한 부담이 됩니다.', 'red')}
          
          ${insightItem('', '가장 피해야 할 곳: 영재학교 및 과학고', '국가지원금 문제로 의약학계열(수의대 포함) 진학 시 장학금 환수, 교사용 추천서 작성 절대 불가, 학생부 의대진학용 기재 제한 등 막대한 페널티가 부여됩니다. 서울대학교 수의대를 목표로 한다면 절대 진학해서는 안 됩니다.', 'purple')}
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">유하를 위한 맞춤 전략 체크리스트</span>
        </div>
        <div style="padding:var(--space-md); background:var(--bg-secondary); border-radius:var(--radius-md);">
          <ul style="margin:0; padding-left:20px; color:var(--text-secondary); line-height:1.8;">
            <li>강남 학군, 특히 현 거주지(수서동/강남구) 접근성을 고려할 때 <strong>과학 중점 학교</strong> 또는 <strong>과탐 심화 과목(생명과학Ⅱ, 화학Ⅱ) 개설이 안정적인 강남권 갓반고</strong>가 최우선 타겟입니다.</li>
            <li>유하의 <strong>원어민급 영어 수준(C2/1400L+)</strong>은 일반고에서도 압도적 경쟁력입니다. 이를 활용해 "해외 최신 수의학 원서 리서치"를 세특에 지속적으로 녹여내야 합니다.</li>
            <li>좌뇌형의 체계적 기질과 ESFP의 활달함을 모두 충족할 수 있도록, 무작정 가두어 두는 기숙사형 자사고보다 <strong>동아리 활동이나 멘토링 특화 프로그램이 활발한 학교</strong>를 선택해야 학업 스트레스를 방어할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ---- Strategy Memos ----
  function renderMemos() {
    const memos = JarvisData.getStrategies();

    if (memos.length === 0) {
      return `
        <div class="card">
          ${Components.emptyState('', '아직 작성된 전략 메모가 없습니다.', '<button class="btn btn-primary btn-sm" onclick="StrategyView.showAddMemo()">첫 전략 메모 작성</button>')}
        </div>
      `;
    }

    return `
      <div style="display:grid; gap:var(--space-md);">
        ${memos
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map(
            (m) => `
          <div class="card">
            <div class="card-header">
              <span class="card-title">
                ${m.category === 'consultation' ? '' : m.category === 'analysis' ? '📊' : ''}
                ${m.title}
              </span>
              <div style="display:flex; align-items:center; gap:var(--space-sm);">
                <span style="font-size:12px; color:var(--text-muted);">${Components.formatDate(m.createdAt)}</span>
                <button class="btn-icon" onclick="StrategyView.showEditMemo('${m.id}')" title="수정">편집</button>
                <button class="btn-icon" onclick="StrategyView.confirmDeleteMemo('${m.id}')" title="삭제">삭제</button>
              </div>
            </div>
            <div style="font-size:14px; color:var(--text-secondary); line-height:1.8; white-space:pre-wrap;">${m.content}</div>
          </div>
        `
          )
          .join('')}
      </div>
    `;
  }

  // ---- Memo Modal ----
  function showAddMemo() {
    Components.showModal(
      '전략 메모 작성',
      getMemoFormHtml(),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="StrategyView.saveMemo()">저장</button>
      `
    );
  }

  function showEditMemo(id) {
    const m = JarvisData.getStrategies().find((s) => s.id === id);
    if (!m) return;
    Components.showModal(
      '전략 메모 수정',
      getMemoFormHtml(m),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="StrategyView.saveMemo('${id}')">수정</button>
      `
    );
  }

  function getMemoFormHtml(m = {}) {
    return `
      <div class="form-group">
        <label class="form-label">제목</label>
        <input type="text" class="form-input" id="memo-title" value="${m.title || ''}" placeholder="예: 중2 여름방학 학습 전략">
      </div>
      <div class="form-group">
        <label class="form-label">분류</label>
        <select class="form-input" id="memo-category">
          <option value="general" ${m.category === 'general' ? 'selected' : ''}> 일반 메모</option>
          <option value="consultation" ${m.category === 'consultation' ? 'selected' : ''}> 상담 기록</option>
          <option value="analysis" ${m.category === 'analysis' ? 'selected' : ''}>📊 분석 노트</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">내용</label>
        <textarea class="form-input" id="memo-content" rows="8" placeholder="전략적 인사이트, 상담 내용, 분석 결과 등을 자유롭게 기록하세요.">${m.content || ''}</textarea>
      </div>
    `;
  }

  function saveMemo(editId) {
    const m = {
      title: document.getElementById('memo-title').value,
      category: document.getElementById('memo-category').value,
      content: document.getElementById('memo-content').value,
    };

    if (!m.title) {
      Components.showToast('제목을 입력해주세요.', 'warning');
      return;
    }

    if (editId) {
      JarvisData.updateStrategy(editId, m);
      Components.showToast('전략 메모가 수정되었습니다.', 'success');
    } else {
      JarvisData.addStrategy(m);
      Components.showToast('전략 메모가 추가되었습니다.', 'success');
    }

    Components.closeModal();
    JarvisApp.navigateTo('strategy');
  }

  function confirmDeleteMemo(id) {
    Components.showConfirm('이 전략 메모를 삭제하시겠습니까?', () => {
      JarvisData.deleteStrategy(id);
      Components.showToast('전략 메모가 삭제되었습니다.', 'info');
      JarvisApp.navigateTo('strategy');
    });
  }

  function setTab(tab) {
    currentTab = tab;
    JarvisApp.navigateTo('strategy');
  }

  return {
    render,
    setTab,
    showAddMemo,
    showEditMemo,
    saveMemo,
    confirmDeleteMemo,
  };
})();
