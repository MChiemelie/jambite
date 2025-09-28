'use client';

import { useEffect, useRef } from 'react';

export default function Background() {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const handlePointerMove = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      blob.animate(
        {
          left: `${clientX}px`,
          top: `${clientY}px`,
        },
        { duration: 3000, fill: 'forwards' }
      );
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <div
        ref={blobRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
        style={{
          height: '15vmax',
          aspectRatio: '1',
          background: 'linear-gradient(to right, blue, cyan)',
          filter: 'blur(7.5rem)',
          animation: 'rotate 20s infinite',
        }}
      />
      <style jsx>{`
        @keyframes rotate {
          from {
            rotate: 0deg;
          }
          50% {
            scale: 1 1.5;
          }
          to {
            rotate: 360deg;
          }
        }
      `}</style>
    </div>
  );
}
