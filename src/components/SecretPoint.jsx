import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SecretPoint() {
  const [clicks, setClicks] = useState(0);
  const [showInput, setShowInput] = useState(false);
  const [secretWord, setSecretWord] = useState('');

  // "0J/RgNC40LLQtdGC" — это "Привет" в Base64
  const encodedSecret = "0J/RgNC40LLQtdGC";

  const handleDotClick = () => {
    setClicks(prev => prev + 1);
    if (clicks + 1 >= 5) {
      setShowInput(true);
      setClicks(0);
    }
  };

  const checkWord = async () => {
    const decoded = decodeURIComponent(escape(window.atob(encodedSecret)));
    
    if (secretWord.trim().toLowerCase() === decoded.toLowerCase()) {
      const name = prompt("🎉 ТЫ НАШЕЛ СЕКРЕТ! Как тебя зовут?");
      if (name) {
        await supabase.from('messages').insert([{ 
          name: name, 
          message: 'Нашел секретное слово!', 
          is_winner: true 
        }]);
        alert("Теперь ты в списке чемпионов!");
      }
      setShowInput(false);
    } else {
      alert("Неверно. Попробуй еще раз.");
      setShowInput(false);
    }
    setSecretWord('');
  };

  return (
    <>
      <span 
        onClick={handleDotClick}
        className="cursor-default select-none hover:text-purple-500 transition-colors duration-300"
      >
        .
      </span>

      {showInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/95 z-[9999] backdrop-blur-md">
          <div className="bg-[#0A0A0A] border border-white/10 p-10 rounded-[3rem] w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-2xl font-black uppercase italic mb-8 tracking-widest text-white">ACCESS CODE</h3>
            <input 
              type="text" 
              autoFocus
              className="w-full bg-black border border-white/10 p-4 rounded-2xl mb-6 outline-none focus:border-purple-600 text-center text-white"
              value={secretWord}
              onChange={(e) => setSecretWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkWord()}
            />
            <div className="flex gap-3">
               <button onClick={checkWord} className="flex-1 py-4 bg-white text-black rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all text-[10px] uppercase">Verify</button>
               <button onClick={() => setShowInput(false)} className="px-6 py-4 bg-white/5 rounded-2xl text-[10px] font-bold uppercase text-white">Exit</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}