import React, { useEffect, useState, useRef } from 'react';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef(null);

  useEffect(() => {
    // Hide cursor on mobile / touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }

      // Check if hovering over clickable elements
      const target = e.target;
      const isClickable = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsHovered(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth Lerp Animation loop for trailing ring
    const render = () => {
      const lerp = (start, end, factor) => start + (end - start) * factor;

      ringPos.current.x = lerp(ringPos.current.x, mousePos.current.x, 0.18);
      ringPos.current.y = lerp(ringPos.current.y, mousePos.current.y, 0.18);

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Outer Smooth Trailing Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-forest-700/60 pointer-events-none transition-all duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'scale-150 bg-forest-700/15 border-amberGold-500 shadow-lg'
            : 'scale-100 bg-transparent'
        }`}
        style={{ willChange: 'transform' }}
      ></div>

      {/* Inner Precision Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-amberGold-500 pointer-events-none transition-transform duration-75 ease-out shadow-sm ${
          isHovered ? 'bg-forest-700 scale-125' : 'bg-amberGold-500'
        }`}
        style={{ willChange: 'transform' }}
      ></div>
    </div>
  );
};
