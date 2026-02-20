import React, { useMemo } from 'react';

const Crystal = ({ color }) => {
  // Случайные параметры для каждого кристалла
  const size = useMemo(() => Math.random() * 100 + 50, []);
  const duration = useMemo(() => Math.random() * 20 + 15, []);
  const delay = useMemo(() => Math.random() * -20, []);
  const top = useMemo(() => Math.random() * 100, []);
  const left = useMemo(() => Math.random() * 100, []);

  return (
    <div 
      className="absolute"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        perspective: '1000px',
        animation: `float ${duration}s ease-in-out infinite alternate`,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="relative animate-spin-slow" 
           style={{ 
             width: size, 
             height: size, 
             transformStyle: 'preserve-3d',
             animationDuration: `${duration * 0.8}s`
           }}>
        
        {/* Грань 1 */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-40`}
             style={{ 
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               transform: 'rotateY(0deg) translateZ(20px) rotateX(30deg)' 
             }}></div>
        
        {/* Грань 2 */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-30`}
             style={{ 
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               transform: 'rotateY(120deg) translateZ(20px) rotateX(30deg)' 
             }}></div>
        
        {/* Грань 3 */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${color} opacity-50`}
             style={{ 
               clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
               transform: 'rotateY(240deg) translateZ(20px) rotateX(30deg)' 
             }}></div>

        {/* Неоновое свечение внутри */}
        <div className={`absolute inset-0 blur-2xl opacity-20 bg-gradient-to-r ${color}`}></div>
      </div>
    </div>
  );
};

const AnimatedBackground = () => {
  const crystals = [
    { color: 'from-purple-500 to-indigo-600' },
    { color: 'from-fuchsia-500 to-pink-600' },
    { color: 'from-blue-400 to-purple-600' },
    { color: 'from-violet-600 to-fuchsia-400' },
    { color: 'from-purple-400 to-blue-500' },
  ];

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {crystals.map((c, i) => (
        <Crystal key={i} color={c.color} />
      ))}
      
      {/* Дополнительный виньетированный фон для глубины */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)]"></div>
    </div>
  );
};

export default AnimatedBackground;