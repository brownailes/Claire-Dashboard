/* ============================================
   JARVIS-Yooha — Schedule Module
   ============================================ */

const ScheduleView = (() => {
  let currentTab = 'weekly';

  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 ~ 21:00

  function render() {
    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Schedule</h1>
          <p class="page-subtitle">주간 시간표 · 학원 관리</p>
        </div>
        <div style="display:flex; gap:var(--space-sm);">
          <button class="btn btn-primary" onclick="ScheduleView.showAddSchedule()">+ 일정 추가</button>
          <button class="btn btn-secondary" onclick="ScheduleView.showAddAcademy()">+ 학원 추가</button>
        </div>
      </div>

      <div class="tab-nav">
        <button class="tab-item ${currentTab === 'weekly' ? 'active' : ''}" onclick="ScheduleView.setTab('weekly')">📅 주간 시간표</button>
        <button class="tab-item ${currentTab === 'academies' ? 'active' : ''}" onclick="ScheduleView.setTab('academies')">🏫 학원 관리</button>
      </div>

      ${currentTab === 'weekly' ? renderWeekly() : renderAcademies()}
    `;
  }

  // ---- Weekly Timetable ----
  function renderWeekly() {
    const schedules = JarvisData.getSchedules();

    if (schedules.length === 0) {
      return `
        <div class="card">
          ${Components.emptyState('📅', '등록된 주간 일정이 없습니다.', '<button class="btn btn-primary btn-sm" onclick="ScheduleView.showAddSchedule()">일정 추가하기</button>')}
        </div>
      `;
    }

    // Build a map: day -> hour -> schedule items
    const grid = {};
    DAYS.forEach((d) => (grid[d] = {}));

    schedules.forEach((s) => {
      if (!s.dayOfWeek || !s.startTime) return;
      const startHour = parseInt(s.startTime.split(':')[0]);
      const endHour = s.endTime ? parseInt(s.endTime.split(':')[0]) : startHour + 1;
      for (let h = startHour; h < endHour; h++) {
        if (!grid[s.dayOfWeek][h]) grid[s.dayOfWeek][h] = [];
        grid[s.dayOfWeek][h].push(s);
      }
    });

    const typeColors = {
      school: 'var(--cyan)',
      academy: 'var(--gold)',
      study: 'var(--green)',
      other: 'var(--purple)',
    };

    return `
      <div class="card" style="overflow-x:auto;">
        <div class="card-header">
          <span class="card-title">주간 시간표</span>
          <div style="display:flex; gap:var(--space-md); font-size:11px;">
            <span style="color:var(--cyan);">■ 학교</span>
            <span style="color:var(--gold);">■ 학원</span>
            <span style="color:var(--green);">■ 자습</span>
            <span style="color:var(--purple);">■ 기타</span>
          </div>
        </div>
        <table class="data-table" style="min-width:700px; table-layout: fixed; width: 100%;">
          <thead>
            <tr>
              <th style="width:60px;">시간</th>
              ${DAYS.map((d) => `<th style="text-align:center; width:calc((100% - 60px) / 7);">${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${HOURS.map(
              (h) => `
              <tr>
                <td class="font-mono text-muted" style="font-size:12px;">${h}:00</td>
                ${DAYS.map((d) => {
                  const items = grid[d][h] || [];
                  if (items.length === 0) return '<td></td>';
                  const item = items[0];
                  const color = typeColors[item.type] || 'var(--cyan)';
                  return `
                    <td style="padding:4px;">
                      <div style="background:${color}15; border-left:3px solid ${color}; padding:4px 8px; border-radius:4px; cursor:pointer; font-size:12px;"
                           onclick="ScheduleView.showEditSchedule('${item.id}')">
                        <div style="font-weight:500; color:${color};">${item.name}</div>
                        ${item.location ? `<div style="font-size:10px; color:var(--text-muted);">${item.location}</div>` : ''}
                      </div>
                    </td>
                  `;
                }).join('')}
              </tr>
            `
            ).join('')}
          </tbody>
        </table>
      </div>

      <!-- Schedule List -->
      <div class="card" style="margin-top:var(--space-md);">
        <div class="card-header">
          <span class="card-title">일정 목록</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>일정명</th>
              <th>유형</th>
              <th>요일</th>
              <th>시간</th>
              <th>장소</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            ${schedules.map(s => `
              <tr>
                <td style="font-weight:500;">${s.name}</td>
                <td><span class="tag tag-${s.type === 'school' ? 'cyan' : s.type === 'academy' ? 'gold' : s.type === 'study' ? 'green' : 'purple'}">${s.type === 'school' ? '학교' : s.type === 'academy' ? '학원' : s.type === 'study' ? '자습' : '기타'}</span></td>
                <td>${s.dayOfWeek || '-'}</td>
                <td class="font-mono">${s.startTime || ''} ~ ${s.endTime || ''}</td>
                <td class="text-secondary">${s.location || '-'}</td>
                <td>
                  <div style="display:flex; gap:4px;">
                    <button class="btn-icon" onclick="ScheduleView.showEditSchedule('${s.id}')" title="수정">편집</button>
                    <button class="btn-icon" onclick="ScheduleView.confirmDeleteSchedule('${s.id}')" title="삭제">삭제</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---- Academies Tab ----
  function renderAcademies() {
    const academies = JarvisData.getAcademies();

    if (academies.length === 0) {
      return `
        <div class="card">
          ${Components.emptyState('🏫', '등록된 학원이 없습니다.', '<button class="btn btn-primary btn-sm" onclick="ScheduleView.showAddAcademy()">학원 추가하기</button>')}
        </div>
      `;
    }

    const totalCost = academies.reduce((sum, a) => sum + (parseInt(a.cost) || 0), 0);

    return `
      <div class="stat-grid" style="margin-bottom:var(--space-md);">
        <div class="stat-card gold">
          <div class="stat-icon">🏫</div>
          <div class="stat-value font-en">${academies.length}</div>
          <div class="stat-label">등록 학원 수</div>
        </div>
        <div class="stat-card cyan">
          <div class="stat-icon">💰</div>
          <div class="stat-value font-en">${Components.formatNumber(totalCost)}</div>
          <div class="stat-label">월 학원비 (원)</div>
        </div>
      </div>

      <div class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>학원명</th>
              <th>과목</th>
              <th>강사</th>
              <th>월 비용</th>
              <th>연락처</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            ${academies.map(a => `
              <tr>
                <td style="font-weight:600;">${a.name}</td>
                <td><span class="tag tag-cyan">${a.subject || '-'}</span></td>
                <td class="text-secondary">${a.instructor || '-'}</td>
                <td class="font-mono">${a.cost ? Components.formatNumber(a.cost) + '원' : '-'}</td>
                <td class="font-mono text-secondary">${a.contact || '-'}</td>
                <td>
                  <div style="display:flex; gap:4px;">
                    <button class="btn-icon" onclick="ScheduleView.showEditAcademy('${a.id}')" title="수정">편집</button>
                    <button class="btn-icon" onclick="ScheduleView.confirmDeleteAcademy('${a.id}')" title="삭제">삭제</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ---- Schedule Modal ----
  function showAddSchedule() {
    Components.showModal(
      '일정 추가',
      getScheduleFormHtml(),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="ScheduleView.saveSchedule()">저장</button>
      `
    );
  }

  function showEditSchedule(id) {
    const s = JarvisData.getSchedules().find((s) => s.id === id);
    if (!s) return;
    Components.showModal(
      '일정 수정',
      getScheduleFormHtml(s),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="ScheduleView.saveSchedule('${id}')">수정</button>
      `
    );
  }

  function getScheduleFormHtml(s = {}) {
    return `
      <div class="form-group">
        <label class="form-label">일정명</label>
        <input type="text" class="form-input" id="sch-name" value="${s.name || ''}" placeholder="예: 수학 학원, 영어 자습">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">유형</label>
          <select class="form-input" id="sch-type">
            <option value="school" ${s.type === 'school' ? 'selected' : ''}>🏫 학교</option>
            <option value="academy" ${s.type === 'academy' ? 'selected' : ''}>📚 학원</option>
            <option value="study" ${s.type === 'study' ? 'selected' : ''}>✍️ 자습</option>
            <option value="other" ${s.type === 'other' ? 'selected' : ''}>🌐 기타</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">요일</label>
          <select class="form-input" id="sch-day">
            ${DAYS.map((d) => `<option value="${d}" ${s.dayOfWeek === d ? 'selected' : ''}>${d}요일</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">시작 시간</label>
          <input type="time" class="form-input" id="sch-start" value="${s.startTime || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">종료 시간</label>
          <input type="time" class="form-input" id="sch-end" value="${s.endTime || ''}">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">장소 (선택)</label>
        <input type="text" class="form-input" id="sch-location" value="${s.location || ''}" placeholder="예: 대치동 OO학원">
      </div>
    `;
  }

  function saveSchedule(editId) {
    const s = {
      name: document.getElementById('sch-name').value,
      type: document.getElementById('sch-type').value,
      dayOfWeek: document.getElementById('sch-day').value,
      startTime: document.getElementById('sch-start').value,
      endTime: document.getElementById('sch-end').value,
      location: document.getElementById('sch-location').value,
    };

    if (!s.name) {
      Components.showToast('일정명을 입력해주세요.', 'warning');
      return;
    }

    if (editId) {
      JarvisData.updateSchedule(editId, s);
      Components.showToast('일정이 수정되었습니다.', 'success');
    } else {
      JarvisData.addSchedule(s);
      Components.showToast('일정이 추가되었습니다.', 'success');
    }

    Components.closeModal();
    JarvisApp.navigateTo('schedule');
  }

  function confirmDeleteSchedule(id) {
    Components.showConfirm('이 일정을 삭제하시겠습니까?', () => {
      JarvisData.deleteSchedule(id);
      Components.showToast('일정이 삭제되었습니다.', 'info');
      JarvisApp.navigateTo('schedule');
    });
  }

  // ---- Academy Modal ----
  function showAddAcademy() {
    Components.showModal(
      '학원 추가',
      getAcademyFormHtml(),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="ScheduleView.saveAcademy()">저장</button>
      `
    );
  }

  function showEditAcademy(id) {
    const a = JarvisData.getAcademies().find((a) => a.id === id);
    if (!a) return;
    Components.showModal(
      '학원 수정',
      getAcademyFormHtml(a),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="ScheduleView.saveAcademy('${id}')">수정</button>
      `
    );
  }

  function getAcademyFormHtml(a = {}) {
    return `
      <div class="form-group">
        <label class="form-label">학원명</label>
        <input type="text" class="form-input" id="acad-name" value="${a.name || ''}" placeholder="예: OO수학학원">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">과목</label>
          <input type="text" class="form-input" id="acad-subject" value="${a.subject || ''}" placeholder="예: 수학">
        </div>
        <div class="form-group">
          <label class="form-label">강사명</label>
          <input type="text" class="form-input" id="acad-instructor" value="${a.instructor || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">월 수강료 (원)</label>
          <input type="number" class="form-input" id="acad-cost" value="${a.cost || ''}" placeholder="300000">
        </div>
        <div class="form-group">
          <label class="form-label">연락처</label>
          <input type="text" class="form-input" id="acad-contact" value="${a.contact || ''}" placeholder="010-XXXX-XXXX">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">메모 (선택)</label>
        <textarea class="form-input" id="acad-memo">${a.memo || ''}</textarea>
      </div>
    `;
  }

  function saveAcademy(editId) {
    const a = {
      name: document.getElementById('acad-name').value,
      subject: document.getElementById('acad-subject').value,
      instructor: document.getElementById('acad-instructor').value,
      cost: document.getElementById('acad-cost').value,
      contact: document.getElementById('acad-contact').value,
      memo: document.getElementById('acad-memo').value,
    };

    if (!a.name) {
      Components.showToast('학원명을 입력해주세요.', 'warning');
      return;
    }

    if (editId) {
      JarvisData.updateAcademy(editId, a);
      Components.showToast('학원 정보가 수정되었습니다.', 'success');
    } else {
      JarvisData.addAcademy(a);
      Components.showToast('학원이 추가되었습니다.', 'success');
    }

    Components.closeModal();
    JarvisApp.navigateTo('schedule');
  }

  function confirmDeleteAcademy(id) {
    Components.showConfirm('이 학원을 삭제하시겠습니까?', () => {
      JarvisData.deleteAcademy(id);
      Components.showToast('학원이 삭제되었습니다.', 'info');
      JarvisApp.navigateTo('schedule');
    });
  }

  function setTab(tab) {
    currentTab = tab;
    JarvisApp.navigateTo('schedule');
  }

  return {
    render,
    setTab,
    showAddSchedule,
    showEditSchedule,
    saveSchedule,
    confirmDeleteSchedule,
    showAddAcademy,
    showEditAcademy,
    saveAcademy,
    confirmDeleteAcademy,
  };
})();
