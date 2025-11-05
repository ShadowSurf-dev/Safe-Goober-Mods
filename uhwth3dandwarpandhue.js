javascript:(()=>{
  // ===== CONFIG =====
  const SPEED = 0.25; // change for faster warp
  const WARP_AMPLITUDE_X = 8, WARP_AMPLITUDE_Y = 4;
  const FREQ_X = 25, FREQ_Y = 15;

  // ===== SETUP =====
  const orig = document.querySelector('#canvas') || document.querySelector('canvas');
  if (!orig) { console.error('❌ No canvas found'); return; }

  if (window.__superWarp) {
    cancelAnimationFrame(window.__superWarp.raf);
    clearInterval(window.__superWarp.glitchInt);
    window.removeEventListener('resize', window.__superWarp.resizeHandler);
    window.__superWarp.overlay.remove();
    document.body.style.overflow = '';
    window.__superWarp = null;
    return;
  }

  // ===== CREATE OVERLAY =====
  const overlay = document.createElement('canvas');
  overlay.style.position = 'absolute';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.pointerEvents = 'none';
  overlay.style.zIndex = 999999;
  document.body.appendChild(overlay);

  const ctx = overlay.getContext('2d');

  function resize() {
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.width = window.innerWidth + 'px';
    overlay.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize);

  // ===== 3D WARP SETUP =====
  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.transformStyle = 'preserve-3d';
  container.style.perspective = '1000px';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.overflow = 'visible';
  while (document.body.firstChild) container.appendChild(document.body.firstChild);
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  const allEls = [...container.querySelectorAll('*')].filter(el => {
    const s = getComputedStyle(el);
    return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
  });

  allEls.forEach(el => {
    el.style.transition = 'none';
    el.style.willChange = 'transform';
  });

  // ===== FUNNY WARP LOOP =====
  let t = 0;
  function warpLoop() {
    t += SPEED;
    const w = overlay.width, h = overlay.height;
    ctx.clearRect(0, 0, w, h);

    for (let y = 0; y < h; y++) {
      const offsetY = Math.sin((y / FREQ_Y) + t) * WARP_AMPLITUDE_Y;
      const srcY = Math.floor(y / h * orig.height + offsetY);
      const clampedY = Math.min(orig.height - 1, Math.max(0, srcY));
      const offsetX = Math.sin((y / FREQ_X) + t * 1.5) * WARP_AMPLITUDE_X;
      ctx.drawImage(orig, 0, clampedY, orig.width, 1, offsetX, y, w, 1);
    }

    overlay.style.filter = `hue-rotate(${(t * 20) % 360}deg) contrast(1.3) saturate(1.5)`;
    window.__superWarp.raf = requestAnimationFrame(warpLoop);
  }

  // ===== GLITCH CHAOS =====
  function glitch3D() {
    allEls.forEach(el => {
      const rx = (Math.random() - 0.5) * 45;
      const ry = (Math.random() - 0.5) * 45;
      const rz = (Math.random() - 0.5) * 30;
      const tx = (Math.random() - 0.5) * 30;
      const ty = (Math.random() - 0.5) * 30;
      const tz = (Math.random() - 0.5) * 80;
      const sx = 1 + (Math.random() - 0.5) * 0.5;
      const sy = 1 + (Math.random() - 0.5) * 0.5;
      const skewX = (Math.random() - 0.5) * 15;
      const skewY = (Math.random() - 0.5) * 15;
      el.style.transform = `
        perspective(800px)
        translate3d(${tx}px, ${ty}px, ${tz}px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
        rotateZ(${rz}deg)
        scale(${sx}, ${sy})
        skew(${skewX}deg, ${skewY}deg)
      `;
      const blur = Math.random() * 2 + 'px';
      const bright = 0.7 + Math.random() * 0.6;
      el.style.filter = `blur(${blur}) brightness(${bright})`;
    });

    container.style.transform = `
      translate3d(${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 20}px, ${(Math.random() - 0.5) * 100}px)
      rotateZ(${(Math.random() - 0.5) * 10}deg)
    `;
  }

  const glitchInt = setInterval(glitch3D, 100);

  // ===== COMBINE =====
  window.__superWarp = {
    overlay,
    resizeHandler: resize,
    raf: requestAnimationFrame(warpLoop),
    glitchInt
  };

  console.log('🌈 Ultra Warp Chaos mode active! Run `__superWarp = null` and reload to escape.');
})();
