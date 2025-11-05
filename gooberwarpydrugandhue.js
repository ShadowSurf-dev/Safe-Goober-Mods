javascript:(()=>{
  SPEED=0.2 // OVER HERE CHANGE FOR FASTER
  const orig=document.querySelector('#canvas');
  if(!orig){alert('Canvas not found');return;}

  if(window.__liquidWarp){
    cancelAnimationFrame(window.__liquidWarp.raf);
    window.removeEventListener('resize',window.__liquidWarp.resizeHandler);
    window.__liquidWarp.overlay.remove();
    window.__liquidWarp=null;
    return;
  }

  const overlay=document.createElement('canvas');
  overlay.style.position='absolute';
  overlay.style.left='0px';
  overlay.style.top='0px';
  overlay.style.pointerEvents='none';
  overlay.style.zIndex=999999;
  document.body.appendChild(overlay);

  const ctx=overlay.getContext('2d');

  // Resize function to fill the screen
  function resize(){
    overlay.width = window.innerWidth;
    overlay.height = window.innerHeight;
    overlay.style.width = window.innerWidth+'px';
    overlay.style.height = window.innerHeight+'px';
  }
  resize();
  window.addEventListener('resize', resize);

  let t=0;

  function loop(){
    t+=SPEED; // speed of waves

    const w=overlay.width;
    const h=overlay.height;

    // Clear overlay
    ctx.clearRect(0,0,w,h);

    const ampX=8, ampY=4;
    const freqX=25, freqY=15;

    for(let y=0;y<h;y++){
      const offsetY=Math.sin((y/freqY)+t)*ampY;
      const rowHeight=1;

      // Map y to original canvas coordinates
      const srcY=Math.floor(y / h * orig.height + offsetY);
      const clampedY=Math.min(orig.height-1, Math.max(0, srcY));

      // Horizontal offset for wave
      const offsetX=Math.sin((y/freqX)+t*1.5)*ampX;

      ctx.drawImage(orig, 0, clampedY, orig.width, 1, offsetX, y, w, 1);
    }

    overlay.style.filter=`hue-rotate(${(t*20)%360}deg)`;

    window.__liquidWarp.raf=requestAnimationFrame(loop);
  }

  window.__liquidWarp={raf:requestAnimationFrame(loop),overlay:overlay,resizeHandler:resize};
})();
