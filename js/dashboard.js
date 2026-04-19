/* ============================================
   JARVIS-Yooha — Main Dashboard View
   ============================================ */

const DashboardView = (() => {
  function render() {
    const profile   = JarvisData.getProfile();
    const dday      = JarvisData.getDday();
    const progress  = JarvisData.getOverallProgress();
    const grade     = JarvisData.getCurrentGrade();
    const semester  = JarvisData.getCurrentSemester();
    const stats     = JarvisData.getStats();
    const milestones = JarvisData.getMilestones();

    return `
      <div class="page-header">
        <div style="width: 100%;">
          <div style="display:flex; justify-content:space-between; align-items:flex-end;">
            <h1 class="page-title">Command Center</h1>
            <div style="display:flex; gap:var(--space-sm);">
              <button class="btn btn-secondary btn-sm" onclick="JarvisData.exportJSON()">내보내기</button>
              <label class="btn btn-secondary btn-sm" style="cursor:pointer; margin:0;">
                가져오기
                <input type="file" accept=".json" style="display:none;" onchange="Components.handleImport(event)">
              </label>
            </div>
          </div>
          
          <div class="user-profile-panel" style="display:flex; align-items:center; gap:20px; background:var(--bg-card); padding:20px 24px; border-radius:var(--radius-lg); border:1px solid var(--border-subtle); margin-top:20px; box-shadow:0 4px 20px rgba(0,0,0,0.15);">
            <div style="flex:1;">
              <div style="display:flex; align-items:flex-end; gap:12px; margin-bottom:10px;">
                <h2 style="margin:0; font-size:22px; font-weight:700; color:var(--text-primary); letter-spacing:-0.5px;">${profile.name}</h2>
                <span style="font-size:14px; color:var(--text-secondary); margin-bottom:2px; font-weight:500;">현재 ${grade} ${semester}</span>
              </div>
              
              <div style="display:flex; flex-wrap:wrap; gap:16px; margin-bottom:14px; font-size:13px; color:var(--text-muted);">
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                  ${profile.elementarySchool} 졸업 (26.01)
                </div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  ${profile.address}
                </div>
              </div>

              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <span class="tag" style="background:var(--gold-dim); color:var(--gold); border:1px solid rgba(144,96,94,0.3); font-weight:600; padding:6px 12px; font-size:12px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="margin-right:4px; vertical-align:-2px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> 목표: ${profile.targetDepartment}</span>
                <span class="tag" style="background:var(--cyan-dim); color:var(--cyan); border:1px solid rgba(62,81,104,0.3); font-weight:500; padding:6px 12px; font-size:12px;">CEFR C2 (Proficient)</span>
                <span class="tag" style="background:var(--cyan-dim); color:var(--cyan); border:1px solid rgba(62,81,104,0.3); font-weight:500; padding:6px 12px; font-size:12px;">Lexile 1400L+</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- D-Day & compact progress -->
      <div style="margin-bottom:var(--space-md);">
        ${renderDday(dday, profile, progress, grade)}
      </div>

      ${renderScoreChart() || ''}
      
      <!-- Clickable Stat Cards -->
      <div class="stat-grid" style="margin-bottom:var(--space-md);">
        ${renderStatCard(stats.avgGrade, '평균 등급', 'cyan',   stats.avgGrade === '-' ? '시험 기록 없음' : '최근 시험 기준', 'DashboardView.showStatDetail("exams")')}
        ${renderStatCard(stats.portfolioCount, '포트폴리오', 'purple', '비교과 활동 총 건수', 'DashboardView.showStatDetail("portfolio")')}
        ${renderStatCard(stats.competitionCount, '공모전/대회', 'gold', '참여 및 수상', 'DashboardView.showStatDetail("competitions")')}
        ${renderStatCard(stats.academyCount, '학원', 'green', stats.monthlyCost > 0 ? `월 ${Components.formatNumber(stats.monthlyCost)}원` : '등록된 학원', 'DashboardView.showStatDetail("academies")')}
      </div>

      <!-- Roadmap Cards -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">전략 로드맵</span>
          <span class="card-badge">${grade}</span>
        </div>
        ${renderRoadmapCards(milestones, grade)}
      </div>

      <!-- Chart Section -->
      <div class="card" style="margin-bottom:var(--space-md);">
        <div class="card-header">
          <span class="card-title">학원 학업 성취도 추이 (최근 시험 기준)</span>
        </div>
        <div style="height:250px; position:relative;">
          <canvas id="scoreChartCanvas"></canvas>
        </div>
      </div>

      <!-- Bottom Row: Current Milestone + Activity + Notice Monitor -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:var(--space-md); margin-bottom:var(--space-md);">
        ${renderCurrentMilestone(milestones)}
        <div class="card">
          <div class="card-header">
            <span class="card-title">최근 활동</span>
          </div>
          ${Components.renderActivityFeed(8)}
        </div>
      </div>

      <!-- Notice Monitor -->
      ${renderNoticeMonitor()}
    `;
  }

  function renderScoreChart() {
    setTimeout(() => {
      const canvas = document.getElementById('scoreChartCanvas');
      if (!canvas) return;
      
      const feedbacks = JarvisData.getFeedbacks() || [];
      const scoreFbs = feedbacks.filter(fb => fb.content.includes('시험점수') || fb.content.includes('점수'));
      scoreFbs.sort((a,b) => new Date(a.date) - new Date(b.date));

      const labels = [];
      const yoohaScores = [];
      const avgScores = [];

      scoreFbs.forEach(fb => {
        const scoreMatch = fb.content.match(/(?:시험점수|시험 점수)\s*:\s*(\d+(?:\.\d+)?)/) || fb.content.match(/점수\s*:\s*(\d+(?:\.\d+)?)/);
        const avgMatch = fb.content.match(/평균(?:점수)?\s*:\s*(\d+(?:\.\d+)?)/);

        if (scoreMatch) {
          const d = new Date(fb.date);
          labels.push(`${d.getMonth()+1}/${d.getDate()}`);
          yoohaScores.push(parseFloat(scoreMatch[1]));
          avgScores.push(avgMatch ? parseFloat(avgMatch[1]) : null);
        }
      });

      if (labels.length === 0) {
        canvas.parentElement.innerHTML = Components.emptyState('', '아직 차트로 분석할 시험 점수 데이터가 부족합니다.');
        return;
      }

      new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: '유하 성적',
              data: yoohaScores,
              borderColor: '#00d2ff',
              backgroundColor: 'rgba(0, 210, 255, 0.2)',
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: '#00d2ff',
              fill: true
            },
            {
              label: '반 평균',
              data: avgScores,
              borderColor: '#ff6b6b',
              borderWidth: 2,
              borderDash: [5, 5],
              tension: 0.3,
              pointRadius: 0,
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          color: '#a0aec0',
          plugins: {
            legend: {
              labels: { color: '#a0aec0', font: { family: 'Outfit, "Noto Sans KR"' } }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 30,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#a0aec0' }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#a0aec0' }
            }
          }
        }
      });
    }, 0);
  }

  /* ── Notice Monitor ───────────────────── */
  const NOTICE_SITES = [
    {
      id: 'snu-vet',
      name: '서울대 수의대',
      label: '서울대학교 수의과대학',
      desc: '입시·프로그램 공지사항',
      url: 'https://vet.snu.ac.kr/category/board-3-BL-8Piv9u51-20211029154329/#none',
      color: 'var(--accent-cyan)',
      accent: 'rgba(0,210,255,0.08)',
      border: 'rgba(0,210,255,0.25)',
      badge: 'SNU',
    },
    {
      id: 'kku-vet',
      name: '건국대 수의대',
      label: '건국대학교 수의과대학',
      desc: '입시·프로그램 공지사항',
      url: 'https://vet.konkuk.ac.kr/vet/11138/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGdmV0JTJGOTQ4JTJGYXJ0Y2xMaXN0LmRvJTNG',
      color: 'var(--accent-gold)',
      accent: 'rgba(212,175,55,0.08)',
      border: 'rgba(212,175,55,0.25)',
      badge: 'KKU',
    },
  ];

  function renderNoticeMonitor() {
    const cards = NOTICE_SITES.map(site => `
      <div style="flex:1; min-width:240px; background:${site.accent}; border:1px solid ${site.border};
                  border-radius:12px; padding:16px 20px; display:flex; align-items:center; gap:16px;
                  transition:transform 0.15s, box-shadow 0.15s; cursor:pointer;"
           onclick="window.open('${site.url}', '_blank', 'noopener')"
           onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.2)'"
           onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <!-- Badge -->
        <div style="width:44px; height:44px; border-radius:10px; background:${site.color}22;
                    border:1.5px solid ${site.color}; display:flex; align-items:center;
                    justify-content:center; flex-shrink:0;">
          <span style="font-size:11px; font-weight:800; color:${site.color}; letter-spacing:0.04em;">${site.badge}</span>
        </div>
        <!-- Text -->
        <div style="flex:1; min-width:0;">
          <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${site.label}</div>
          <div style="font-size:11px; color:var(--text-muted);">${site.desc}</div>
        </div>
        <!-- Arrow -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="flex-shrink:0; opacity:0.5;">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `).join('');

    return `
      <div class="card">
        <div class="card-header" style="margin-bottom:12px;">
          <span class="card-title">수의대 공지사항 모니터링</span>
          <span class="card-badge">주기적으로 확인</span>
        </div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${cards}
        </div>
        <div style="font-size:11px; color:var(--text-muted); margin-top:12px; padding-top:10px; border-top:1px solid var(--border-subtle);">
          프로그램 신청 공지는 주로 <strong style="color:var(--text-secondary);">6~7월</strong>에 게시됩니다. 고교 진학 후 매달 1회 이상 방문을 권장합니다.
        </div>
      </div>
    `;
  }

  /* ── D-Day card ──────────────────────── */
  function renderDday(dday, profile, progress, grade) {
    const prefix = dday > 0 ? 'D-' : 'D+';
    const absDay = Math.abs(dday);
    return `
      <div class="card">
        <div style="display:flex; align-items:center; gap:var(--space-xl); flex-wrap:wrap;">
          <div class="dday-container" style="min-width:150px; padding:0; border:none; background:none;">
            <div class="dday-number">${prefix}${absDay}</div>
            <div class="dday-label">수시 원서 마감까지</div>
            <div class="dday-target">${profile.targetYear}학년도 ${profile.targetUniversity}</div>
          </div>
          <div style="flex:1; min-width:200px;">
            <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px;">
              <span style="font-size:12px; color:var(--text-muted);">전체 진행률 &nbsp;<strong style="color:var(--gold);">${grade}</strong></span>
              <span class="font-en" style="font-size:15px; font-weight:700; color:var(--cyan);">${progress}%</span>
            </div>
            <div class="progress-bar" style="height:7px;">
              <div class="progress-fill" style="width:${progress}%;"></div>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:10px; color:var(--text-muted); margin-top:4px;">
              <span>중1 입학</span><span>수능</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ── Clickable Stat Card ──────────────── */
  function renderStatCard(value, label, color, sub, onclick) {
    return `
      <div class="stat-card ${color}" style="cursor:pointer; transition:transform 0.15s, box-shadow 0.15s;"
           onclick="${onclick}"
           onmouseenter="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.25)'"
           onmouseleave="this.style.transform=''; this.style.boxShadow=''">
        <div class="stat-value font-en">${value}</div>
        <div class="stat-label">${label}</div>
        ${sub ? `<div style="font-size:11px; color:var(--text-muted); margin-top:4px;">${sub}</div>` : ''}
        <div style="font-size:10px; color:var(--text-muted); margin-top:6px; opacity:0.7;">클릭하여 상세 보기</div>
      </div>
    `;
  }

  /* ── Roadmap: Horizontal Stepper ──────── */
  function renderRoadmapCards(milestones, currentGrade) {
    const gradeOrder = ['중1','중2','중3','고1','고2','고3'];
    const currentIdx = gradeOrder.indexOf(currentGrade);
    const total = milestones.length;

    const steps = milestones.map((m, i) => {
      const gIdx = gradeOrder.indexOf(m.grade);
      let status = 'upcoming';
      if (gIdx < currentIdx) status = 'completed';
      if (gIdx === currentIdx) status = 'current';

      const done = m.checklist.filter(c => c.done).length;
      const tot  = m.checklist.length;
      const pct  = tot > 0 ? Math.round((done / tot) * 100) : 0;
      const isLast = i === total - 1;

      // Colors
      const dotBg    = status === 'current'   ? 'var(--accent-gold)'
                     : status === 'completed' ? 'var(--accent-cyan)'
                     : 'var(--bg-secondary)';
      const dotBorder = status === 'current'   ? 'var(--accent-gold)'
                      : status === 'completed' ? 'var(--accent-cyan)'
                      : 'var(--border-default)';
      const connColor = status === 'completed' ? 'var(--accent-cyan)' : 'var(--border-subtle)';
      const labelColor = status === 'current'   ? 'var(--accent-gold)'
                       : status === 'completed' ? 'var(--text-primary)'
                       : 'var(--text-muted)';
      const dotGlow   = status === 'current'   ? 'box-shadow:0 0 0 4px rgba(212,175,55,0.2), 0 0 12px rgba(212,175,55,0.4);'
                      : status === 'completed' ? 'box-shadow:0 0 8px rgba(0,210,255,0.25);'
                      : '';
      const dotInner  = status === 'completed'
        ? `<svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" stroke="white" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`
        : status === 'current'
        ? `<div style="width:6px;height:6px;border-radius:50%;background:white;"></div>`
        : `<span style="font-size:10px;font-weight:700;color:var(--text-muted);">${i+1}</span>`;

      // Mini progress ring (SVG)
      const r = 10, circ = 2 * Math.PI * r;
      const offset = circ - (pct / 100) * circ;
      const ring = tot > 0 ? `
        <svg width="28" height="28" style="position:absolute;top:-2px;right:-2px;">
          <circle cx="14" cy="14" r="${r}" fill="none" stroke="var(--border-subtle)" stroke-width="2"/>
          <circle cx="14" cy="14" r="${r}" fill="none" stroke="${dotBorder}" stroke-width="2"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
            stroke-linecap="round" transform="rotate(-90 14 14)" style="opacity:0.7;"/>
        </svg>` : '';

      const cardBg = status === 'current'
        ? 'background:linear-gradient(135deg, rgba(212,175,55,0.06) 0%, var(--bg-card) 100%); border:1px solid rgba(212,175,55,0.3);'
        : status === 'completed'
        ? 'background:var(--bg-card); border:1px solid rgba(0,210,255,0.15);'
        : 'background:var(--bg-card); border:1px solid var(--border-subtle); opacity:0.75;';

      return `
        <div style="display:flex; flex-direction:column; align-items:center; flex:1; min-width:0;">
          <!-- Connector + Dot row -->
          <div style="display:flex; align-items:center; width:100%; margin-bottom:12px;">
            <div style="flex:1; height:1px; background:${i===0?'transparent':connColor};"></div>
            <div style="width:28px; height:28px; border-radius:50%; background:${dotBg}; border:2px solid ${dotBorder};
                        display:flex; align-items:center; justify-content:center; flex-shrink:0;
                        ${dotGlow} cursor:pointer; position:relative; transition:transform 0.15s;
                        z-index:1;"
                 onclick="DashboardView.showMilestone('${m.id}')"
                 onmouseenter="this.style.transform='scale(1.2)'"
                 onmouseleave="this.style.transform='scale(1)'">
              ${dotInner}
              ${ring}
            </div>
            <div style="flex:1; height:1px; background:${isLast?'transparent':status==='completed'?'var(--accent-cyan)':'var(--border-subtle)'};"></div>
          </div>

          <!-- Info card -->
          <div onclick="DashboardView.showMilestone('${m.id}')"
               style="${cardBg} border-radius:10px; padding:12px; width:100%; box-sizing:border-box;
                      cursor:pointer; transition:transform 0.15s, box-shadow 0.15s;"
               onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,0.2)'"
               onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div style="font-size:11px; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; color:${labelColor}; margin-bottom:4px;">${m.grade}</div>
            <div style="font-size:12px; font-weight:600; color:var(--text-primary); line-height:1.4; margin-bottom:6px; word-break:keep-all;">${m.title}</div>
            <div style="font-size:10px; color:var(--text-muted); margin-bottom:8px;">${m.period.split(' ~ ')[0]}</div>
            <div style="height:3px; border-radius:99px; background:var(--bg-secondary); overflow:hidden;">
              <div style="height:100%; width:${pct}%; background:${dotBorder}; border-radius:99px;"></div>
            </div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:4px; text-align:right;">${done}/${tot}</div>
          </div>
        </div>
      `;
    }).join('');

    return `<div style="display:flex; gap:8px; align-items:flex-start; padding:4px 0 8px; overflow-x:auto;">${steps}</div>`;
  }

  /* ── Current Milestone Detail ─────────── */
  function renderCurrentMilestone(milestones) {
    const current = milestones.find(m => m.status === 'current') || milestones[0];
    if (!current) return '<div class="card">마일스톤 데이터 없음</div>';

    const total = current.checklist.length;
    const done  = current.checklist.filter(c => c.done).length;
    const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

    const checklistHtml = current.checklist.map((item, idx) => `
      <label style="display:flex; align-items:center; gap:var(--space-sm); padding:8px 0; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.03);">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="DashboardView.toggleCheck('${current.id}', ${idx})"
          style="accent-color:var(--cyan); width:18px; height:18px;">
        <span style="font-size:14px; ${item.done ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${item.text}</span>
      </label>
    `).join('');

    return `
      <div class="card">
        <div class="card-header">
          <span class="card-title">${current.grade} — ${current.title}</span>
          <span class="card-badge">${done}/${total}</span>
        </div>
        <p style="font-size:13px; color:var(--text-secondary); margin-bottom:var(--space-md);">${current.description}</p>
        <div class="progress-bar" style="margin-bottom:var(--space-md);">
          <div class="progress-fill" style="width:${pct}%;"></div>
        </div>
        ${checklistHtml}
      </div>
    `;
  }

  /* ── Stat Detail Modals ───────────────── */
  function showStatDetail(type) {
    const data = JarvisData.getData();

    if (type === 'exams') {
      const exams = data.exams || [];
      const body = exams.length === 0
        ? '<p style="color:var(--text-muted); text-align:center; padding:24px 0;">등록된 시험 기록이 없습니다.</p>'
        : `<table style="width:100%; font-size:13px; border-collapse:collapse;">
            <thead><tr style="color:var(--text-muted); font-size:12px; border-bottom:1px solid var(--border-subtle);">
              <th style="text-align:left; padding:8px 4px;">과목</th>
              <th style="text-align:right; padding:8px 4px;">등급</th>
              <th style="text-align:right; padding:8px 4px;">점수</th>
              <th style="text-align:right; padding:8px 4px;">날짜</th>
            </tr></thead>
            <tbody>${exams.slice(-10).reverse().map(e => `
              <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                <td style="padding:8px 4px;">${e.subject || '-'}</td>
                <td style="text-align:right; padding:8px 4px; color:var(--accent-cyan);">${e.grade || '-'}</td>
                <td style="text-align:right; padding:8px 4px;">${e.score != null ? e.score : '-'}</td>
                <td style="text-align:right; padding:8px 4px; color:var(--text-muted);">${e.date || ''}</td>
              </tr>`).join('')}
            </tbody>
          </table>`;
      Components.showModal('최근 시험 성적', body);
    }

    if (type === 'portfolio') {
      const items = data.portfolio || [];
      const body = items.length === 0
        ? '<p style="color:var(--text-muted); text-align:center; padding:24px 0;">등록된 포트폴리오 항목이 없습니다.</p>'
        : items.slice().reverse().map(p => `
            <div style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span style="font-weight:600; font-size:14px;">${p.title}</span>
                ${p.category ? `<span class="tag tag-cyan" style="font-size:10px; padding:2px 7px;">${p.category}</span>` : ''}
              </div>
              <div style="font-size:12px; color:var(--text-muted);">${p.date || ''} ${p.description ? '— ' + p.description : ''}</div>
            </div>`).join('');
      Components.showModal('포트폴리오', body);
    }

    if (type === 'competitions') {
      const comps = (data.portfolio || []).filter(p => p.category === 'competition' || p.category === 'award');
      const body = comps.length === 0
        ? '<p style="color:var(--text-muted); text-align:center; padding:24px 0;">등록된 공모전/대회 기록이 없습니다.</p>'
        : comps.map(c => `
            <div style="padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div style="font-weight:600; margin-bottom:4px;">${c.title}</div>
              <div style="font-size:12px; color:var(--text-muted);">${c.date || ''} ${c.description ? '· ' + c.description : ''}</div>
            </div>`).join('');
      Components.showModal('공모전 / 대회', body);
    }

    if (type === 'academies') {
      const acs = data.academies || [];
      const body = acs.length === 0
        ? '<p style="color:var(--text-muted); text-align:center; padding:24px 0;">등록된 학원이 없습니다.</p>'
        : acs.map(a => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05);">
              <div>
                <div style="font-weight:600; margin-bottom:2px;">${a.name}</div>
                <div style="font-size:12px; color:var(--text-muted);">${a.subject || ''} ${a.memo ? '· ' + a.memo : ''}</div>
              </div>
              ${a.cost > 0 ? `<div style="font-size:13px; color:var(--accent-gold); font-weight:600;">월 ${Components.formatNumber(a.cost)}원</div>` : ''}
            </div>`).join('');
      Components.showModal('등록 학원', body);
    }
  }

  /* ── Milestone popup ─────────────────── */
  function showMilestone(id) {
    const m = JarvisData.getMilestones().find(ms => ms.id === id);
    if (!m) return;

    const checklistHtml = m.checklist.map((item, idx) => `
      <label style="display:flex; align-items:center; gap:var(--space-sm); padding:10px 0; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.03);">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="DashboardView.toggleCheckModal('${m.id}', ${idx})"
          style="accent-color:var(--cyan); width:18px; height:18px;">
        <span style="font-size:14px; ${item.done ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${item.text}</span>
      </label>
    `).join('');

    Components.showModal(
      `${m.grade} — ${m.title}`,
      `
        <p style="color:var(--text-secondary); margin-bottom:var(--space-md);">${m.period}</p>
        <p style="font-size:14px; margin-bottom:var(--space-lg);">${m.description}</p>
        <h4 style="font-size:13px; color:var(--text-secondary); margin-bottom:var(--space-sm);">체크리스트</h4>
        ${checklistHtml}
      `
    );
  }

  function toggleCheck(milestoneId, checkIndex) {
    JarvisData.toggleMilestoneCheckItem(milestoneId, checkIndex);
    JarvisApp.navigateTo('dashboard');
  }

  function toggleCheckModal(milestoneId, checkIndex) {
    JarvisData.toggleMilestoneCheckItem(milestoneId, checkIndex);
    showMilestone(milestoneId);
  }

  return { render, toggleCheck, showMilestone, toggleCheckModal, showStatDetail };
})();
