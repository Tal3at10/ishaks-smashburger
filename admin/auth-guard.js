(function () {
  const SESSION_KEY = 'ishaks_staff_unlocked_v1';

  function getExpectedPin() {
    if (typeof IshakStore !== 'undefined') {
      const s = IshakStore.getSettings();
      if (s && s.staffPin && /^\d{4}$/.test(String(s.staffPin))) {
        return String(s.staffPin);
      }
    }
    return '1234';
  }

  function isUnlocked() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}
  }

  function lock() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
    window.location.reload();
  }

  window.IshakAuth = { lock, isUnlocked };

  if (isUnlocked()) return;

  const style = document.createElement('style');
  style.textContent = `
    #ishakPinGate {
      position: fixed; inset: 0; z-index: 99999;
      background: #0A0A0A; color: #FFFFFF;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 24px; font-family: 'Inter', system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .pin-box {
      width: 100%; max-width: 320px; text-align: center;
    }
    .pin-logo {
      width: 56px; height: 56px; object-fit: contain; margin: 0 auto 14px; display: block;
    }
    .pin-title {
      font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: 26px;
      text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px;
    }
    .pin-sub {
      font-size: 13px; color: #8E8E8E; margin-bottom: 24px;
    }
    .pin-dots {
      display: flex; justify-content: center; gap: 14px; margin-bottom: 10px;
    }
    .pin-dot {
      width: 14px; height: 14px; border-radius: 50%;
      border: 2px solid #333; background: transparent; transition: all 0.12s ease;
    }
    .pin-dot.filled {
      background: #FFC000; border-color: #FFC000;
    }
    .pin-dot.error {
      background: #e57373; border-color: #e57373;
    }
    .pin-err-msg {
      min-height: 20px; font-size: 12px; color: #e57373; margin-bottom: 14px; font-weight: 600;
    }
    .pin-pad {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;
    }
    .pin-key {
      height: 56px; border-radius: 8px; background: #141414; border: 1px solid #242424;
      color: #fff; font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 24px;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      user-select: none; -webkit-tap-highlight-color: transparent; transition: background 0.1s, border-color 0.1s;
    }
    .pin-key:hover { background: #1c1c1c; border-color: #383838; }
    .pin-key:active { background: #FFC000; color: #000; border-color: #FFC000; }
    .pin-key.fn { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 600; color: #8E8E8E; text-transform: uppercase; }
    .pin-demo-hint {
      margin-top: 22px; font-size: 11.5px; color: #666;
    }
    .pin-demo-hint strong { color: #aaa; }
    .pin-back-link {
      display: inline-block; margin-top: 12px; font-size: 12px; color: #888; text-decoration: none;
    }
    .pin-back-link:hover { color: #fff; }
    @media print { #ishakPinGate { display: none !important; } }
  `;
  document.head.appendChild(style);

  function mountGate() {
    if (isUnlocked() || document.getElementById('ishakPinGate')) return;

    const gate = document.createElement('div');
    gate.id = 'ishakPinGate';
    gate.innerHTML = `
      <div class="pin-box">
        <img src="../assets/images/logo.png" alt="Ishak's Smash Burger" class="pin-logo" />
        <div class="pin-title">Personalåtkomst</div>
        <div class="pin-sub">Ange 4-siffrig personalkod för att öppna terminalen</div>
        <div class="pin-dots" id="pinDots">
          <span class="pin-dot"></span><span class="pin-dot"></span><span class="pin-dot"></span><span class="pin-dot"></span>
        </div>
        <div class="pin-err-msg" id="pinErrMsg"></div>
        <div class="pin-pad" id="pinPad">
          <button type="button" class="pin-key" data-k="1">1</button>
          <button type="button" class="pin-key" data-k="2">2</button>
          <button type="button" class="pin-key" data-k="3">3</button>
          <button type="button" class="pin-key" data-k="4">4</button>
          <button type="button" class="pin-key" data-k="5">5</button>
          <button type="button" class="pin-key" data-k="6">6</button>
          <button type="button" class="pin-key" data-k="7">7</button>
          <button type="button" class="pin-key" data-k="8">8</button>
          <button type="button" class="pin-key" data-k="9">9</button>
          <button type="button" class="pin-key fn" data-k="clear">Rensa</button>
          <button type="button" class="pin-key" data-k="0">0</button>
          <button type="button" class="pin-key fn" data-k="back">⌫</button>
        </div>
        <div class="pin-demo-hint">Demokod för visning: <strong id="pinDemoVal">1234</strong></div>
        <a href="../index.html" class="pin-back-link">← Tillbaka till hemsidan</a>
      </div>
    `;
    document.body.appendChild(gate);

    const demoValEl = document.getElementById('pinDemoVal');
    if (demoValEl) demoValEl.textContent = getExpectedPin();

    let buf = '';
    const dots = Array.from(gate.querySelectorAll('.pin-dot'));
    const errEl = document.getElementById('pinErrMsg');

    function renderDots(isError) {
      dots.forEach((d, idx) => {
        d.className = 'pin-dot' + (isError ? ' error' : idx < buf.length ? ' filled' : '');
      });
    }

    function handleInput(k) {
      if (errEl) errEl.textContent = '';
      if (k === 'clear') {
        buf = '';
        renderDots(false);
        return;
      }
      if (k === 'back') {
        buf = buf.slice(0, -1);
        renderDots(false);
        return;
      }
      if (!/^\d$/.test(k) || buf.length >= 4) return;

      buf += k;
      renderDots(false);

      if (buf.length === 4) {
        if (buf === getExpectedPin()) {
          setUnlocked();
          window.removeEventListener('keydown', onKey);
          gate.remove();
        } else {
          renderDots(true);
          if (errEl) errEl.textContent = 'Fel personalkod';
          setTimeout(() => {
            buf = '';
            renderDots(false);
          }, 450);
        }
      }
    }

    gate.querySelector('#pinPad').addEventListener('click', (e) => {
      const btn = e.target.closest('[data-k]');
      if (btn) handleInput(btn.dataset.k);
    });

    function onKey(e) {
      if (!document.getElementById('ishakPinGate')) return;
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      else if (e.key === 'Backspace') handleInput('back');
      else if (e.key === 'Escape') handleInput('clear');
    }
    window.addEventListener('keydown', onKey);
  }

  if (document.body) mountGate();
  else document.addEventListener('DOMContentLoaded', mountGate);
})();
