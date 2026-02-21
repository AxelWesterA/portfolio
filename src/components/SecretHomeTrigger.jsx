import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SecretHomeTrigger({ text }) {
  const [val, setVal] = useState('');
  const [active, setActive] = useState(false);
  const secret = "0J/RgNC40LLQtdGC"; // "Привет"

  const handleTrigger = (e) => {
    // Активация: Shift + Двойной клик
    // Мы убрали cursor-default и select-none, чтобы слово вело себя как обычный текст
    if (e.shiftKey && e.detail === 2) {
      setActive(true);
    }
  };

  const handleCheck = async () => {
    const decoded = decodeURIComponent(escape(window.atob(secret)));
    if (val.trim().toLowerCase() === decoded.toLowerCase()) {
      const name = prompt("⚡️ ДОСТУП ПОЛУЧЕН. Введите ваш никнейм:");
      if (name) {
        await supabase.from('messages').insert([{ 
          name, 
          message: 'Взломал Home через Shift + DoubleClick', 
          is_winner: true 
        }]);
        alert("Вы добавлены в список легенд.");
      }
      setActive(false);
    } else {
      setActive(false);
    }
    setVal('');
  };

  return (
    <>
      <span 
        onClick={handleTrigger}
        // Убрали все стили, которые могли бы выдать интерактивность
        // Теперь это слово выделяется и ведет себя как любой другой текст
        className="transition-colors duration-300" 
      >
        {text}
      </span>

      {active && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#050505]/98 z-[9999] backdrop-blur-3xl">
          <div className="w-full max-w-md p-12 border border-white/5 bg-black rounded-[3rem] text-center shadow-2xl">
            <div className="text-purple-500 font-mono text-[10px] tracking-[0.5em] mb-10 animate-pulse">
              ENCRYPTED_CHANNEL
            </div>
            <input 
              type="text" 
              autoFocus
              placeholder="КОД..."
              className="w-full bg-transparent border-b border-white/10 p-4 outline-none text-center text-white text-3xl font-light tracking-widest focus:border-purple-600 transition-all"
              value={val}
              onChange={e => setVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
            />
          </div>
        </div>
      )}
    </>
  );
}