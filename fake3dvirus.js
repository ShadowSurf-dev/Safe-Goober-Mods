javascript:(function(){
  if(window.__virus3DActive) return; 
  window.__virus3DActive = true;

  // Add a container div that wraps the whole body content to shake it
  const container = document.createElement('div');
  container.id = '__virus3D_container';
  container.style.position = 'relative';
  container.style.transformStyle = 'preserve-3d';
  container.style.perspective = '1200px';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.overflow = 'visible';
  container.style.transition = 'none';

  // Move all body children into container
  while(document.body.firstChild){
    container.appendChild(document.body.firstChild);
  }
  document.body.appendChild(container);
  document.body.style.overflow = 'hidden';

  const allEls = [...container.querySelectorAll('*')].filter(el => {
    // only visible elements
    const style = getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0 && el.offsetHeight > 0;
  });

  // Disable any CSS transitions/animations on all elements for max glitch
  allEls.forEach(el => {
    el.style.transition = 'none !important';
    el.style.willChange = 'transform';
  });

  // Function to apply random 3D transforms continuously
  function glitch3D(){
    allEls.forEach(el => {
      const rx = (Math.random() - 0.5) * 45;  // rotateX -22.5 to 22.5 deg
      const ry = (Math.random() - 0.5) * 45;  // rotateY
      const rz = (Math.random() - 0.5) * 30;  // rotateZ smaller range

      const tx = (Math.random() - 0.5) * 30;  // translateX -15 to 15 px
      const ty = (Math.random() - 0.5) * 30;  // translateY
      const tz = (Math.random() - 0.5) * 100; // translateZ -50 to 50 px

      const sx = 1 + (Math.random() - 0.5) * 0.5; // scaleX 0.75 to 1.25
      const sy = 1 + (Math.random() - 0.5) * 0.5; // scaleY

      const skewX = (Math.random() - 0.5) * 15; // skewX degrees
      const skewY = (Math.random() - 0.5) * 15; // skewY degrees

      el.style.transform = `
        perspective(800px)
        translate3d(${tx}px, ${ty}px, ${tz}px)
        rotateX(${rx}deg)
        rotateY(${ry}deg)
        rotateZ(${rz}deg)
        scale(${sx}, ${sy})
        skew(${skewX}deg, ${skewY}deg)
      `;

      // Add some blur and brightness flicker for distortion
      const blur = Math.random() * 2 + 'px';
      const brightness = 0.7 + Math.random() * 0.6;
      el.style.filter = `blur(${blur}) brightness(${brightness})`;
    });

    // Shake the whole container for extra chaos
    const cx = (Math.random() - 0.5) * 20;
    const cy = (Math.random() - 0.5) * 20;
    const cz = (Math.random() - 0.5) * 100;
    container.style.transform = `translate3d(${cx}px, ${cy}px, ${cz}px) rotateZ(${(Math.random() - 0.5) * 10}deg)`;
  }

  // Run glitch3D every 100ms
  window.__virus3DInterval = setInterval(glitch3D, 100);

  // Cleanup function (call virus3DCleanup() in console to restore)
  window.virus3DCleanup = function(){
    clearInterval(window.__virus3DInterval);
    allEls.forEach(el => {
      el.style.transform = '';
      el.style.filter = '';
      el.style.transition = '';
      el.style.willChange = '';
    });
    container.style.transform = '';
    // Move content back out of container
    while(container.firstChild){
      document.body.appendChild(container.firstChild);
    }
    container.remove();
    document.body.style.overflow = '';
    window.__virus3DActive = false;
    delete window.virus3DCleanup;
  };

  alert('3D virus effect activated! Run virus3DCleanup() in console to remove it.');
})();
