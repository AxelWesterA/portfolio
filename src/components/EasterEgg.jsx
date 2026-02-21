import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function EasterEgg() {
  const [input, setInput] = useState('');
  // Закодированное слово "Привет"
  const secret = "0J/RgNC40LLQtdGC"; 

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Собираем ввод (сбрасываем через 3 сек бездействия)
      setInput(prev => (prev + e.key).slice(-10));
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Декодируем и проверяем
    if (btoa(unescape(encodeURIComponent(input.slice(-6)))) === secret || input.includes('Привет')) {
      triggerWinner();
      setInput('');
    }
  }, [input]);

  const triggerWinner = async () => {
    const name = prompt("🎉 Ты нашел пасхалку! Как тебя зовут, герой?");
    if (!name) return;

    const { error } = await supabase
      .from('messages')
      .insert([{ 
        name: name, 
        message: "Нашел секретное слово: Привет!", 
        is_winner: true 
      }]);

    if (!error) {
      alert("Твое имя внесено в список победителей в админке!");
    }
  };

  return null; // Компонент невидим
}