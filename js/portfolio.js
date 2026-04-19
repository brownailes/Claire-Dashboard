/* ============================================
   JARVIS-Yooha — Portfolio Module
   ============================================ */

const PortfolioView = (() => {
  let currentCategory = 'all';

  const CATEGORIES = [
    { key: 'all', label: '전체', icon: '📁' },
    { key: 'sespec', label: '세특', icon: '🔬' },
    { key: 'volunteer', label: '봉사활동', icon: '🏥' },
    { key: 'club', label: '동아리', icon: '🎭' },
    { key: 'competition', label: '공모전/대회', icon: '🏆' },
    { key: 'reading', label: '독서', icon: '📖' },
    { key: 'other', label: '기타활동', icon: '🌐' },
  ];

  function render() {
    const items = JarvisData.getPortfolio(currentCategory);
    const allItems = JarvisData.getPortfolio();

    // Category counts
    const counts = {};
    allItems.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return `
      <div class="page-header">
        <div>
          <h1 class="page-title">Portfolio</h1>
          <p class="page-subtitle">비교과 활동 · 세특 · 봉사 · 동아리 · 공모전 · 독서</p>
        </div>
        <button class="btn btn-primary" onclick="PortfolioView.showAdd()">+ 활동 추가</button>
      </div>

      <!-- Category Tabs -->
      <div class="tab-nav">
        ${CATEGORIES.map(
          (c) => `
          <button class="tab-item ${currentCategory === c.key ? 'active' : ''}" onclick="PortfolioView.setCategory('${c.key}')">
            ${c.icon} ${c.label}
            ${c.key !== 'all' && counts[c.key] ? `<span style="margin-left:4px; opacity:0.6;">(${counts[c.key]})</span>` : ''}
            ${c.key === 'all' ? `<span style="margin-left:4px; opacity:0.6;">(${allItems.length})</span>` : ''}
          </button>
        `
        ).join('')}
      </div>

      <!-- Category Stats -->
      <div class="stat-grid" style="margin-bottom:var(--space-md);">
        <div class="stat-card cyan">
          <div class="stat-icon">🔬</div>
          <div class="stat-value font-en">${counts['sespec'] || 0}</div>
          <div class="stat-label">세특 기록</div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">🏥</div>
          <div class="stat-value font-en">${counts['volunteer'] || 0}</div>
          <div class="stat-label">봉사활동</div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon">🎭</div>
          <div class="stat-value font-en">${counts['club'] || 0}</div>
          <div class="stat-label">동아리</div>
        </div>
        <div class="stat-card gold">
          <div class="stat-icon">🏆</div>
          <div class="stat-value font-en">${counts['competition'] || 0}</div>
          <div class="stat-label">공모전/대회</div>
        </div>
      </div>

      <!-- Portfolio Items -->
      <div class="card">
        ${items.length === 0
          ? Components.emptyState('📁', '이 카테고리에 등록된 활동이 없습니다.', '<button class="btn btn-primary btn-sm" onclick="PortfolioView.showAdd()">활동 추가하기</button>')
          : renderPortfolioList(items)}
      </div>
    `;
  }

  function renderPortfolioList(items) {
    return items
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(
        (item) => `
      <div style="display:flex; gap:var(--space-md); padding:var(--space-md); border-bottom:1px solid rgba(255,255,255,0.03); align-items:flex-start;">
        <div style="flex:1;">
          <div style="display:flex; align-items:center; gap:var(--space-sm); margin-bottom:4px; flex-wrap:wrap;">
            ${Components.categoryTag(item.category)}
            <span style="font-weight:600; font-size:15px;">${item.title}</span>
            ${item.importance === 'high' ? '<span class="tag tag-red">중요</span>' : ''}
          </div>
          <div style="font-size:13px; color:var(--text-secondary); margin-bottom:6px;">
            ${item.period || ''} ${item.role ? '· ' + item.role : ''}
          </div>
          <div style="font-size:13px; color:var(--text-secondary); line-height:1.6;">
            ${item.description || ''}
          </div>
          ${item.evaluationMapping ? `
            <div style="margin-top:8px;">
              <span class="tag tag-cyan" style="font-size:10px;">${item.evaluationMapping}</span>
            </div>
          ` : ''}
        </div>
        <div style="display:flex; gap:4px; flex-shrink:0;">
          <button class="btn-icon" onclick="PortfolioView.showEdit('${item.id}')" title="수정">편집</button>
          <button class="btn-icon" onclick="PortfolioView.confirmDelete('${item.id}')" title="삭제">삭제</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  // ---- Modal: Add/Edit ----
  function showAdd() {
    Components.showModal(
      '활동 추가',
      getFormHtml(),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="PortfolioView.save()">저장</button>
      `
    );
  }

  function showEdit(id) {
    const item = JarvisData.getPortfolio().find((p) => p.id === id);
    if (!item) return;

    Components.showModal(
      '활동 수정',
      getFormHtml(item),
      `
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="PortfolioView.save('${id}')">수정</button>
      `
    );
  }

  function getFormHtml(item = {}) {
    return `
      <div class="form-group">
        <label class="form-label">카테고리</label>
        <select class="form-input" id="pf-category">
          ${CATEGORIES.filter((c) => c.key !== 'all')
            .map(
              (c) => `<option value="${c.key}" ${item.category === c.key ? 'selected' : ''}>${c.icon} ${c.label}</option>`
            )
            .join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">활동명</label>
        <input type="text" class="form-input" id="pf-title" value="${item.title || ''}" placeholder="예: 과학탐구 보고서 - 세포분열 심화탐구">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">활동 기간</label>
          <input type="text" class="form-input" id="pf-period" value="${item.period || ''}" placeholder="예: 2026.04 ~ 2026.06">
        </div>
        <div class="form-group">
          <label class="form-label">역할</label>
          <input type="text" class="form-input" id="pf-role" value="${item.role || ''}" placeholder="예: 팀장, 발표자">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">활동 내용</label>
        <textarea class="form-input" id="pf-desc" rows="4" placeholder="활동 내용을 상세히 기록하세요.">${item.description || ''}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">서울대 평가 매핑</label>
          <select class="form-input" id="pf-eval">
            <option value="">선택</option>
            <option value="학업능력" ${item.evaluationMapping === '학업능력' ? 'selected' : ''}>학업능력</option>
            <option value="학업태도" ${item.evaluationMapping === '학업태도' ? 'selected' : ''}>학업태도</option>
            <option value="학업 외 소양" ${item.evaluationMapping === '학업 외 소양' ? 'selected' : ''}>학업 외 소양</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">중요도</label>
          <select class="form-input" id="pf-importance">
            <option value="">보통</option>
            <option value="high" ${item.importance === 'high' ? 'selected' : ''}>⭐ 중요</option>
          </select>
        </div>
      </div>
    `;
  }

  function save(editId) {
    const item = {
      category: document.getElementById('pf-category').value,
      title: document.getElementById('pf-title').value,
      period: document.getElementById('pf-period').value,
      role: document.getElementById('pf-role').value,
      description: document.getElementById('pf-desc').value,
      evaluationMapping: document.getElementById('pf-eval').value,
      importance: document.getElementById('pf-importance').value,
    };

    if (!item.title) {
      Components.showToast('활동명을 입력해주세요.', 'warning');
      return;
    }

    if (editId) {
      JarvisData.updatePortfolio(editId, item);
      Components.showToast('활동이 수정되었습니다.', 'success');
    } else {
      JarvisData.addPortfolio(item);
      Components.showToast('활동이 추가되었습니다.', 'success');
    }

    Components.closeModal();
    JarvisApp.navigateTo('portfolio');
  }

  function confirmDelete(id) {
    Components.showConfirm('이 활동을 삭제하시겠습니까?', () => {
      JarvisData.deletePortfolio(id);
      Components.showToast('활동이 삭제되었습니다.', 'info');
      JarvisApp.navigateTo('portfolio');
    });
  }

  function setCategory(cat) {
    currentCategory = cat;
    JarvisApp.navigateTo('portfolio');
  }

  return { render, setCategory, showAdd, showEdit, save, confirmDelete };
})();
