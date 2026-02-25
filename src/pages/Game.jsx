import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials are missing! Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default function Game() {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  
  // Состояния игры
  const [gameState, setGameState] = useState('MENU'); // MENU, LEVELS, ENDLESS, GAMEOVER
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [playerName, setPlayerName] = useState('');

useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('name, score')
        .order('score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setLeaderboard(data || []);
    } catch (e) {
      console.error("Ошибка загрузки рейтинга:", e.message);
    }
  };

  fetchLeaderboard();
}, [gameState]); // Обновляем при смене состояний (например, после игры)


  // Данные уровней остаются те же (я сократил для примера, используй свои старые)
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

  const saveScore = async () => {
    if (!playerName.trim()) {
      alert("Пожалуйста, введи имя!");
      return;
    }

    try {
      // 1. Отправляем данные в Supabase
      const { error } = await supabase
        .from('leaderboard')
        .insert([{ name: playerName, score: score }]);

      if (error) throw error;

      // 2. Сразу загружаем свежий ТОП, чтобы игрок увидел себя
      const { data: freshData, error: fetchError } = await supabase
        .from('leaderboard')
        .select('name, score')
        .order('score', { ascending: false })
        .limit(10);

      if (fetchError) throw fetchError;
      
      setLeaderboard(freshData || []);
      
      // 3. Сбрасываем состояние и выходим в меню
      setGameState('MENU');
      setScore(0);
      setPlayerName('');
    } catch (e) {
      console.error("Ошибка при сохранении:", e.message);
      alert("Не удалось сохранить результат. Проверь консоль!");
    }
  };

  useEffect(() => {
    if (gameState === 'MENU' || gameState === 'GAMEOVER') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
      canvas.height = 500;
    };
    window.addEventListener('resize', resize);
    resize();

    const isEndless = gameState === 'ENDLESS';
    const currentLvl = isEndless ? { width: canvas.width, height: 1000000 } : (levels[level - 1] || levels[0]);
    
    // Исправленный спавн: берем координаты из уровня или центра экрана
    let player = { 
      x: isEndless ? canvas.width / 2 - 15 : currentLvl.spawn.x, 
      y: isEndless ? canvas.height - 150 : currentLvl.spawn.y, 
      width: 30, height: 30, dy: 0, jumpForce: 14, gravity: 0.6, speed: 7, grounded: false 
    };

    let platforms = isEndless ? [] : [...currentLvl.plats];
    let coins = isEndless ? [] : currentLvl.coins.map(c => ({...c, collected: false}));
    let button = isEndless ? { pressed: true } : { ...currentLvl.button, pressed: false };
    let camera = { x: 0, y: 0 };
    let keys = {};

    // ГАРАНТИРОВАННАЯ ПЛАТФОРМА ПОД ИГРОКОМ ПРИ СПАВНЕ
    if (isEndless) {
      platforms.push({ x: player.x - 35, y: player.y + 50, w: 100, h: 15 }); // Стартовая платформа
      for (let i = 1; i < 10; i++) {
        platforms.push({ 
          x: Math.random() * (canvas.width - 100), 
          y: (canvas.height - 150) - (i * 120), 
          w: 100, h: 15 
        });
      }
    }

    const jump = () => { if (player.grounded) { player.dy = -player.jumpForce; player.grounded = false; } };

    const handleKeyDown = (e) => {
      if (["Space", "ArrowUp", "KeyW"].includes(e.code)) { e.preventDefault(); jump(); }
      keys[e.code] = true;
    };
    const handleKeyUp = (e) => { keys[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (keys['ArrowRight'] || keys['KeyD'] || keys['MobileRight']) player.x += player.speed;
      if (keys['ArrowLeft'] || keys['KeyA'] || keys['MobileLeft']) player.x -= player.speed;

      player.dy += player.gravity;
      player.y += player.dy;
      player.grounded = false;

      // Коллизии платформ
      platforms.forEach(p => {
        if (p.isDoor && button.pressed) return;
        if (player.x < p.x + p.w && player.x + player.width > p.x &&
            player.y + player.height > p.y && player.y + player.height < p.y + 20 && player.dy >= 0) {
          player.grounded = true; 
          player.dy = 0; 
          player.y = p.y - player.height;
          if (isEndless) player.dy = -player.jumpForce; // Doodle Jump эффект
        }
      });

      // Сбор монеток (только в режиме уровней)
      if (!isEndless) {
        coins.forEach(c => {
          if (!c.collected && Math.hypot((player.x + 15) - c.x, (player.y + 15) - c.y) < 30) {
            c.collected = true;
            setScore(s => s + 10);
          }
        });

        // Кнопка
        if (!button.pressed && player.x < button.x + button.w && player.x + player.width > button.x &&
            player.y + player.height > button.y && player.y + player.height < button.y + 10) {
          button.pressed = true;
        }

        // Портал
        if (coins.every(c => c.collected) && Math.hypot((player.x + 15) - currentLvl.portal.x, (player.y + 15) - currentLvl.portal.y) < 40) {
          if (level < levels.length) setLevel(l => l + 1);
          else setGameState('GAMEOVER');
        }
      }

      // Логика бесконечного режима
      if (isEndless) {
        if (player.y < camera.y + 250) camera.y = player.y - 250;
        platforms = platforms.filter(p => p.y < camera.y + canvas.height + 100);
        while (platforms.length < 15) {
          const lastP = platforms[platforms.length - 1];
          platforms.push({
            x: Math.random() * (canvas.width - 100),
            y: lastP.y - (100 + Math.random() * 50),
            w: 80, h: 15
          });
          setScore(s => s + 1);
        }
        if (player.y > camera.y + canvas.height) setGameState('GAMEOVER');
      } else {
        // Камера уровней
        camera.x = Math.max(0, Math.min(player.x - canvas.width / 2, currentLvl.width - canvas.width));
        camera.y = Math.max(0, Math.min(player.y - canvas.height / 2, currentLvl.height - canvas.height));
        if (player.y > currentLvl.height + 100) { player.x = currentLvl.spawn.x; player.y = currentLvl.spawn.y; player.dy = 0; }
      }
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(-camera.x, -camera.y);

      // Платформы
      platforms.forEach(p => {
        if (p.isDoor && button.pressed) return;
        ctx.fillStyle = p.isDoor ? '#ef4444' : '#8b5cf6';
        ctx.shadowBlur = 15; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(p.x, p.y, p.w, p.h);
      });

      // МОНЕТКИ (Отрисовка)
      if (!isEndless) {
        ctx.fillStyle = '#fbbf24'; ctx.shadowColor = '#fbbf24';
        coins.forEach(c => {
          if (!c.collected) {
            ctx.beginPath();
            ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        });

        // Портал
        if (coins.every(c => c.collected)) {
          ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 4; ctx.shadowColor = '#22d3ee';
          ctx.strokeRect(currentLvl.portal.x, currentLvl.portal.y, 40, 40);
        }

        // Кнопка
        ctx.fillStyle = button.pressed ? '#22c55e' : '#f97316';
        ctx.fillRect(button.x, button.y, button.w, button.h);
      }

      // Игрок
      ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#fff';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    const loop = () => { update(); draw(); requestRef.current = requestAnimationFrame(loop); };
    loop();

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, level]);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen text-white p-4 font-sans select-none overflow-hidden">
      
      {gameState === 'MENU' && (
        <div className="flex flex-col items-center gap-6 mt-20 animate-in fade-in zoom-in duration-500">
          <h1 className="text-6xl font-black italic tracking-tighter text-purple-500 shadow-purple-500/50 drop-shadow-lg">TMIFK RUN</h1>
          <div className="flex gap-4">
            <button onClick={() => setGameState('LEVELS')} className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-purple-500 hover:text-white transition-all">УРОВНИ</button>
            <button onClick={() => setGameState('ENDLESS')} className="px-8 py-4 border-2 border-white rounded-2xl font-bold hover:bg-white hover:text-black transition-all">БЕСКОНЕЧНЫЙ</button>
          </div>
          <div className="mt-10 w-full max-w-xs bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-center text-gray-400 uppercase text-xs tracking-widest mb-4">Топ игроков</h2>
            {leaderboard.map((item, i) => (
              <div key={i} className="flex justify-between mb-2 font-mono text-sm">
                <span>{i+1}. {item.name}</span>
                <span className="text-purple-400">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
          <h2 className="text-4xl font-black mb-2">ИГРА ОКОНЧЕНА</h2>
          <p className="text-purple-500 text-xl font-mono mb-6">ТВОЙ СЧЕТ: {score}</p>
          <input 
            type="text" 
            placeholder="ВВЕДИ ИМЯ..." 
            className="bg-white/10 border border-white/20 p-4 rounded-2xl mb-4 w-full max-w-xs text-center outline-none focus:border-purple-500 transition-all"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          />
          <button onClick={saveScore} className="w-full max-w-xs p-4 bg-purple-600 rounded-2xl font-bold hover:scale-105 transition-transform">СОХРАНИТЬ РЕКОРД</button>
        </div>
      )}

      {(gameState === 'LEVELS' || gameState === 'ENDLESS') && (
        <>
          <div className="flex justify-between w-full max-w-[800px] mb-4 uppercase font-black italic text-xl">
            <span>{gameState === 'ENDLESS' ? 'ENDLESS' : `LVL: ${level}`}</span>
            <span className="text-purple-500">Score: {score}</span>
          </div>
          <div className="relative border-4 border-white/5 rounded-[2rem] overflow-hidden">
            <canvas ref={canvasRef} className="block touch-none bg-black" />
          </div>
        </>
      )}
    </div>
  );
}