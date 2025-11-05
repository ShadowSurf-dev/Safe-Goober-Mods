javascript:(()=>{
  // === CONFIG ===
  const SPEED = 0.25;          // Wave speed
  const ROT_SPEED = 0.4;       // Cube rotation speed
  const PAGE_WARP_INTENSITY = 10;
  const CUBE_SIZE = 600;       // px
  const COLOR_SHIFT_SPEED = 1;

  // === CLEANUP ===
  if (window.__dualWarp) {
    cancelAnimationFrame(window.__dualWarp.raf);
    clearInterval(window.__dualWarp.glitchInt);
    window.removeEventListener('resize', window.__dualWarp.resizeHandler);
    window.__dualWarp.overlay.remove();
    window.__dualWarp.cube.remove();
    window.__dualWarp = null;
    document.body.style.filter = '';
    return;
  }

  // === PAGE WARP LAYER ===
  const pageCanvas = document.createElement('canvas');
  pageCanvas.style.position = 'fixed';
  pageCanvas.style.top = '0';
  pageCanvas.style.left = '0';
  pageCanvas.style.width = '100vw';
  pageCanvas.style.height = '100vh';
  pageCanvas.style.zIndex = '99998';
  pageCanvas.style.pointerEvents = 'none';
  pageCanvas.style.mixBlendMode = 'overlay';
  document.body.appendChild(pageCanvas);
  const pctx = pageCanvas.getContext('2d');

  const orig = document.querySelector('#canvas') || document.querySelector('canvas');

  function resize() {
    pageCanvas.width = window.innerWidth;
    pageCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // === PAGE WARP LOOP ===
  let t = 0;
  function drawPageWarp(){
    t += SPEED;
    const w = pageCanvas.width, h = pageCanvas.height;
    pctx.clearRect(0, 0, w, h);
    if(!orig) return;
    for(let y=0;y<h;y++){
      const offsetY = Math.sin((y/25)+t)*PAGE_WARP_INTENSITY;
      const srcY = Math.floor(y/h*orig.height + offsetY);
      const clampedY = Math.min(orig.height-1, Math.max(0, srcY));
      const offsetX = Math.sin((y/40)+t*1.3)*PAGE_WARP_INTENSITY*0.6;
      pctx.drawImage(orig, 0, clampedY, orig.width, 1, offsetX, y, w, 1);
    }
    pageCanvas.style.filter = `hue-rotate(${(t*COLOR_SHIFT_SPEED*100)%360}deg) contrast(1.4) saturate(1.5)`;
  }

  // === FLOATING CUBE ===
  const cube = document.createElement('div');
  cube.style.position = 'fixed';
  cube.style.left = '50%';
  cube.style.top = '50%';
  cube.style.transformStyle = 'preserve-3d';
  cube.style.width = `${CUBE_SIZE}px`;
  cube.style.height = `${CUBE_SIZE}px`;
  cube.style.marginLeft = `-${CUBE_SIZE/2}px`;
  cube.style.marginTop = `-${CUBE_SIZE/2}px`;
  cube.style.perspective = '1200px';
  cube.style.zIndex = 999999;
  cube.style.pointerEvents = 'none';
  document.body.appendChild(cube);

  const faces = [];
  const colors = ['#ff0088','#00ffcc','#ffee00','#ff6600','#44ff00','#8888ff'];
  for(let i=0;i<6;i++){
    const face = document.createElement('canvas');
    face.width = CUBE_SIZE;
    face.height = CUBE_SIZE;
    face.style.position = 'absolute';
    face.style.width = '100%';
    face.style.height = '100%';
    face.style.background = colors[i];
    face.style.opacity = 0.85;
    cube.appendChild(face);
    faces.push(face);
  }

  const half = CUBE_SIZE / 2;
  faces[0].style.transform = `translateZ(${half}px)`; 
  faces[1].style.transform = `rotateY(180deg) translateZ(${half}px)`;
  faces[2].style.transform = `rotateY(-90deg) translateZ(${half}px)`;
  faces[3].style.transform = `rotateY(90deg) translateZ(${half}px)`;
  faces[4].style.transform = `rotateX(90deg) translateZ(${half}px)`;
  faces[5].style.transform = `rotateX(-90deg) translateZ(${half}px)`;

  const fctx = faces.map(f=>f.getContext('2d'));

  // === CUBE WARP DRAW ===
  function drawCubeFaces(){
    if(!orig) return;
    for(let i=0;i<faces.length;i++){
      const ctx = fctx[i];
      const w = CUBE_SIZE, h = CUBE_SIZE;
      ctx.clearRect(0,0,w,h);
      const ampX=8, ampY=5, freqX=25, freqY=15;
      for(let y=0;y<h;y++){
        const offsetY = Math.sin((y/freqY)+t)*ampY;
        const srcY = Math.floor(y/h*orig.height + offsetY);
        const clampedY = Math.min(orig.height-1, Math.max(0, srcY));
        const offsetX = Math.sin((y/freqX)+t*1.3)*ampX;
        ctx.drawImage(orig, 0, clampedY, orig.width, 1, offsetX, y, w, 1);
      }
      faces[i].style.filter = `hue-rotate(${(t*COLOR_SHIFT_SPEED*100 + i*60)%360}deg) saturate(2)`;
    }
  }

  // === CUBE ROTATION + SYNC ===
  let rx=0, ry=0;
  function animate(){
    drawPageWarp();
    drawCubeFaces();
    rx += ROT_SPEED * (1.2 + Math.sin(t*0.4));
    ry += ROT_SPEED * (1.5 + Math.cos(t*0.5));
    cube.style.transform = `
      rotateX(${rx}deg)
      rotateY(${ry}deg)
      scale(${1 + Math.sin(t*0.7)*0.05})
    `;
    window.__dualWarp.raf = requestAnimationFrame(animate);
  }

  // === GLITCH EFFECT ===
  function glitch(){
    const dx = (Math.random()-0.5)*5;
    const dy = (Math.random()-0.5)*5;
    const blur = Math.random()*2+'px';
    document.body.style.filter = `blur(${blur}) hue-rotate(${Math.random()*360}deg)`;
    cube.style.transform += ` translate(${dx}px,${dy}px) rotateZ(${(Math.random()-0.5)*5}deg)`;
  }
  const glitchInt = setInterval(glitch, 400);

  // === ACTIVATE ===
  window.__dualWarp = {
    overlay: pageCanvas,
    cube,
    resizeHandler: resize,
    raf: requestAnimationFrame(animate),
    glitchInt
  };

  console.log('🌐 HyperWarp Dual Dimension active! Run again to disable.');
})();
