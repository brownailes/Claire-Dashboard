/* ============================================
   JARVIS-Yooha — Feedback View
   ============================================ */

const FeedbackView = (() => {
  function render() {
    const feedbacks = JarvisData.getFeedbacks();
    const academies = JarvisData.getAcademies();

    let academyOptions = academies.map(a => `<option value="${a.name}">${a.name}</option>`).join('');
    if (!academyOptions) academyOptions = `<option value="수학 학원">수학 학원</option><option value="영어 학원">영어 학원</option><option value="기타">기타</option>`;

    let feedbackHTML = feedbacks.length > 0 ? feedbacks.map(f => {
      const dateStr = new Date(f.date).toLocaleDateString();
      return `
        <div class="card" style="margin-bottom:var(--space-sm); padding:16px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
              <span class="tag tag-purple">${f.academy}</span>
              <span style="font-size:13px; color:var(--text-muted); display:flex; align-items:center; gap:4px;">
                ${dateStr}
                <button class="btn btn-sm" style="padding:0; min-width:auto; height:auto; color:var(--text-muted); background:transparent;" onclick="FeedbackView.editDate('${f.id}', '${f.date.split('T')[0]}')" title="날짜 수정">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
              </span>
            </div>
            <button class="btn btn-sm" style="color:var(--danger); padding:0; background:transparent;" onclick="FeedbackView.deleteFeedback('${f.id}')">삭제</button>
          </div>
          <p style="font-size:14px; line-height:1.6; color:var(--text-secondary); white-space:pre-wrap; margin:0;">${f.content}</p>
        </div>
      `;
    }).join('') : `<div class="empty-state">등록된 학원 피드백이 없습니다.</div>`;

    return `
      <div class="page-header" style="margin-bottom:var(--space-md);">
        <div>
          <h1 class="page-title">학원 브리핑 (SMS)</h1>
          <p class="page-subtitle">담당 강사님이 보내주신 피드백 문자를 붙여넣기 하세요.</p>
        </div>
      </div>

      <div class="card" style="margin-bottom:var(--space-md); padding:20px;">
        <h3 style="margin-top:0; margin-bottom:12px; font-size:16px;">새 피드백 등록</h3>
        <div style="display:flex; gap:12px; margin-bottom:12px;">
          <select id="fb-academy" class="form-input" style="flex:1;">
            ${academyOptions}
          </select>
          <input type="date" id="fb-date" class="form-input" style="width:170px; padding:12px;" value="${new Date().toLocaleDateString('en-CA')}">
        </div>
        <textarea id="fb-content" class="form-input" rows="6" placeholder="여기에 SMS 문자를 복사해서 붙여넣으세요..." style="resize:vertical; margin-bottom:12px; line-height:1.5; font-size:14px;"></textarea>
        <div style="display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" onclick="FeedbackView.saveFeedback()">
            <span style="margin-right:6px;">💬</span> 피드백 저장
          </button>
        </div>
      </div>

      <div>
        <h3 style="margin-top:0; margin-bottom:16px; font-size:18px;">피드백 기록</h3>
        ${feedbackHTML}
      </div>
    `;
  }

  function saveFeedback() {
    const academy = document.getElementById('fb-academy').value;
    const date = document.getElementById('fb-date').value;
    const content = document.getElementById('fb-content').value.trim();

    if (!content) {
      Components.showToast('문자 내용을 입력해주세요.', 'warning');
      return;
    }

    JarvisData.addFeedback({ academy, date, content });
    Components.showToast('피드백이 저장되었습니다.', 'success');
    JarvisApp.navigateTo('feedback'); // Re-render
  }

  function deleteFeedback(id) {
    Components.showConfirm('피드백 삭제', '이 피드백 기록을 삭제하시겠습니까?', () => {
      JarvisData.deleteFeedback(id);
      Components.showToast('삭제되었습니다.', 'info');
      JarvisApp.navigateTo('feedback'); // Re-render
    });
  }

  function editDate(id, currentDate) {
    const html = `
      <div style="margin-bottom:16px;">
        <label class="form-label">새로운 날짜 지정</label>
        <input type="date" id="edit-fb-date" class="form-input" value="${currentDate}">
      </div>
      <div style="display:flex; justify-content:flex-end; gap:8px;">
        <button class="btn btn-secondary" onclick="Components.closeModal()">취소</button>
        <button class="btn btn-primary" onclick="FeedbackView.saveDateEdit('${id}')">저장</button>
      </div>
    `;
    Components.showModal('날짜 수정', html);
  }

  function saveDateEdit(id) {
    const newDate = document.getElementById('edit-fb-date').value;
    if (newDate) {
      JarvisData.updateFeedback(id, { date: newDate + 'T12:00:00.000Z' });
      Components.closeModal();
      Components.showToast('날짜가 수정되었습니다.', 'success');
      JarvisApp.navigateTo('feedback');
    }
  }

  return {
    render,
    saveFeedback,
    deleteFeedback,
    editDate,
    saveDateEdit
  };
})();
