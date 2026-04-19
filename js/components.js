/* ============================================
   JARVIS-Yooha — Shared UI Components
   ============================================ */

const Components = (() => {
  // ---- Modal ----
  function showModal(title, bodyHtml, footerHtml) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title">${title}</h3>
          <button class="modal-close" onclick="Components.closeModal()" aria-label="닫기">&times;</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
      </div>
    `;
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
  }

  function closeModal() {
    const existing = document.getElementById('modal-overlay');
    if (existing) existing.remove();
  }

  // ---- Toast ----
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const colors = {
      success: 'var(--green)',
      error: 'var(--red)',
      info: 'var(--cyan)',
      warning: 'var(--gold)',
    };
    const icons = {
      success: '',
      error: '',
      info: 'ℹ',
      warning: '',
    };

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: var(--bg-secondary);
      border: 1px solid ${colors[type]};
      color: var(--text-primary);
      padding: 12px 24px;
      border-radius: var(--radius-md);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.4);
      z-index: 2000;
      opacity: 0;
      transition: all 0.3s ease;
    `;
    toast.innerHTML = `<span style="color:${colors[type]};font-weight:700;">${icons[type]}</span> ${message}`;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  // ---- Confirm Dialog ----
  function showConfirm(message, onConfirm) {
    showModal(
      '확인',
      `<p style="font-size:15px; color:var(--text-secondary);">${message}</p>`,
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-danger" id="confirm-yes-btn">삭제</button>
      `
    );
    document.getElementById('confirm-yes-btn').addEventListener('click', () => {
      closeModal();
      onConfirm();
    });
  }

  // ---- Grade Badge ----
  function gradeBadge(grade) {
    const g = parseInt(grade) || 0;
    const cls = g >= 1 && g <= 9 ? `grade-${g}` : '';
    return `<span class="grade-badge ${cls}">${grade || '-'}</span>`;
  }

  // ---- Category Tag ----
  function categoryTag(category) {
    const map = {
      sespec: { label: '세특', color: 'cyan' },
      volunteer: { label: '봉사활동', color: 'green' },
      club: { label: '동아리', color: 'purple' },
      competition: { label: '공모전/대회', color: 'gold' },
      reading: { label: '독서', color: 'magenta' },
      other: { label: '기타활동', color: 'cyan' },
    };
    const info = map[category] || { label: category, color: 'cyan' };
    return `<span class="tag tag-${info.color}">${info.label}</span>`;
  }

  // ---- Empty State ----
  function emptyState(icon, message, actionHtml = '') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">${icon}</div>
        <div class="empty-state-message">${message}</div>
        ${actionHtml}
      </div>
    `;
  }

  // ---- Format Date ----
  function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }

  function formatRelativeTime(dateStr) {
    if (!dateStr) return '';
    const now = new Date();
    const d = new Date(dateStr);
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return '방금 전';
    if (mins < 60) return `${mins}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return formatDate(dateStr);
  }

  // ---- Format Number ----
  function formatNumber(num) {
    if (num === null || num === undefined) return '-';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // ---- Data Bar (Export/Import UI) ----
  function dataBar() {
    return `
      <div class="data-bar">
        <span class="data-bar-label"> 데이터 동기화</span>
        <button class="btn btn-sm btn-secondary" onclick="JarvisData.exportJSON()"> 내보내기</button>
        <label class="btn btn-sm btn-secondary" style="cursor:pointer;">
           가져오기
          <input type="file" accept=".json" style="display:none;" onchange="Components.handleImport(event)">
        </label>
      </div>
    `;
  }

  function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;
    JarvisData.importJSON(file)
      .then(() => {
        showToast('데이터를 성공적으로 가져왔습니다!', 'success');
        // Reload current view
        if (window.JarvisApp) JarvisApp.navigateTo(JarvisApp.currentView);
      })
      .catch((err) => {
        showToast(err.message, 'error');
      });
    event.target.value = '';
  }

  // ---- Render Activity Feed ----
  function renderActivityFeed(limit = 8) {
    const acts = JarvisData.getActivities().slice(0, limit);
    if (acts.length === 0) {
      return emptyState('', '아직 활동 기록이 없습니다.');
    }
    return acts
      .map(
        (a) => `
      <div class="feed-item">
        <span class="feed-dot"></span>
        <div class="feed-content">
          <div class="feed-text">${a.message}</div>
          <div class="feed-time">${formatRelativeTime(a.timestamp)}</div>
        </div>
      </div>
    `
      )
      .join('');
  }

  return {
    showModal,
    closeModal,
    showToast,
    showConfirm,
    gradeBadge,
    categoryTag,
    emptyState,
    formatDate,
    formatRelativeTime,
    formatNumber,
    dataBar,
    handleImport,
    renderActivityFeed,
  };
})();
