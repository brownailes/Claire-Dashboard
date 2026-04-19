/* ============================================
   JARVIS-Yooha — Authentication Flow
   ============================================ */

const Auth = (() => {
  const sb = SupabaseClient.client;
  let currentUser = null;

  async function checkSession() {
    try {
      const { data, error } = await sb.auth.getSession();
      if (error) throw error;
      currentUser = data.session?.user || null;
      return currentUser;
    } catch (err) {
      console.warn("Auth check failed:", err);
      return null;
    }
  }

  function renderLogin() {
    const app = document.getElementById('app');
    app.innerHTML = `
      <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; width:100vw; background:var(--bg-primary); padding:20px;">
        
        <!-- Logo -->
        <div style="width:80px; height:80px; border-radius:24px; background:var(--bg-card); display:flex; align-items:center; justify-content:center; box-shadow:0 8px 32px rgba(0,210,255,0.15); margin-bottom:30px; border:1px solid var(--border-subtle);">
          <span style="font-size:40px; font-weight:900; color:var(--accent-cyan); font-family:'Outfit', sans-serif;">C</span>
        </div>

        <div class="card" style="width:100%; max-width:360px; padding:40px 32px; text-align:center; box-shadow:0 12px 40px rgba(0,0,0,0.4); border:1px solid rgba(0,210,255,0.15);">
          <h1 style="color:var(--text-primary); font-size:24px; font-weight:700; margin-bottom:8px; letter-spacing:-0.5px;">Claire's Dashboard</h1>
          <p style="color:var(--text-secondary); font-size:14px; margin-bottom:32px;">인가된 가족 계정만 접근할 수 있습니다.</p>
          
          <div style="text-align:left; margin-bottom:16px;">
            <label style="display:block; font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Email Authorization</label>
            <input type="email" id="login-email" class="form-input" placeholder="user@example.com" style="width:100%; font-size:15px; padding:12px 16px;">
          </div>
          
          <div style="text-align:left; margin-bottom:32px;">
            <label style="display:block; font-size:12px; font-weight:600; color:var(--text-muted); margin-bottom:8px; text-transform:uppercase; letter-spacing:1px;">Security Key</label>
            <input type="password" id="login-password" class="form-input" placeholder="비밀번호" style="width:100%; font-size:15px; padding:12px 16px;" onkeypress="if(event.key==='Enter') Auth.login()">
          </div>
          
          <button class="btn btn-primary" style="width:100%; font-size:15px; font-weight:600; padding:14px; display:flex; justify-content:center; gap:8px;" onclick="Auth.login()" id="login-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
            시스템 접근 승인
          </button>
        </div>
      </div>
    `;
  }

  async function login() {
    const btn = document.getElementById('login-btn');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
      Components.showToast('이메일과 비밀번호를 입력해주세요.', 'warning');
      return;
    }

    try {
      btn.innerHTML = `<div class="spinner"></div> 인증 진행 중...`;
      btn.disabled = true;

      const { data, error } = await sb.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      currentUser = data.user;
      Components.showToast('인가 완료. 시스템에 접속합니다.', 'success');
      
      // Load the app
      JarvisApp.init(true); 
    } catch (error) {
      console.error(error);
      Components.showToast('접근 거부: 인증에 실패했습니다.', 'error');
      btn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
        시스템 접근 승인
      `;
      btn.disabled = false;
    }
  }

  async function logout() {
    await sb.auth.signOut();
    currentUser = null;
    renderLogin();
    Components.showToast('시스템 연결이 해제되었습니다.', 'info');
  }

  return {
    checkSession,
    renderLogin,
    login,
    logout
  };
})();
