/* BDM Mentoring — Firebase Firestore sync layer.
 * config가 들어오면 localStorage 대신 Firestore를 자동 사용.
 * 사용법: HTML에서 <script type="module" src="./firebase-sync.js"></script> 로 로드.
 * 연결 후 window.BDM_SYNC = { ready: Promise, get(key), set(key, value), subscribe(key, cb) } 노출.
 */

// =====================================================================
// ⚠️ 여기만 채워넣으면 됨. Firebase 콘솔에서 받은 config를 그대로 붙여넣기.
// config가 비어 있으면 localStorage 모드로 fallback.
// =====================================================================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAF5nFZVb_TndPyTAFgZMElsOwLDolTJ5w",
  authDomain: "bdm-mentoring.firebaseapp.com",
  projectId: "bdm-mentoring",
  storageBucket: "bdm-mentoring.firebasestorage.app",
  messagingSenderId: "837222705176",
  appId: "1:837222705176:web:aca819a108694df4b0bb6d"
};

const COLLECTION = 'mentoring';
const ENABLED = !!FIREBASE_CONFIG.apiKey;

// Promise that resolves with the sync backend
const readyPromise = (async () => {
  if (!ENABLED) {
    return makeLocalBackend();
  }
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js');
    const {
      getFirestore, doc, getDoc, setDoc, onSnapshot, serverTimestamp,
    } = await import('https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js');

    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);

    return {
      mode: 'firestore',
      async get(key) {
        const snap = await getDoc(doc(db, COLLECTION, key));
        return snap.exists() ? snap.data().payload : null;
      },
      async set(key, value) {
        await setDoc(doc(db, COLLECTION, key), { payload: value, updatedAt: serverTimestamp() });
        // localStorage에도 백업
        try { localStorage.setItem('bdm:mirror:' + key, JSON.stringify(value)); } catch {}
      },
      subscribe(key, cb) {
        return onSnapshot(doc(db, COLLECTION, key), snap => {
          if (snap.exists()) cb(snap.data().payload);
        });
      }
    };
  } catch (e) {
    console.warn('[BDM] Firebase 로드 실패, localStorage로 fallback:', e);
    return makeLocalBackend();
  }
})();

function makeLocalBackend() {
  const listeners = new Map();
  window.addEventListener('storage', e => {
    if (!e.key?.startsWith('bdm:sync:')) return;
    const key = e.key.replace('bdm:sync:', '');
    const cbs = listeners.get(key) || [];
    try { const v = e.newValue ? JSON.parse(e.newValue) : null; cbs.forEach(cb => cb(v)); } catch {}
  });
  return {
    mode: 'local',
    async get(key) {
      try {
        const raw = localStorage.getItem('bdm:sync:' + key);
        return raw ? JSON.parse(raw) : null;
      } catch { return null; }
    },
    async set(key, value) {
      try { localStorage.setItem('bdm:sync:' + key, JSON.stringify(value)); } catch {}
    },
    subscribe(key, cb) {
      if (!listeners.has(key)) listeners.set(key, []);
      listeners.get(key).push(cb);
      this.get(key).then(v => { if (v) cb(v); });
      return () => {
        const arr = listeners.get(key) || [];
        const i = arr.indexOf(cb);
        if (i >= 0) arr.splice(i, 1);
      };
    }
  };
}

window.BDM_SYNC = { ready: readyPromise };
readyPromise.then(b => {
  window.BDM_SYNC = Object.assign(b, { ready: readyPromise });
  document.dispatchEvent(new CustomEvent('bdm-sync-ready', { detail: { mode: b.mode } }));
  console.info(`[BDM] Sync backend ready: ${b.mode}`);
});
