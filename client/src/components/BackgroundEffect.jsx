import React, { useEffect, useRef } from 'react';

export const BackgroundEffect = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Setup
    const particleCount = 45;
    const particles = [];

    const colors = [
      'rgba(217, 155, 38, ',   // Warm Amber Gold
      'rgba(45, 62, 53, ',     // Forest Green
      'rgba(28, 19, 16, ',     // Deep Espresso
      'rgba(247, 244, 238, '   // Soft Cream Steam Spark
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 0.6,
        colorBase: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.25 + 0.05,
        speedY: Math.random() * 0.4 + 0.15,
        swaySpeed: Math.random() * 0.02 + 0.005,
        swayOffset: Math.random() * Math.PI * 2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.y -= p.speedY;
        p.swayOffset += p.swaySpeed;
        p.x += Math.sin(p.swayOffset) * 0.3;

        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.colorBase}${p.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* 1. HTML5 Canvas Particle System */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Gentle Warm Glow Ambient Orbs (Ultra Low Opacity & Blurring) */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-amberGold-400/08 blur-3xl animate-smoked"></div>
      <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] rounded-full bg-forest-700/06 blur-3xl animate-smoked [animation-delay:4s]"></div>
      <div className="absolute top-2/3 -left-40 w-[600px] h-[600px] rounded-full bg-espresso-900/05 blur-3xl animate-smoked [animation-delay:7s]"></div>
      <div className="absolute -bottom-40 right-1/4 w-[550px] h-[550px] rounded-full bg-amberGold-500/08 blur-3xl animate-smoked [animation-delay:3s]"></div>

      {/* 3. Soft Coffee Steam Wisps */}
      <div className="absolute top-[18%] left-[15%] opacity-15 animate-steam-slow">
        <svg width="48" height="96" viewBox="0 0 48 96" fill="none" stroke="currentColor" className="text-amberGold-600/40 stroke-2">
          <path d="M12,90 Q36,65 12,45 T36,5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-[45%] right-[12%] opacity-15 animate-steam-slow [animation-delay:5s]">
        <svg width="56" height="110" viewBox="0 0 56 110" fill="none" stroke="currentColor" className="text-forest-700/30 stroke-2">
          <path d="M28,100 Q4,75 28,50 T4,5" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute top-[75%] left-[20%] opacity-12 animate-steam-slow [animation-delay:9s]">
        <svg width="40" height="85" viewBox="0 0 40 85" fill="none" stroke="currentColor" className="text-amberGold-500/35 stroke-2">
          <path d="M10,80 Q30,55 10,35 T30,5" strokeLinecap="round" />
        </svg>
      </div>

      {/* 4. Floating Minimal Coffee Bean Accents */}
      <div className="absolute top-[28%] left-[8%] opacity-10 animate-float text-forest-700">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79z" />
        </svg>
      </div>

      <div className="absolute top-[62%] right-[8%] opacity-10 animate-float [animation-delay:3s] text-espresso-900">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79 3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79z" />
        </svg>
      </div>

      {/* 5. Light Grain Texture Mesh */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#1C1310 0.6px, transparent 0.6px)`,
          backgroundSize: '28px 28px'
        }}
      ></div>

    </div>
  );
};
