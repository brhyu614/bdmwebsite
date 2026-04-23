/* BDM Mentoring — 간단 비번 게이트 (casual obscurity, not crypto security) */
(async function () {
  const KEY = 'bdm:mentoring:auth:v1';
  const EXPECTED = '5c8020746382ae81a88fd1396daec35d58e6de193664f84fe75a01d579b9b69b';

  async function sha256(s) {
    const buf = new TextEncoder().encode(s);
    const h = await crypto.subtle.digest('SHA-256', buf);
    return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // URL 파라미터로 비번 자동 입력 가능 (?pw=...) — 링크 공유용
  const params = new URLSearchParams(location.search);
  const urlPw = params.get('pw');
  if (urlPw) {
    const h = await sha256(urlPw);
    if (h === EXPECTED) {
      try { localStorage.setItem(KEY, h); } catch {}
      // Strip pw from URL so it's not bookmarked/logged
      params.delete('pw');
      const qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
      return;
    }
  }

  // 이미 통과한 적 있으면 pass
  try {
    if (localStorage.getItem(KEY) === EXPECTED) return;
  } catch {}

  // 페이지 콘텐츠 가리기
  document.documentElement.style.visibility = 'hidden';

  function mount() {
    const root = document.createElement('div');
    root.id = 'bdm-gate';
    root.innerHTML = `
      <style>
        #bdm-gate{position:fixed;inset:0;z-index:2147483647;background:#FAFAF9;display:flex;align-items:center;justify-content:center;font-family:'Noto Sans KR',system-ui,-apple-system,sans-serif;visibility:visible}
        #bdm-gate .box{background:#fff;border:1px solid #E7E5E4;border-radius:14px;padding:32px;width:360px;max-width:calc(100vw - 32px);box-shadow:0 4px 24px rgba(0,0,0,.04)}
        #bdm-gate h2{margin:0 0 6px;font-size:18px;letter-spacing:-.01em;color:#1C1917}
        #bdm-gate p{margin:0 0 18px;color:#57534E;font-size:13px;line-height:1.6}
        #bdm-gate input{width:100%;border:1px solid #E7E5E4;border-radius:8px;padding:11px 14px;font-size:15px;font-family:inherit;outline:none;transition:border-color .15s}
        #bdm-gate input:focus{border-color:#059669}
        #bdm-gate button{width:100%;margin-top:10px;background:#059669;color:#fff;border:none;border-radius:8px;padding:11px 14px;font-size:14px;font-weight:500;font-family:inherit;cursor:pointer;transition:background .12s}
        #bdm-gate button:hover{background:#047857}
        #bdm-gate .err{color:#B91C1C;font-size:12px;margin-top:10px;min-height:16px;font-weight:500}
        #bdm-gate.shake .box{animation:shake .35s}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        #bdm-gate .brand{font-size:11px;color:#A8A29E;letter-spacing:.12em;text-transform:uppercase;margin-bottom:14px}
      </style>
      <div class="box">
        <div class="brand">BDM Mentoring · Private</div>
        <h2>비공개 페이지입니다</h2>
        <p>접근 비밀번호를 입력해주세요.</p>
        <input id="bdm-pw" type="password" autocomplete="off" placeholder="비밀번호" />
        <div class="err" id="bdm-err"></div>
        <button id="bdm-submit">입장</button>
      </div>
    `;
    document.body.appendChild(root);

    const input = root.querySelector('#bdm-pw');
    const err = root.querySelector('#bdm-err');
    const btn = root.querySelector('#bdm-submit');
    setTimeout(() => input.focus(), 50);

    async function submit() {
      const v = input.value;
      if (!v) return;
      const h = await sha256(v);
      if (h === EXPECTED) {
        try { localStorage.setItem(KEY, h); } catch {}
        root.remove();
        document.documentElement.style.visibility = '';
      } else {
        err.textContent = '비밀번호가 틀립니다.';
        root.classList.remove('shake'); void root.offsetWidth; root.classList.add('shake');
        input.select();
      }
    }
    btn.onclick = submit;
    input.onkeydown = e => { if (e.key === 'Enter') submit(); };
  }

  if (document.body) {
    mount();
  } else {
    document.addEventListener('DOMContentLoaded', mount);
  }
})();
