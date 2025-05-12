// 'use client';

// import React, { useEffect, useState } from 'react';

// export default function Countdown() {
//   const [timeLeft, setTimeLeft] = useState({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });

//   useEffect(() => {
//     const targetDate = new Date('2025-01-18T00:00:00').getTime();

//     const updateCountdown = () => {
//       const now = new Date().getTime();
//       const distance = targetDate - now;

//       if (distance <= 0) {
//         setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//         return;
//       }

//       const days = Math.floor(distance / (1000 * 60 * 60 * 24));
//       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

//       setTimeLeft({ days, hours, minutes, seconds });
//     };

//     updateCountdown();
//     const interval = setInterval(updateCountdown, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="flex flex-col justify-center items-center p-4 text-center mx-auto w-full">
//       <h1 className="text-lg font-extrabold">Countdown to Exam</h1>
//       <div className="flex gap-4 mt-4">
//         {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
//           <div key={unit} className="flex flex-col items-center">
//             <div className="flip-clock">
//               <FlipCard value={timeLeft[unit]} />
//             </div>
//             <p className="text-xs">{unit === 'days' ? 'days' : unit === 'hours' ? 'hrs' : unit === 'minutes' ? 'mins' : 'secs'}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function FlipCard({ value }) {
//   const [prevValue, setPrevValue] = useState(value);
//   const [isFlipping, setIsFlipping] = useState(false);

//   useEffect(() => {
//     if (value !== prevValue) {
//       setIsFlipping(true);

//       const timeout = setTimeout(() => {
//         setPrevValue(value);
//         setIsFlipping(false);
//       }, 600);

//       return () => clearTimeout(timeout);
//     }
//   }, [value, prevValue]);

//   return (
//     <div className="flip-card">
//       <div className={`flip-card-inner ${isFlipping ? 'flip' : ''}`}>
//         <div className="flip-card-front">{prevValue}</div>
//         <div className="flip-card-back">{value}</div>
//       </div>
//     </div>
//   );
// }
