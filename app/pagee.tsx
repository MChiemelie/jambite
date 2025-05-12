'use client';

import React, { useEffect, useRef } from 'react';

const MouseMoveComponent = () => {
  const blobRef = useRef(null);
  const h1Ref = useRef(null);
  const intervalRef = useRef(null);
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Update blob position on pointer move
  useEffect(() => {
    const handlePointerMove = (event) => {
      if (blobRef.current) {
        blobRef.current.animate(
          {
            left: `${event.clientX}px`,
            top: `${event.clientY}px`,
          },
          { duration: 3000, fill: 'forwards' }
        );
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Handle text scramble effect on mouse over
  const handleMouseOver = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (h1Ref.current) {
        h1Ref.current.innerText = h1Ref.current.innerText
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return h1Ref.current.dataset.value[index];
            }
            return letters[Math.floor(Math.random() * 26)];
          })
          .join('');

        if (iteration >= h1Ref.current.dataset.value.length) {
          clearInterval(intervalRef.current);
        }
        iteration += 1 / 3;
      }
    }, 30);
  };

  return (
    <div className="landing-container">
      <div id="blob" ref={blobRef}></div>
      <div id="blur"></div>
      <h1 data-value="MOUSEMOVE" ref={h1Ref} onMouseOver={handleMouseOver}>
        MOUSEMOVE
      </h1>

      <style jsx>{`
        .landing-container {
          height: 100vh;
          margin: 0;
          overflow: hidden;
          position: relative;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          50% {
            transform: scale(1, 1.5);
          }
          to {
            transform: rotate(360deg);
          }
        }
        #blob {
          background-color: white;
          height: 34vmax;
          width: 34vmax; /* using width to maintain a square shape */
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: linear-gradient(to right, aquamarine, mediumpurple);
          animation: rotate 20s infinite;
          opacity: 0.8;
        }
        #blur {
          height: 100%;
          width: 100%;
          position: absolute;
          z-index: 2;
          backdrop-filter: blur(12vmax);
        }
        h1 {
          font-family: 'Space Mono', monospace;
          font-size: clamp(3rem, 10vw, 10rem);
          color: white;
          white-space: nowrap;
          padding: 0 clamp(1rem, 2vw, 3rem);
          border-radius: clamp(0.4rem, 0.75vw, 1rem);
          margin: 0;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 3;
        }
      `}</style>
    </div>
  );
};

export default MouseMoveComponent;

// import { Hero, Values, Footer, Join, Stake, Testimonials } from '@/components/landing';

// export default function LandingPage() {
//   return (
//     <div className="gap-10">
//       {/*<Hero />*/}
//       <Stake />
//       {/* <Features />
//       <Testimonials />
//       <Join />
//       <Footer /> */}
//     </div>
//   );
// }
