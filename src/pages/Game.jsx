import { useEffect, useRef, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Game() {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  const [gameState, setGameState] = useState('MENU');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase.from('leaderboard').select('name, score').order('score', { ascending: false }).limit(10);
      if (data) setLeaderboard(data);
    };
    fetchLeaderboard();
  }, [gameState]);

  const handleAuth = async (e) => {
    e.preventDefault();
    const { error } = isSignUp ? await supabase.auth.signUp({ email, password }) : await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else if (isSignUp) alert("Готово! Теперь войдите.");
  };

  const handleLogout = () => supabase.auth.signOut();

  const saveScore = async () => {
    if (!user || isSaving) return;
    setIsSaving(true);
    try {
      const { data: existingEntry } = await supabase.from('leaderboard').select('score').eq('user_id', user.id).maybeSingle();
      if (existingEntry && score <= existingEntry.score) {
        setGameState('MENU'); setScore(0); return;
      }
      await supabase.from('leaderboard').upsert({ user_id: user.id, name: user.email.split('@')[0], score: score }, { onConflict: 'user_id' });
      setGameState('MENU'); setScore(0);
    } catch (e) { alert("Ошибка: " + e.message); } finally { setIsSaving(false); }
  };

  const levels = [
    { width: 1200, height: 400, plats: [{x: 0, y: 380, w: 1200, h: 20}, {x: 300, y: 280, w: 150, h: 10}, {x: 600, y: 200, w: 30, h: 180, isDoor: true}], button: {x: 350, y: 270, w: 40, h: 10, pressed: false}, coins: [{x: 370, y: 230}, {x: 500, y: 340}], portal: {x: 1050, y: 330}, spawn: {x: 50, y: 300} },
    { width: 800, height: 1000, plats: [{x: 0, y: 980, w: 800, h: 20}, {x: 200, y: 830, w: 150, h: 15}, {x: 450, y: 680, w: 150, h: 15}, {x: 200, y: 530, w: 150, h: 15}, {x: 0, y: 380, w: 500, h: 15}], button: {x: 50, y: 370, w: 40, h: 10, pressed: false}, coins: [{x: 500, y: 630}, {x: 250, y: 480}], portal: {x: 700, y: 920}, spawn: {x: 50, y: 930} },
    { width: 1600, height: 500, plats: [{x: 0, y: 450, w: 1600, h: 20}, {x: 0, y: 250, w: 1400, h: 15}, {x: 1400, y: 250, w: 20, h: 200, isDoor: true}, {x: 1450, y: 350, w: 100, h: 10}], button: {x: 1500, y: 340, w: 40, h: 10, pressed: false}, coins: [{x: 800, y: 410}, {x: 200, y: 200}], portal: {x: 50, y: 190}, spawn: {x: 50, y: 400} },
    { width: 1500, height: 400, plats: [{x: 0, y: 380, w: 250, h: 20}, {x: 350, y: 300, w: 120, h: 15}, {x: 550, y: 220, w: 120, h: 15}, {x: 800, y: 300, w: 120, h: 15}, {x: 1000, y: 380, w: 500, h: 20}], button: {x: 590, y: 210, w: 40, h: 10, pressed: false}, coins: [{x: 400, y: 260}, {x: 850, y: 260}], portal: {x: 1300, y: 330}, spawn: {x: 50, y: 330} },
    { width: 1000, height: 800, plats: [{x: 0, y: 780, w: 1000, h: 20}, {x: 600, y: 650, w: 250, h: 15}, {x: 150, y: 520, w: 250, h: 15}, {x: 600, y: 390, w: 250, h: 15}, {x: 300, y: 250, w: 400, h: 15}], button: {x: 350, y: 240, w: 40, h: 10, pressed: false}, coins: [{x: 700, y: 610}, {x: 200, y: 480}], portal: {x: 500, y: 200}, spawn: {x: 100, y: 730} }
  ];

  useEffect(() => {
    if (gameState === 'MENU' || gameState === 'GAMEOVER') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 40;
      canvas.height = 500;
    };
    window.addEventListener('resize', resize);
    resize();

    const isEndless = gameState === 'ENDLESS';
    const currentLvl = isEndless ? { width: canvas.width, height: 1000000 } : (levels[level - 1] || levels[0]);
    
    let player = { 
      x: isEndless ? canvas.width / 2 - 15 : currentLvl.spawn.x, 
      y: isEndless ? canvas.height - 150 : currentLvl.spawn.y, 
      width: 30, height: 30, dy: 0, jumpForce: 14, gravity: 0.6, speed: 7, grounded: false 
    };

    let platforms = isEndless 
      ? [{ x: player.x - 35, y: player.y + 50, w: 100, h: 15 }] // Начальная платформа
      : [...currentLvl.plats];
    
    let coins = isEndless ? [] : currentLvl.coins.map(c => ({...c, collected: false}));
    let button = isEndless ? { pressed: true } : { ...currentLvl.button, pressed: false };
    let camera = { x: 0, y: 0 };
    let keys = {};

    const jump = () => { if (player.grounded) { player.dy = -player.jumpForce; player.grounded = false; } };
    const handleKeyDown = (e) => { if (["Space", "ArrowUp", "KeyW"].includes(e.code)) { e.preventDefault(); jump(); } keys[e.code] = true; };
    const handleKeyUp = (e) => { keys[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
      if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;

      player.dy += player.gravity;
      player.y += player.dy;
      player.grounded = false;

      if (player.x > canvas.width) player.x = -player.width;
      if (player.x < -player.width) player.x = canvas.width;

      platforms.forEach(p => {
        if (p.isDoor && button.pressed) return;
        if (player.x < p.x + p.w && player.x + player.width > p.x &&
            player.y + player.height > p.y && player.y + player.height < p.y + 20 && player.dy >= 0) {
          player.grounded = true; 
          player.dy = isEndless ? -player.jumpForce : 0; 
          player.y = p.y - player.height;
        }
      });

      if (!isEndless) {
        coins.forEach(c => {
          if (!c.collected && Math.hypot((player.x + 15) - c.x, (player.y + 15) - c.y) < 30) {
            c.collected = true; setScore(s => s + 10);
          }
        });
        if (!button.pressed && player.x < button.x + button.w && player.x + player.width > button.x &&
            player.y + player.height > button.y && player.y + player.height < button.y + 10) {
          button.pressed = true;
        }
        if (coins.every(c => c.collected) && Math.hypot((player.x + 15) - currentLvl.portal.x, (player.y + 15) - currentLvl.portal.y) < 40) {
          if (level < levels.length) setLevel(l => l + 1);
          else { alert("ПОЗДРАВЛЯЕМ!"); setGameState('MENU'); setScore(0); setLevel(1); }
        }
      }

      if (isEndless) {
        if (player.y < camera.y + 250) camera.y = player.y - 250;
        platforms = platforms.filter(p => p.y < camera.y + canvas.height + 100);
        while (platforms.length < 20) {
          const lastP = platforms[platforms.length - 1];
          const minX = Math.max(0, lastP.x - 200);
          const maxX = Math.min(canvas.width - 80, lastP.x + 200);
          const nextX = minX + Math.random() * (maxX - minX);
          const nextY = lastP.y - (80 + Math.random() * 45);
          platforms.push({ x: nextX, y: nextY, w: 80, h: 15 });
          setScore(s => s + 1);
        }
        if (player.y > camera.y + canvas.height) setGameState('GAMEOVER');
      } else {
        camera.x = Math.max(0, Math.min(player.x - canvas.width / 2, currentLvl.width - canvas.width));
        camera.y = Math.max(0, Math.min(player.y - canvas.height / 2, currentLvl.height - canvas.height));
        if (player.y > currentLvl.height + 100) { player.x = currentLvl.spawn.x; player.y = currentLvl.spawn.y; player.dy = 0; }
      }
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.translate(-camera.x, -camera.y);
      platforms.forEach(p => {
        if (p.isDoor && button.pressed) return;
        ctx.fillStyle = p.isDoor ? '#ef4444' : '#8b5cf6'; ctx.shadowBlur = 15; ctx.shadowColor = ctx.fillStyle;
        ctx.fillRect(p.x, p.y, p.w, p.h);
      });
      if (!isEndless) {
        ctx.fillStyle = '#fbbf24'; coins.forEach(c => { if (!c.collected) { ctx.beginPath(); ctx.arc(c.x, c.y, 6, 0, Math.PI * 2); ctx.fill(); } });
        if (coins.every(c => c.collected)) { ctx.strokeStyle = '#22d3ee'; ctx.lineWidth = 4; ctx.strokeRect(currentLvl.portal.x, currentLvl.portal.y, 40, 40); }
        ctx.fillStyle = button.pressed ? '#22c55e' : '#f97316'; ctx.fillRect(button.x, button.y, button.w, button.h);
      }
      ctx.fillStyle = '#fff'; ctx.shadowBlur = 20; ctx.shadowColor = '#fff'; ctx.fillRect(player.x, player.y, player.width, player.height);
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
        <div className="flex flex-col items-center gap-6 mt-10 w-full max-w-md">
          <h1 className="text-6xl font-black italic tracking-tighter text-purple-500">TMIFK RUN</h1>
          {!user ? (
            <form onSubmit={handleAuth} className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
              <h2 className="text-center font-bold text-xl">{isSignUp ? 'РЕГИСТРАЦИЯ' : 'ВХОД'}</h2>
              <input className="bg-black border border-white/20 p-3 rounded-xl outline-none" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              <input className="bg-black border border-white/20 p-3 rounded-xl outline-none" type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
              <button className="bg-purple-600 p-3 rounded-xl font-bold">OK</button>
              <p className="text-center text-sm text-gray-400 cursor-pointer" onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? 'Войти' : 'Регистрация'}</p>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-gray-400">Привет, <span className="text-purple-400">{user.email}</span></p>
              <div className="flex gap-4 w-full">
                <button onClick={() => setGameState('LEVELS')} className="flex-1 px-8 py-4 bg-white text-black font-bold rounded-2xl">УРОВНИ</button>
                <button onClick={() => setGameState('ENDLESS')} className="flex-1 px-8 py-4 border-2 border-white rounded-2xl font-bold">БЕСКОНЕЧНЫЙ</button>
              </div>
              <button onClick={handleLogout} className="text-red-500 text-xs font-bold">Выйти</button>
            </div>
          )}
          <div className="mt-6 w-full bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-center text-gray-400 uppercase text-xs mb-4 italic">Мировой рейтинг</h2>
            {leaderboard.map((item, i) => (
              <div key={i} className="flex justify-between mb-2 font-mono text-sm border-b border-white/5 pb-1">
                <span>{i+1}. {item.name}</span> <span className="text-purple-400">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {gameState === 'GAMEOVER' && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 backdrop-blur-xl">
          <h2 className="text-4xl font-black mb-2 italic">GAME OVER</h2>
          <p className="text-purple-500 text-5xl font-black mb-10">{score}</p>
          <button onClick={saveScore} disabled={isSaving} className="w-full max-w-xs p-5 bg-purple-600 rounded-2xl font-bold text-xl disabled:opacity-50">
            {isSaving ? 'СОХРАНЕНИЕ...' : 'СОХРАНИТЬ'}
          </button>
          <button onClick={() => { setGameState('MENU'); setScore(0); }} className="mt-4 text-gray-400 uppercase text-sm">В меню</button>
        </div>
      )}

      {(gameState === 'LEVELS' || gameState === 'ENDLESS') && (
        <div className="w-full max-w-[800px] flex flex-col items-center">
          <div className="flex justify-between w-full mb-4 uppercase font-black italic text-xl px-2">
            <span>{gameState === 'ENDLESS' ? 'ENDLESS' : `LVL: ${level}`}</span>
            <span className="text-purple-500">Score: {score}</span>
          </div>
          <div className="relative border-4 border-white/10 rounded-[2rem] overflow-hidden shadow-2xl w-full aspect-[8/5]">
            <canvas ref={canvasRef} className="block w-full h-full touch-none bg-black" />
            <div className="absolute inset-0 pointer-events-none flex items-end justify-between p-6">
              <div className="flex gap-3 pointer-events-auto">
                <button 
                  onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowLeft'})); }}
                  onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowLeft'})); }}
                  onPointerLeave={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowLeft'})); }}
                  className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 active:bg-purple-500 flex items-center justify-center touch-none"
                >←</button>
                <button 
                  onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', {code: 'ArrowRight'})); }}
                  onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowRight'})); }}
                  onPointerLeave={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', {code: 'ArrowRight'})); }}
                  className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 active:bg-purple-500 flex items-center justify-center touch-none"
                >→</button>
              </div>
              <div className="pointer-events-auto">
                <button 
                  onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', {code: 'Space'})); }}
                  onPointerUp={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keyup', {code: 'Space'})); }}
                  className="w-20 h-20 bg-purple-600/80 backdrop-blur-md rounded-full border-4 border-white/30 active:scale-90 flex items-center justify-center font-black italic touch-none"
                >JUMP</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}