/* ============================================
   JARVIS-Yooha — Programs (신청 프로그램) View
   ============================================ */

const ProgramsView = (() => {

  /* ── 편의 렌더 함수 ─────────────────────── */
  const statusMeta = {
    waiting:   { label: '신청 대기',   color: 'var(--accent-gold)',  icon: '⏳' },
    applied:   { label: '신청 완료',   color: 'var(--accent-cyan)',  icon: '✅' },
    accepted:  { label: '합격',        color: 'var(--accent-green)', icon: '🎉' },
    rejected:  { label: '미선발',      color: 'var(--tag-red)',      icon: '❌' },
    scheduled: { label: '일정 예정',   color: 'var(--text-muted)',   icon: '📅' },
  };

  const tagColor = {
    '서울대':  'cyan',
    '수의학':  'gold',
    '연구체험': 'green',
    '캠프':    'purple',
    '봉사':    'cyan',
    '정부지원': 'green',
  };

  function statusBadge(status) {
    const m = statusMeta[status] || statusMeta.scheduled;
    return `<span style="
      display:inline-flex; align-items:center; gap:4px;
      font-size:11px; font-weight:600; padding:3px 10px;
      border-radius:20px; white-space:nowrap;
      background:${m.color}22; color:${m.color}; border:1px solid ${m.color}55;">
      ${m.icon} ${m.label}
    </span>`;
  }

  function tagBadge(tag) {
    const color = tagColor[tag] || 'cyan';
    return `<span class="tag tag-${color}" style="font-size:11px; padding:2px 8px;">${tag}</span>`;
  }

  /* ── 마감 D-Day 계산 ─────────────────────── */
  function getDday(deadlineStr) {
    if (!deadlineStr) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dead = new Date(deadlineStr);
    dead.setHours(0, 0, 0, 0);
    const diff = Math.ceil((dead - today) / (1000 * 60 * 60 * 24));
    if (diff < 0)  return `<span style="color:var(--text-muted);">마감됨</span>`;
    if (diff === 0) return `<span style="color:var(--tag-red); font-weight:700;">D-Day!</span>`;
    if (diff <= 7)  return `<span style="color:var(--accent-gold); font-weight:700;">D-${diff}</span>`;
    return `<span style="color:var(--text-secondary);">D-${diff}</span>`;
  }

  /* ── 프로그램 카드 ─────────────────────── */
  function programCard(prog) {
    const dday = getDday(prog.applicationDeadline);
    const statusM = statusMeta[prog.status] || statusMeta.scheduled;
    const tags = (prog.tags || []).map(tagBadge).join('');

    return `
      <div class="card" style="border-left:3px solid ${statusM.color}; margin-bottom:var(--space-md);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:var(--space-md); flex-wrap:wrap;">
          <div style="flex:1; min-width:0;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:6px;">
              <span style="font-size:16px; font-weight:700; color:var(--text-primary); word-break:break-word;">${prog.name}</span>
              ${statusBadge(prog.status)}
            </div>
            <div style="font-size:12px; color:var(--text-secondary); margin-bottom:8px;">${prog.organizer || ''}</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">${tags}</div>
            <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${prog.description || ''}</div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px; min-width:120px;">
            ${dday ? `<div style="font-size:13px;">${dday}</div>` : ''}
            <div style="font-size:11px; color:var(--text-muted); text-align:right;">
              ${prog.applicationDeadline ? `신청 마감: ${prog.applicationDeadline}` : ''}
              ${prog.period ? `<br>진행 기간: ${prog.period}` : ''}
              ${prog.targetGrade ? `<br>대상: ${prog.targetGrade}` : ''}
            </div>
          </div>
        </div>

        ${prog.requirements ? `
          <div style="margin-top:10px; padding:10px; background:var(--bg-tertiary); border-radius:8px; font-size:12px; color:var(--text-secondary);">
            <strong style="color:var(--text-primary);">📋 지원 조건/준비물:</strong> ${prog.requirements}
          </div>` : ''}

        ${prog.memo ? `
          <div style="margin-top:8px; padding:8px 10px; background:var(--accent-gold)11; border-radius:8px; font-size:12px; color:var(--accent-gold);">
            💡 ${prog.memo}
          </div>` : ''}

        <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
          ${prog.url ? `<a href="${prog.url}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">공식 링크</a>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="ProgramsView.editProgram('${prog.id}')">수정</button>
          <button class="btn btn-secondary btn-sm" style="color:var(--tag-red);" onclick="ProgramsView.deleteProgram('${prog.id}')">삭제</button>
        </div>
      </div>
    `;
  }

  /* ── 메인 렌더 ─────────────────────── */
  function render() {
    const programs = JarvisData.getData().programs || [];

    // 상태 그룹핑: 신청 대기·일정 예정 → 우선 표시
    const priority = ['waiting', 'scheduled'];
    const active  = programs.filter(p => priority.includes(p.status));
    const done    = programs.filter(p => !priority.includes(p.status));

    const statsHtml = (() => {
      const total    = programs.length;
      const wait     = programs.filter(p => p.status === 'waiting').length;
      const applied  = programs.filter(p => p.status === 'applied').length;
      const accepted = programs.filter(p => p.status === 'accepted').length;
      return `
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(100px,1fr)); gap:var(--space-md); margin-bottom:var(--space-xl);">
          ${[
            { label:'전체',      val: total,    color:'var(--text-primary)' },
            { label:'신청 대기', val: wait,     color:'var(--accent-gold)'  },
            { label:'신청 완료', val: applied,  color:'var(--accent-cyan)'  },
            { label:'합격',      val: accepted, color:'var(--accent-green)' },
          ].map(s => `
            <div class="card" style="text-align:center; padding:var(--space-lg);">
              <div style="font-size:28px; font-weight:800; color:${s.color};">${s.val}</div>
              <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">${s.label}</div>
            </div>
          `).join('')}
        </div>
      `;
    })();

    const emptyHtml = `
      <div class="card" style="text-align:center; padding:var(--space-2xl); color:var(--text-muted);">
        <div style="font-size:48px; margin-bottom:var(--space-md);">📋</div>
        <div>등록된 프로그램이 없습니다.</div>
        <button class="btn btn-primary" style="margin-top:var(--space-lg);" onclick="ProgramsView.showAddModal()">프로그램 추가</button>
      </div>
    `;

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">프로그램 관리</h1>
          <p class="page-subtitle">신청 예정·진행 중인 대입 연계 프로그램을 한곳에서 추적합니다.</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="ProgramsView.showAddModal()">프로그램 추가</button>
        </div>
      </div>

      ${statsHtml}

      ${programs.length === 0 ? emptyHtml : `
        ${active.length > 0 ? `
          <div class="card-header" style="margin-bottom:var(--space-md);">
            <span class="card-title">신청 대기 / 일정 예정</span>
          </div>
          ${active.map(programCard).join('')}
        ` : ''}

        ${done.length > 0 ? `
          <div class="card-header" style="margin-top:var(--space-xl); margin-bottom:var(--space-md);">
            <span class="card-title">완료 / 결과</span>
          </div>
          ${done.map(programCard).join('')}
        ` : ''}
      `}
    `;
  }

  /* ── 추가/수정 모달 ─────────────────────── */
  function showAddModal(existing) {
    const p = existing || {};
    const isEdit = !!existing;
    Components.showModal(
      isEdit ? '편집 프로그램 수정' : '프로그램 추가',
      `
      <div class="form-group">
        <label class="form-label">프로그램명 <span style="color:var(--tag-red);">*</span></label>
        <input type="text" class="form-input" id="prg-name" value="${p.name || ''}" placeholder="예: 서울대 고교생 수의학 아카데미(고수아)">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">주관 기관</label>
          <input type="text" class="form-input" id="prg-org" value="${p.organizer || ''}" placeholder="예: 서울대학교 수의과대학">
        </div>
        <div class="form-group">
          <label class="form-label">대상 학년</label>
          <input type="text" class="form-input" id="prg-grade" value="${p.targetGrade || ''}" placeholder="예: 고1~고2">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">신청 마감일</label>
          <input type="date" class="form-input" id="prg-deadline" value="${p.applicationDeadline || ''}">
        </div>
        <div class="form-group">
          <label class="form-label">진행 기간</label>
          <input type="text" class="form-input" id="prg-period" value="${p.period || ''}" placeholder="예: 2026.08.07~08.08">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">상태</label>
        <select class="form-input" id="prg-status">
          ${Object.entries(statusMeta).map(([val, m]) => `
            <option value="${val}" ${(p.status || 'scheduled') === val ? 'selected' : ''}>${m.icon} ${m.label}</option>
          `).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">설명</label>
        <textarea class="form-input" id="prg-desc" rows="3" placeholder="프로그램 내용, 커리큘럼, 혜택 등">${p.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">지원 조건 / 준비물</label>
        <input type="text" class="form-input" id="prg-req" value="${p.requirements || ''}" placeholder="예: 고1~고2 재학생, 지원동기서 작성">
      </div>
      <div class="form-group">
        <label class="form-label">태그 (쉼표로 구분)</label>
        <input type="text" class="form-input" id="prg-tags" value="${(p.tags || []).join(', ')}" placeholder="예: 서울대, 수의학, 캠프">
      </div>
      <div class="form-group">
        <label class="form-label">공식 URL</label>
        <input type="url" class="form-input" id="prg-url" value="${p.url || ''}" placeholder="https://vet.snu.ac.kr/...">
      </div>
      <div class="form-group">
        <label class="form-label">메모 / 전략 노트</label>
        <input type="text" class="form-input" id="prg-memo" value="${p.memo || ''}" placeholder="예: 자기소개서에 탐구 경험 포함 필수">
      </div>
      `,
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="ProgramsView.saveProgram('${p.id || ''}')">
          ${isEdit ? '저장' : '추가'}
        </button>
      `
    );
  }

  function saveProgram(existingId) {
    const name = document.getElementById('prg-name').value.trim();
    if (!name) { Components.showToast('프로그램명을 입력하세요.', 'error'); return; }

    const tags = document.getElementById('prg-tags').value
      .split(',').map(t => t.trim()).filter(Boolean);

    const prog = {
      id: existingId || 'prg-' + Date.now(),
      name,
      organizer:           document.getElementById('prg-org').value.trim(),
      targetGrade:         document.getElementById('prg-grade').value.trim(),
      applicationDeadline: document.getElementById('prg-deadline').value,
      period:              document.getElementById('prg-period').value.trim(),
      status:              document.getElementById('prg-status').value,
      description:         document.getElementById('prg-desc').value.trim(),
      requirements:        document.getElementById('prg-req').value.trim(),
      tags,
      url:                 document.getElementById('prg-url').value.trim(),
      memo:                document.getElementById('prg-memo').value.trim(),
    };

    const data = JarvisData.getData();
    if (!data.programs) data.programs = [];

    if (existingId) {
      const idx = data.programs.findIndex(p => p.id === existingId);
      if (idx !== -1) data.programs[idx] = prog;
      else data.programs.push(prog);
    } else {
      data.programs.push(prog);
    }

    JarvisData.save(data);
    Components.closeModal();
    Components.showToast(existingId ? '수정되었습니다.' : '프로그램이 추가되었습니다.', 'success');
    JarvisApp.navigateTo('programs');
  }

  function editProgram(id) {
    const prog = (JarvisData.getData().programs || []).find(p => p.id === id);
    if (prog) showAddModal(prog);
  }

  function deleteProgram(id) {
    if (!confirm('이 프로그램을 삭제하시겠습니까?')) return;
    const data = JarvisData.getData();
    data.programs = (data.programs || []).filter(p => p.id !== id);
    JarvisData.save(data);
    Components.showToast('삭제되었습니다.', 'success');
    JarvisApp.navigateTo('programs');
  }

  return { render, showAddModal, saveProgram, editProgram, deleteProgram };
})();
