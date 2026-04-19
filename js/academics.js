/* ============================================
   JARVIS-Yooha — Academics Module
   ============================================ */

const AcademicsView = (() => {
  let currentTab = 'exams';

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Academics</h1>
          <p class="page-subtitle">시험 성적 관리 · 과목 선택 전략</p>
        </div>
        <button class="btn btn-primary" onclick="AcademicsView.showAddExam()">+ 시험 추가</button>
      </div>

      <div class="tab-nav">
        <button class="tab-item ${currentTab === 'exams' ? 'active' : ''}" onclick="AcademicsView.setTab('exams')">시험 성적</button>
        <button class="tab-item ${currentTab === 'subjects' ? 'active' : ''}" onclick="AcademicsView.setTab('subjects')">과목 전략</button>
        <button class="tab-item ${currentTab === 'analysis' ? 'active' : ''}" onclick="AcademicsView.setTab('analysis')">성적 분석</button>
      </div>

      <div id="academics-content">
        ${currentTab === 'exams' ? renderExams() : ''}
        ${currentTab === 'subjects' ? renderSubjectStrategy() : ''}
        ${currentTab === 'analysis' ? renderAnalysis() : ''}
      </div>
    `;
  }

  // ---- Exams Tab ----
  function renderExams() {
    const exams = JarvisData.getExams();

    if (exams.length === 0) {
      return `
        <div class="card">
          ${Components.emptyState('', '아직 등록된 시험 성적이 없습니다.', '<button class="btn btn-primary btn-sm" onclick="AcademicsView.showAddExam()">첫 시험 성적 추가</button>')}
        </div>
      `;
    }

    // Group by semester
    const groups = {};
    exams.forEach((e) => {
      const key = `${e.year || ''}년 ${e.semester || ''}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    let html = '';
    Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .forEach(([semester, items]) => {
        // Calculate average for this semester
        const grades = items.filter((e) => e.grade).map((e) => parseFloat(e.grade));
        const avg = grades.length > 0 ? (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(1) : '-';

        html += `
          <div class="card" style="margin-bottom:var(--space-md);">
            <div class="card-header">
              <span class="card-title">${semester}</span>
              <span class="card-badge">평균 ${avg}등급</span>
            </div>
            <div style="overflow-x:auto;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>과목</th>
                    <th>시험유형</th>
                    <th>점수</th>
                    <th>등급</th>
                    <th>석차</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  ${items
                    .map(
                      (e) => `
                    <tr>
                      <td style="font-weight:500;">${e.subject}</td>
                      <td><span class="tag tag-cyan">${e.examType || ''}</span></td>
                      <td class="font-en">${e.score || '-'}</td>
                      <td>${Components.gradeBadge(e.grade)}</td>
                      <td class="font-mono text-secondary">${e.rank || '-'}</td>
                      <td>
                        <div style="display:flex; gap:4px;">
                          <button class="btn-icon" onclick="AcademicsView.showEditExam('${e.id}')" title="수정">편집</button>
                          <button class="btn-icon" onclick="AcademicsView.confirmDeleteExam('${e.id}')" title="삭제">삭제</button>
                        </div>
                      </td>
                    </tr>
                  `
                    )
                    .join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      });

    return html;
  }

  // ---- Subject Strategy Tab ----
  function renderSubjectStrategy() {
    const required = [
      { name: '생명과학Ⅱ', type: '핵심 권장', status: 'required', note: '서울대 수의대 필수 권장과목' },
      { name: '생명과학Ⅰ', type: '권장', status: 'recommended', note: '기초 생명과학 이해' },
      { name: '화학Ⅱ', type: '권장', status: 'recommended', note: '수의학 기초 화학' },
      { name: '화학Ⅰ', type: '권장', status: 'recommended', note: '기초 화학 이해' },
      { name: '미적분', type: '권장', status: 'recommended', note: '수리 역량' },
      { name: '확률과 통계', type: '권장', status: 'recommended', note: '통계적 사고' },
      { name: '물리학Ⅰ', type: '선택', status: 'optional', note: '자연계열 기본 소양' },
      { name: '지구과학Ⅰ', type: '선택', status: 'optional', note: 'One Health 관점' },
    ];

    const statusColors = {
      required: 'gold',
      recommended: 'cyan',
      optional: 'purple',
    };

    return `
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">서울대 수의대 권장 과목</span>
          <span class="card-badge">2022 개정 교육과정</span>
        </div>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:var(--space-lg);">
          서울대가 수의예과 지원자에게 이수를 권장하는 과목들입니다. 고교 진학 후 전략적으로 선택해야 합니다.
        </p>
        <table class="data-table">
          <thead>
            <tr>
              <th>과목명</th>
              <th>구분</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            ${required
              .map(
                (s) => `
              <tr>
                <td style="font-weight:600;">${s.name}</td>
                <td><span class="tag tag-${statusColors[s.status]}">${s.type}</span></td>
                <td style="color:var(--text-secondary); font-size:13px;">${s.note}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">과목 선택 전략 가이드</span>
        </div>
        <div style="display:grid; gap:var(--space-md);">
          ${strategyItem('', '과학 탐구 영역', '생명과학Ⅱ는 반드시 이수. 화학Ⅱ도 강력 권장. "생➡화" 조합이 수의대 지원자의 기본 포트폴리오입니다.')}
          ${strategyItem('', '수학 영역', '미적분 + 확률과 통계 이수 권장. 기하는 선택적이지만 수능 수학 대비에 유리합니다.')}
          ${strategyItem('', '세특(세부능력특기사항)', '수업 중 배운 내용을 수의학과 연결하여 심화 탐구한 기록이 핵심. "왜 이 과목을 선택했는가"가 면접에서 질문됩니다.')}
          ${strategyItem('', 'One Health 관점', '사람·동물·환경의 건강이 하나라는 수의학적 관점에서 교과를 바라보는 시각이 차별화 포인트입니다.')}
        </div>
      </div>
    `;
  }

  function strategyItem(icon, title, desc) {
    return `
      <div style="padding:var(--space-md); background:rgba(255,255,255,0.02); border-radius:var(--radius-md); border-left:3px solid var(--cyan);">
        <div style="font-weight:600; margin-bottom:4px;">${icon} ${title}</div>
        <div style="font-size:13px; color:var(--text-secondary); line-height:1.7;">${desc}</div>
      </div>
    `;
  }

  // ---- Analysis Tab ----
  function renderAnalysis() {
    const exams = JarvisData.getExams();

    if (exams.length < 2) {
      return `
        <div class="card">
          ${Components.emptyState('', '성적 분석을 위해서는 최소 2건 이상의 시험 데이터가 필요합니다.')}
        </div>
      `;
    }

    // Group by subject for trend
    const subjects = {};
    exams.forEach((e) => {
      if (!subjects[e.subject]) subjects[e.subject] = [];
      subjects[e.subject].push(e);
    });

    let trendHtml = '';
    Object.entries(subjects).forEach(([subject, items]) => {
      const grades = items.filter((e) => e.grade).map((e) => parseFloat(e.grade));
      if (grades.length < 2) return;

      const first = grades[0];
      const last = grades[grades.length - 1];
      const diff = first - last; // positive = improvement
      const trend = diff > 0 ? '↑ 상승' : diff < 0 ? '↓ 하락' : '→ 유지';
      const trendColor = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--text-secondary)';

      // Mini bar chart
      const maxGrade = 9;
      const bars = grades
        .map(
          (g) => `
        <div style="height:${((maxGrade - g + 1) / maxGrade) * 60}px; width:20px; background:linear-gradient(to top, var(--cyan), var(--purple)); border-radius:3px 3px 0 0;"></div>
      `
        )
        .join('');

      trendHtml += `
        <div style="padding:var(--space-md); background:rgba(255,255,255,0.02); border-radius:var(--radius-md);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-sm);">
            <span style="font-weight:600;">${subject}</span>
            <span style="font-size:13px; color:${trendColor}; font-weight:600;">${trend}</span>
          </div>
          <div style="display:flex; gap:4px; align-items:flex-end; height:60px;">
            ${bars}
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:4px;">
            ${grades.map((g) => g + '등급').join(' → ')}
          </div>
        </div>
      `;
    });

    if (!trendHtml) {
      trendHtml = Components.emptyState('', '과목별 추세를 분석하려면 같은 과목의 성적이 2건 이상 필요합니다.');
    }

    // Overall summary
    const allGrades = exams.filter((e) => e.grade).map((e) => parseFloat(e.grade));
    const avg = (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2);
    const best = Math.min(...allGrades);
    const worst = Math.max(...allGrades);

    return `
      <div class="stat-grid" style="margin-bottom:var(--space-md);">
        <div class="stat-card cyan">
          <div class="stat-value font-en">${avg}</div>
          <div class="stat-label">전체 평균 등급</div>
        </div>
        <div class="stat-card green">
          <div class="stat-value font-en">${best}</div>
          <div class="stat-label">최고 등급</div>
        </div>
        <div class="stat-card gold">
          <div class="stat-value font-en">${worst}</div>
          <div class="stat-label">최저 등급</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-value font-en">${exams.length}</div>
          <div class="stat-label">총 시험 건수</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">과목별 등급 추세</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:var(--space-md);">
          ${trendHtml}
        </div>
      </div>
    `;
  }

  // ---- Modal: Add/Edit Exam ----
  function showAddExam() {
    const grade = JarvisData.getCurrentGrade();
    const semester = JarvisData.getCurrentSemester();
    const currentYear = new Date().getFullYear();

    Components.showModal(
      '시험 성적 추가',
      `
        <div class="form-group">
          <label class="form-label">학년도</label>
          <input type="number" class="form-input" id="exam-year" value="${currentYear}" min="2026" max="2035">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">학기</label>
            <select class="form-input" id="exam-semester">
              <option value="1학기" ${semester === '1학기' ? 'selected' : ''}>1학기</option>
              <option value="2학기" ${semester === '2학기' ? 'selected' : ''}>2학기</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">시험유형</label>
            <select class="form-input" id="exam-type">
              <option value="중간고사">중간고사</option>
              <option value="기말고사">기말고사</option>
              <option value="모의고사">모의고사</option>
              <option value="수능">수능</option>
              <option value="기타">기타</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">과목</label>
          <input type="text" class="form-input" id="exam-subject" placeholder="예: 수학, 영어, 과학">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">점수</label>
            <input type="number" class="form-input" id="exam-score" placeholder="100" min="0" max="100">
          </div>
          <div class="form-group">
            <label class="form-label">등급</label>
            <select class="form-input" id="exam-grade">
              <option value="">선택</option>
              ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}">${g}등급</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">석차 (선택)</label>
          <input type="text" class="form-input" id="exam-rank" placeholder="예: 3/120">
        </div>
        <div class="form-group">
          <label class="form-label">메모 (선택)</label>
          <textarea class="form-input" id="exam-memo" placeholder="시험 관련 메모"></textarea>
        </div>
      `,
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="AcademicsView.saveExam()">저장</button>
      `
    );
  }

  function saveExam(editId) {
    const exam = {
      year: document.getElementById('exam-year').value,
      semester: document.getElementById('exam-semester').value,
      examType: document.getElementById('exam-type').value,
      subject: document.getElementById('exam-subject').value,
      score: document.getElementById('exam-score').value,
      grade: document.getElementById('exam-grade').value,
      rank: document.getElementById('exam-rank').value,
      memo: document.getElementById('exam-memo').value,
    };

    if (!exam.subject) {
      Components.showToast('과목을 입력해주세요.', 'warning');
      return;
    }

    if (editId) {
      JarvisData.updateExam(editId, exam);
      Components.showToast('시험 성적이 수정되었습니다.', 'success');
    } else {
      JarvisData.addExam(exam);
      Components.showToast('시험 성적이 추가되었습니다.', 'success');
    }

    Components.closeModal();
    JarvisApp.navigateTo('academics');
  }

  function showEditExam(id) {
    const exam = JarvisData.getExams().find((e) => e.id === id);
    if (!exam) return;

    Components.showModal(
      '시험 성적 수정',
      `
        <div class="form-group">
          <label class="form-label">학년도</label>
          <input type="number" class="form-input" id="exam-year" value="${exam.year || ''}" min="2026" max="2035">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">학기</label>
            <select class="form-input" id="exam-semester">
              <option value="1학기" ${exam.semester === '1학기' ? 'selected' : ''}>1학기</option>
              <option value="2학기" ${exam.semester === '2학기' ? 'selected' : ''}>2학기</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">시험유형</label>
            <select class="form-input" id="exam-type">
              <option value="중간고사" ${exam.examType === '중간고사' ? 'selected' : ''}>중간고사</option>
              <option value="기말고사" ${exam.examType === '기말고사' ? 'selected' : ''}>기말고사</option>
              <option value="모의고사" ${exam.examType === '모의고사' ? 'selected' : ''}>모의고사</option>
              <option value="수능" ${exam.examType === '수능' ? 'selected' : ''}>수능</option>
              <option value="기타" ${exam.examType === '기타' ? 'selected' : ''}>기타</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">과목</label>
          <input type="text" class="form-input" id="exam-subject" value="${exam.subject || ''}">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">점수</label>
            <input type="number" class="form-input" id="exam-score" value="${exam.score || ''}" min="0" max="100">
          </div>
          <div class="form-group">
            <label class="form-label">등급</label>
            <select class="form-input" id="exam-grade">
              <option value="">선택</option>
              ${[1,2,3,4,5,6,7,8,9].map(g => `<option value="${g}" ${exam.grade == g ? 'selected' : ''}>${g}등급</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">석차 (선택)</label>
          <input type="text" class="form-input" id="exam-rank" value="${exam.rank || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">메모 (선택)</label>
          <textarea class="form-input" id="exam-memo">${exam.memo || ''}</textarea>
        </div>
      `,
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="AcademicsView.saveExam('${id}')">수정</button>
      `
    );
  }

  function confirmDeleteExam(id) {
    Components.showConfirm('이 시험 성적을 삭제하시겠습니까?', () => {
      JarvisData.deleteExam(id);
      Components.showToast('시험 성적이 삭제되었습니다.', 'info');
      JarvisApp.navigateTo('academics');
    });
  }

  function setTab(tab) {
    currentTab = tab;
    JarvisApp.navigateTo('academics');
  }

  return {
    render,
    setTab,
    showAddExam,
    showEditExam,
    saveExam,
    confirmDeleteExam,
  };
})();
