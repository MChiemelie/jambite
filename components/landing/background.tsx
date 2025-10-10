'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface LastState {
  starTimestamp: number;
  starPosition: Position;
  mousePosition: Position;
}

interface Config {
  starAnimationDuration: number;
  minimumTimeBetweenStars: number;
  minimumDistanceBetweenStars: number;
  glowDuration: number;
  maximumGlowPointSpacing: number;
  colors: string[];
  sizes: string[];
  animations: string[];
}

const Background: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<LastState>({
    starTimestamp: Date.now(),
    starPosition: { x: 0, y: 0 },
    mousePosition: { x: 0, y: 0 },
  });
  const countRef = useRef<number>(0);

  const config: Config = {
    starAnimationDuration: 3000, // Increased duration from 1500ms to 3000ms for slower falling animation
    minimumTimeBetweenStars: 250,
    minimumDistanceBetweenStars: 75,
    glowDuration: 75,
    maximumGlowPointSpacing: 10,
    colors: ['249 146 253', '252 254 255'],
    sizes: ['1.4rem', '1rem', '0.6rem'],
    animations: ['fall-1', 'fall-2', 'fall-3'],
  };

  useEffect(() => {
    const rand = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

    const selectRandom = <T,>(items: T[]): T => items[rand(0, items.length - 1)];

    const calcDistance = (a: Position, b: Position): number => {
      const diffX = b.x - a.x;
      const diffY = b.y - a.y;
      return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    };

    const createStar = (position: Position): void => {
      if (!containerRef.current) return;

      const star = document.createElement('div');
      const color = selectRandom(config.colors);

      const emojis = ['✔️', '🏆', '🥇', '🎉', '🎊', '✨', '🔥', '💯', '👑', '💻', '⌨️', '😁', '📚', '🤗', '📖', '🤖', '🥳', '🏅', '🎖️', '✅', '🌟', '🚀'];
      const randomEmoji = selectRandom(emojis);

      star.className = 'absolute pointer-events-none z-10';
      star.style.left = `${position.x}px`;
      star.style.top = `${position.y}px`;
      star.style.fontSize = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animation = `${config.animations[countRef.current++ % 3]} ${config.starAnimationDuration}ms forwards`;
      star.innerHTML = randomEmoji;

      containerRef.current.appendChild(star);

      setTimeout(() => {
        if (containerRef.current && star.parentNode === containerRef.current) {
          containerRef.current.removeChild(star);
        }
      }, config.starAnimationDuration);
    };

    const createGlowPoint = (position: Position): void => {
      if (!containerRef.current) return;

      const glow = document.createElement('div');
      glow.className = 'absolute pointer-events-none';
      glow.style.left = `${position.x}px`;
      glow.style.top = `${position.y}px`;
      glow.style.boxShadow = '0rem 0rem 1.2rem 0.6rem rgb(56 189 248 / 0.8)';
      glow.style.background = 'radial-gradient(circle, rgba(56, 189, 248, 0.7), rgba(59, 130, 246, 0.5), rgba(34, 211, 238, 0.3), transparent)';

      containerRef.current.appendChild(glow);

      setTimeout(() => {
        if (containerRef.current && glow.parentNode === containerRef.current) {
          containerRef.current.removeChild(glow);
        }
      }, config.glowDuration);
    };

    const determinePointQuantity = (distance: number): number => Math.max(Math.floor(distance / config.maximumGlowPointSpacing), 1);

    const createGlow = (last: Position, current: Position): void => {
      const distance = calcDistance(last, current);
      const quantity = determinePointQuantity(distance);

      const dx = (current.x - last.x) / quantity;
      const dy = (current.y - last.y) / quantity;

      Array.from(Array(quantity)).forEach((_, index) => {
        const x = last.x + dx * index;
        const y = last.y + dy * index;
        createGlowPoint({ x, y });
      });
    };

    const updateLastStar = (position: Position): void => {
      lastRef.current.starTimestamp = Date.now();
      lastRef.current.starPosition = position;
    };

    const updateLastMousePosition = (position: Position): void => {
      lastRef.current.mousePosition = position;
    };

    const adjustLastMousePosition = (position: Position): void => {
      if (lastRef.current.mousePosition.x === 0 && lastRef.current.mousePosition.y === 0) {
        lastRef.current.mousePosition = position;
      }
    };

    const handleOnMove = (e: MouseEvent | Touch): void => {
      const mousePosition: Position = { x: e.clientX, y: e.clientY };

      adjustLastMousePosition(mousePosition);

      const now = Date.now();
      const hasMovedFarEnough = calcDistance(lastRef.current.starPosition, mousePosition) >= config.minimumDistanceBetweenStars;
      const hasBeenLongEnough = now - lastRef.current.starTimestamp > config.minimumTimeBetweenStars;

      if (hasMovedFarEnough || hasBeenLongEnough) {
        createStar(mousePosition);
        updateLastStar(mousePosition);
      }

      createGlow(lastRef.current.mousePosition, mousePosition);
      updateLastMousePosition(mousePosition);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      handleOnMove(e);
    };

    const handleTouchMove = (e: TouchEvent): void => {
      if (e.touches.length > 0) {
        handleOnMove(e.touches[0]);
      }
    };

    const handleMouseLeave = (): void => {
      updateLastMousePosition({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes fall-1 {
          0% {
            transform: translate(0px, 0px) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(0.25);
            opacity: 0;
          }
          5% {
            transform: translate(10px, -10px) rotateX(45deg) rotateY(30deg) rotateZ(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(25px, 200px) rotateX(180deg) rotateY(270deg) rotateZ(90deg) scale(1);
            opacity: 0;
          }
        }

        @keyframes fall-2 {
          0% {
            transform: translate(0px, 0px) rotateX(-20deg) rotateY(10deg) scale(0.25);
            opacity: 0;
          }
          10% {
            transform: translate(-10px, -5px) rotateX(-20deg) rotateY(10deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-10px, 160px) rotateX(-90deg) rotateY(45deg) scale(0.25);
            opacity: 0;
          }
        }

        @keyframes fall-3 {
          0% {
            transform: translate(0px, 0px) rotateX(0deg) rotateY(45deg) scale(0.5);
            opacity: 0;
          }
          15% {
            transform: translate(7px, 5px) rotateX(0deg) rotateY(45deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(20px, 120px) rotateX(-180deg) rotateY(-90deg) scale(0.5);
            opacity: 0;
          }
        }
      `}</style>

      <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden pointer-events-none" />
    </>
  );
};

export default Background;
