import { useEffect, useRef, useState } from 'react';

export default function Game() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);

const levels = [
  { // Уровень 1: Обучение
    width: 1200, height: 400,
    plats: [
      {x: 0, y: 380, w: 1200, h: 20},
      {x: 300, y: 280, w: 150, h: 10},
      {x: 600, y: 200, w: 30, h: 180, isDoor: true}
    ],
    button: {x: 350, y: 270, w: 40, h: 10, pressed: false},
    coins: [{x: 370, y: 230}, {x: 500, y: 340}],
    portal: {x: 1050, y: 330},
    spawn: {x: 50, y: 300}
  },
  { // Уровень 2: Подъем
    width: 800, height: 1000,
    plats: [
      {x: 0, y: 980, w: 800, h: 20},
      {x: 200, y: 830, w: 150, h: 15},
      {x: 450, y: 680, w: 150, h: 15},
      {x: 200, y: 530, w: 150, h: 15},
      {x: 0, y: 380, w: 500, h: 15}
    ],
    button: {x: 50, y: 370, w: 40, h: 10, pressed: false},
    coins: [{x: 500, y: 630}, {x: 250, y: 480}],
    portal: {x: 700, y: 920},
    spawn: {x: 50, y: 930}
  },
  { // Уровень 3: Двойной коридор (ИСПРАВЛЕН)
    width: 1600, height: 500,
    plats: [
      {x: 0, y: 450, w: 1600, h: 20}, // Пол
      {x: 0, y: 250, w: 1400, h: 15}, // Потолок 1 этажа
      {x: 1400, y: 250, w: 20, h: 200, isDoor: true}, // Дверь
      {x: 1450, y: 350, w: 100, h: 10} // Ступенька к кнопке
    ],
    button: {x: 1500, y: 340, w: 40, h: 10, pressed: false},
    coins: [{x: 800, y: 410}, {x: 200, y: 200}],
    portal: {x: 50, y: 190},
    spawn: {x: 50, y: 400}
  },
  { // Уровень 4: Островки
    width: 1500, height: 400,
    plats: [
      {x: 0, y: 380, w: 250, h: 20},
      {x: 350, y: 300, w: 120, h: 15},
      {x: 550, y: 220, w: 120, h: 15},
      {x: 800, y: 300, w: 120, h: 15},
      {x: 1000, y: 380, w: 500, h: 20}
    ],
    button: {x: 590, y: 210, w: 40, h: 10, pressed: false},
    coins: [{x: 400, y: 260}, {x: 850, y: 260}],
    portal: {x: 1300, y: 330},
    spawn: {x: 50, y: 330}
  },
  { // Уровень 5: Зигзаг
    width: 1000, height: 800,
    plats: [
      {x: 0, y: 780, w: 1000, h: 20},
      {x: 600, y: 650, w: 250, h: 15},
      {x: 150, y: 520, w: 250, h: 15},
      {x: 600, y: 390, w: 250, h: 15},
      {x: 300, y: 250, w: 400, h: 15}
    ],
    button: {x: 350, y: 240, w: 40, h: 10, pressed: false},
    coins: [{x: 700, y: 610}, {x: 200, y: 480}],
    portal: {x: 500, y: 200},
    spawn: {x: 100, y: 730}
  },
  { // Уровень 6: Большой прыжок
    width: 2000, height: 400,
    plats: [
      {x: 0, y: 380, w: 400, h: 20},
      {x: 550, y: 300, w: 200, h: 15},
      {x: 900, y: 220, w: 200, h: 15},
      {x: 1250, y: 300, w: 200, h: 15},
      {x: 1600, y: 380, w: 400, h: 20}
    ],
    button: {x: 980, y: 210, w: 40, h: 10, pressed: false},
    coins: [{x: 650, y: 260}, {x: 1350, y: 260}],
    portal: {x: 1850, y: 330},
    spawn: {x: 50, y: 330}
  },
  { // Уровень 7: Шахта
    width: 1000, height: 1200,
    plats: [
      {x: 0, y: 1180, w: 1000, h: 20},
      {x: 200, y: 1050, w: 600, h: 15},
      {x: 200, y: 900, w: 600, h: 15},
      {x: 200, y: 750, w: 600, h: 15},
      {x: 0, y: 600, w: 300, h: 15},
      {x: 300, y: 600, w: 20, h: 580, isDoor: true}
    ],
    button: {x: 700, y: 740, w: 40, h: 10, pressed: false},
    coins: [{x: 500, y: 1010}, {x: 500, y: 860}],
    portal: {x: 50, y: 550},
    spawn: {x: 500, y: 1130}
  },
  { // Уровень 8: Длинный путь
    width: 2500, height: 400,
    plats: [
      {x: 0, y: 380, w: 2500, h: 20},
      {x: 500, y: 280, w: 200, h: 15},
      {x: 1000, y: 280, w: 200, h: 15},
      {x: 1500, y: 280, w: 200, h: 15},
      {x: 2000, y: 150, w: 20, h: 230, isDoor: true}
    ],
    button: {x: 2300, y: 370, w: 40, h: 10, pressed: false},
    coins: [{x: 600, y: 240}, {x: 1600, y: 240}],
    portal: {x: 2100, y: 330},
    spawn: {x: 50, y: 330}
  },
  { // Уровень 9: Платформер-лабиринт
    width: 1200, height: 800,
    plats: [
      {x: 0, y: 780, w: 1200, h: 20},
      {x: 100, y: 650, w: 200, h: 15},
      {x: 400, y: 520, w: 200, h: 15},
      {x: 700, y: 390, w: 200, h: 15},
      {x: 400, y: 260, w: 200, h: 15},
      {x: 100, y: 130, w: 1000, h: 15}
    ],
    button: {x: 900, y: 120, w: 40, h: 10, pressed: false},
    coins: [{x: 200, y: 610}, {x: 800, y: 350}],
    portal: {x: 150, y: 80},
    spawn: {x: 50, y: 730}
  },
  { // Уровень 10: Финал
    width: 1500, height: 500,
    plats: [
      {x: 0, y: 480, w: 1500, h: 20},
      {x: 200, y: 350, w: 1100, h: 15},
      {x: 200, y: 220, w: 1100, h: 15},
      {x: 1300, y: 220, w: 20, h: 260, isDoor: true}
    ],
    button: {x: 750, y: 210, w: 40, h: 10, pressed: false},
    coins: [{x: 500, y: 310}, {x: 1000, y: 180}],
    portal: {x: 1400, y: 430},
    spawn: {x: 50, y: 430}
  }
];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
      canvas.height = 400;
    };
    window.addEventListener('resize', resize);
    resize();

    const currentLvl = levels[level - 1] || levels[0];
    const player = { ...currentLvl.spawn, width: 30, height: 30, dy: 0, jumpForce: 13, gravity: 0.6, speed: 7, grounded: false };
    const coins = currentLvl.coins.map(c => ({...c, collected: false}));
    const button = { ...currentLvl.button };
    const camera = { x: 0, y: 0 };
    const keys = {};

    // ФУНКЦИИ УПРАВЛЕНИЯ
    const jump = () => {
      if (player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
      }
    };

    const handleKeyDown = (e) => {
      if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "KeyW", "KeyA", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      keys[e.code] = true;
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') jump();
      // Чит-код для тестов (клавиша N)
      if (e.code === 'KeyN') setLevel(prev => (prev < levels.length ? prev + 1 : 1));
    };

    const handleKeyUp = (e) => { keys[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      // Движение
      if (keys['ArrowRight'] || keys['KeyD'] || keys['MobileRight']) player.x += player.speed;
      if (keys['ArrowLeft'] || keys['KeyA'] || keys['MobileLeft']) player.x -= player.speed;

      player.dy += player.gravity;
      player.y += player.dy;
      player.grounded = false;

      // Коллизии платформ
      currentLvl.plats.forEach(plat => {
        if (plat.isDoor && button.pressed) return;
        if (player.x < plat.x + plat.w && player.x + player.width > plat.x &&
            player.y + player.height > plat.y && player.y + player.height < plat.y + 20 && player.dy >= 0) {
          player.grounded = true;
          player.dy = 0;
          player.y = plat.y - player.height;
        }
      });

      // Кнопка
      if (!button.pressed && player.x < button.x + button.w && player.x + player.width > button.x &&
          player.y + player.height > button.y && player.y + player.height < button.y + 10) {
        button.pressed = true;
      }

      // Монеты
      coins.forEach(c => {
        if (!c.collected && Math.hypot((player.x + 15) - c.x, (player.y + 15) - c.y) < 30) {
          c.collected = true;
          setScore(s => s + 10);
        }
      });

      // Портал
      if (coins.every(c => c.collected)) {
        if (Math.hypot((player.x + 15) - currentLvl.portal.x, (player.y + 15) - currentLvl.portal.y) < 40) {
          if (level < levels.length) setLevel(l => l + 1);
          else { alert("ПОБЕДА!"); setLevel(1); setScore(0); }
        }
      }

      // Камера
      camera.x = player.x - canvas.width / 2;
      camera.y = player.y - canvas.height / 2;
      camera.x = Math.max(0, Math.min(camera.x, currentLvl.width - canvas.width));
      camera.y = Math.max(0, Math.min(camera.y, currentLvl.height - canvas.height));

      // Смерть (падение)
      if (player.y > currentLvl.height + 100) {
        player.x = currentLvl.spawn.x;
        player.y = currentLvl.spawn.y;
        player.dy = 0;
      }
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.translate(-camera.x, -camera.y);

      // Платформы
      currentLvl.plats.forEach(p => {
        if (p.isDoor && button.pressed) return;
        ctx.fillStyle = p.isDoor ? '#ef4444' : '#8b5cf6';
        ctx.shadowBlur = 10; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(p.x, p.y, p.w, p.h);
      });

      // Кнопка
      ctx.fillStyle = button.pressed ? '#22c55e' : '#f97316';
      ctx.shadowColor = ctx.fillStyle;
      ctx.fillRect(button.x, button.y, button.w, button.h);

      // Монеты
      ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24';
      coins.forEach(c => !c.collected && ctx.fillRect(c.x, c.y, 12, 12));

      // Игрок
      ctx.fillStyle = '#fff'; ctx.shadowColor = '#fff';
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Портал
      if (coins.every(c => c.collected)) {
        ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 4; ctx.shadowColor = '#22d3ee';
        ctx.strokeRect(currentLvl.portal.x, currentLvl.portal.y, 40, 40);
      }
    };

    const loop = () => {
      update();
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    loop();

    // Экспортируем функции для мобильных кнопок в window, чтобы onClick в React их видел
    window.mobileJump = jump;
    window.setMobileKey = (key, val) => { keys[key] = val; };

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [level]);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-4 font-sans select-none overflow-hidden">
      <div className="flex justify-between w-full max-w-[800px] mb-4 uppercase font-black italic text-xl">
        <span>LVL: {level}</span>
        <span className="text-purple-500">Score: {score}</span>
      </div>

      <div className="relative border-4 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-purple-500/10">
        <canvas ref={canvasRef} className="block touch-none bg-black" />
        
        {/* МОБИЛЬНОЕ УПРАВЛЕНИЕ */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end md:hidden pointer-events-none">
          <div className="flex gap-4 pointer-events-auto">
            <button 
              className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 active:scale-90 transition-transform"
              onTouchStart={() => window.setMobileKey('MobileLeft', true)}
              onTouchEnd={() => window.setMobileKey('MobileLeft', false)}
            >←</button>
            <button 
              className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 active:scale-90 transition-transform"
              onTouchStart={() => window.setMobileKey('MobileRight', true)}
              onTouchEnd={() => window.setMobileKey('MobileRight', false)}
            >→</button>
          </div>
          <button 
            className="w-20 h-20 bg-purple-600/30 backdrop-blur-md rounded-full border-2 border-purple-500 pointer-events-auto active:scale-95 transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)]"
            onTouchStart={() => window.mobileJump()}
          >UP</button>
        </div>
      </div>
      
      <p className="mt-6 text-gray-500 text-[10px] tracking-[0.3em] uppercase">
        {level === 1 ? "Collect all coins & find the button" : "Level " + level + " - Exploring..."}
      </p>
    </div>
  );
}