import { useEffect, useRef } from 'react';

export default function Game() {
  const canvasRef = useRef(null);
  const requestRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 800;
    canvas.height = 400;

    // Пытаемся загрузить картинку, но имеем запасной вариант
    const playerImg = new Image();
    playerImg.src = 'https://img.itch.zone/aW1nLzI5NDcyMDUucG5n/original/7U5Xv%2B.png';
    playerImg.crossOrigin = "anonymous";

    const player = {
      x: 50, y: 300, width: 35, height: 35,
      dy: 0, jumpForce: 10, gravity: 0.5,
      grounded: false, speed: 6,
      color: '#A855F7' // Фиолетовый неон для запасного варианта
    };

    const platforms = [
      { x: 0, y: 380, w: 800, h: 20 },
      { x: 150, y: 300, w: 120, h: 10 },
      { x: 350, y: 220, w: 150, h: 10 },
      { x: 600, y: 150, w: 100, h: 10 },
      { x: 100, y: 120, w: 100, h: 10 }
    ];

    const keys = {};

    const handleKeyDown = (e) => { keys[e.code] = true; };
    const handleKeyUp = (e) => { keys[e.code] = false; };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const update = () => {
      if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
      if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
      
      if ((keys['ArrowUp'] || keys['KeyW'] || keys['Space']) && player.grounded) {
        player.dy = -player.jumpForce;
        player.grounded = false;
      }

      player.dy += player.gravity;
      player.y += player.dy;

      player.grounded = false;
      platforms.forEach(plat => {
        // Проверка столкновения
        if (player.x < plat.x + plat.w &&
            player.x + player.width > plat.x &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + 15 && 
            player.dy >= 0) {
          player.grounded = true;
          player.dy = 0;
          player.y = plat.y - player.height;
        }
      });

      // Границы
      if (player.x < 0) player.x = 0;
      if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
      
      // Смерть (падение вниз)
      if (player.y > canvas.height) {
        player.x = 50; player.y = 300; player.dy = 0;
      }
    };

    const draw = () => {
      // 1. Чистим экран
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Рисуем сетку на фоне для стиля
      ctx.strokeStyle = '#ffffff05';
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke();
      }

      // 3. Рисуем платформы
      ctx.fillStyle = '#8b5cf6';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#8b5cf6';
      platforms.forEach(plat => {
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      });

      // 4. Рисуем персонажа
      ctx.shadowBlur = 15;
      if (playerImg.complete && playerImg.naturalWidth !== 0) {
        // Если картинка загружена — рисуем её
        ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
      } else {
        // ЗАПАСНОЙ ВАРИАНТ: рисуем неоновый куб
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(player.x, player.y, player.width, player.height);
      }
      ctx.shadowBlur = 0;
    };

    const loop = () => {
      update();
      draw();
      requestRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
      <div className="mb-8 text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter">
          NEON <span className="text-purple-500">RUNNER</span>
        </h2>
        <div className="flex gap-4 justify-center mt-2">
          <span className="text-[10px] text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Arrows to move</span>
          <span className="text-[10px] text-gray-500 border border-white/10 px-3 py-1 rounded-full uppercase tracking-widest">Space to jump</span>
        </div>
      </div>
      
      <div className="relative p-[2px] bg-gradient-to-b from-purple-500/50 to-transparent rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.1)]">
        <canvas 
          ref={canvasRef} 
          className="bg-[#050505] rounded-[2.4rem] max-w-full cursor-none"
          style={{ width: '800px', height: '400px' }}
        />
      </div>
    </div>
  );
}