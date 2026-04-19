/* ============================================
   JARVIS-Yooha — Main App & Router
   ============================================ */

const JarvisApp = (() => {
  let currentView = 'dashboard';

  const VIEWS = {
    dashboard: { render: () => DashboardView.render(),  icon: '🎯', label: '대시보드' },
    academics: { render: () => AcademicsView.render(),  icon: '📊', label: '학업' },
    portfolio: { render: () => PortfolioView.render(),  icon: '📁', label: '포트폴리오' },
    programs:  { render: () => ProgramsView.render(),   icon: '🏆', label: '프로그램' },
    schedule:  { render: () => ScheduleView.render(),   icon: '⏰', label: '스케줄' },
    strategy:  { render: () => StrategyView.render(),   icon: '🧠', label: '전략' },
    feedback:  { render: () => FeedbackView.render(),   icon: '💬', label: '피드백' },
  };

  async function init(skipAuthCheck = false) {
    if (!skipAuthCheck) {
      document.getElementById('app').innerHTML = `<div style="height:100vh; display:flex; align-items:center; justify-content:center;"><div class="spinner"></div></div>`;
      const user = await Auth.checkSession();
      if (!user) {
        Auth.renderLogin();
        return;
      }
    }

    try {
      await JarvisData.syncFromSupabase();
    } catch(err) {
      console.warn("Supabase Sync skipped or failed");
    }
    // Check hash for initial view
    const hash = window.location.hash.replace('#', '');
    if (VIEWS[hash]) currentView = hash;

    renderShell();
    navigateTo(currentView);

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      if (VIEWS[h]) navigateTo(h);
    });
  }

  function renderShell() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <!-- Sidebar -->
      <nav class="sidebar" id="sidebar">
        <div class="sidebar-logo" title="Claire's Dashboard">C</div>
        <div class="sidebar-nav">
          ${Object.entries(VIEWS)
            .map(
              ([key, v]) => `
            <button class="nav-item ${currentView === key ? 'active' : ''}" data-view="${key}" onclick="JarvisApp.navigateTo('${key}')">
              <span class="nav-icon">${v.icon}</span>
              <span class="nav-label">${v.label}</span>
            </button>
          `
            )
            .join('')}
        </div>
        <div class="sidebar-bottom">
          <button class="nav-item" onclick="JarvisApp.showSettings()" title="설정">
            <span class="nav-icon">⚙️</span>
            <span class="nav-label">설정</span>
          </button>
          <button class="nav-item" onclick="Auth.logout()" title="로그아웃" style="margin-top:8px; color:var(--danger) !important;">
            <span class="nav-icon">🔒</span>
            <span class="nav-label">시스템 종료</span>
          </button>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content" id="main-content">
        <!-- Dynamic content -->
      </main>
    `;
  }

  function navigateTo(view) {
    if (!VIEWS[view]) return;
    currentView = view;
    window.location.hash = view;

    // Update nav active states
    document.querySelectorAll('.nav-item[data-view]').forEach((el) => {
      el.classList.toggle('active', el.dataset.view === view);
    });

    // Render view
    const main = document.getElementById('main-content');
    main.innerHTML = VIEWS[view].render();

    // Scroll to top
    main.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function showSettings() {
    const profile = JarvisData.getProfile();
    const data = JarvisData.getData();

    Components.showModal(
      '⚙️ 설정',
      `
        <h4 style="font-size:14px; color:var(--text-secondary); margin-bottom:var(--space-md);">프로필 정보</h4>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">이름</label>
            <input type="text" class="form-input" id="set-name" value="${profile.name}">
          </div>
          <div class="form-group">
            <label class="form-label">영문 이름</label>
            <input type="text" class="form-input" id="set-ename" value="${profile.englishName || ''}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">생년월일</label>
            <input type="date" class="form-input" id="set-birth" value="${profile.birthDate}">
          </div>
          <div class="form-group">
            <label class="form-label">현재 학년</label>
            <input type="text" class="form-input" value="${JarvisData.getCurrentGrade()}" readonly style="opacity:0.6;">
          </div>
        </div>

        <h4 style="font-size:14px; color:var(--text-secondary); margin:var(--space-lg) 0 var(--space-md);">목표 설정</h4>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">목표 대학</label>
            <input type="text" class="form-input" id="set-univ" value="${profile.targetUniversity}">
          </div>
          <div class="form-group">
            <label class="form-label">목표 학과</label>
            <input type="text" class="form-input" id="set-dept" value="${profile.targetDepartment}">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">입시 연도</label>
            <input type="number" class="form-input" id="set-year" value="${profile.targetYear}" min="2030" max="2040">
          </div>
          <div class="form-group">
            <label class="form-label">D-Day 기준일</label>
            <input type="date" class="form-input" id="set-dday" value="${profile.ddayDate}">
          </div>
        </div>

        <h4 style="font-size:14px; color:var(--text-secondary); margin:var(--space-lg) 0 var(--space-md);">데이터 관리</h4>
        <div style="display:flex; gap:var(--space-sm); flex-wrap:wrap;">
          <button class="btn btn-secondary btn-sm" onclick="JarvisData.exportJSON()">📤 JSON 내보내기</button>
          <label class="btn btn-secondary btn-sm" style="cursor:pointer;">
            📥 JSON 가져오기
            <input type="file" accept=".json" style="display:none;" onchange="Components.handleImport(event)">
          </label>
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:var(--space-sm);">
          마지막 업데이트: ${Components.formatDate(data.settings.lastUpdated)}<br>
          시험 ${data.exams?.length || 0}건 · 포트폴리오 ${data.portfolio?.length || 0}건 · 학원 ${data.academies?.length || 0}건
        </div>
      `,
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="JarvisApp.saveSettings()">저장</button>
      `
    );
  }

  function saveSettings() {
    JarvisData.updateProfile({
      name: document.getElementById('set-name').value,
      englishName: document.getElementById('set-ename').value,
      birthDate: document.getElementById('set-birth').value,
      targetUniversity: document.getElementById('set-univ').value,
      targetDepartment: document.getElementById('set-dept').value,
      targetYear: parseInt(document.getElementById('set-year').value),
      ddayDate: document.getElementById('set-dday').value,
    });
    Components.closeModal();
    Components.showToast('설정이 저장되었습니다.', 'success');
    navigateTo(currentView);
  }

  return {
    init,
    navigateTo,
    showSettings,
    saveSettings,
    get currentView() { return currentView; },
  };
})();

// Boot
document.addEventListener('DOMContentLoaded', () => JarvisApp.init());
