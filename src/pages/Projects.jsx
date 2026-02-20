import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
  try {
    const { data, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    setProjects(data || []);
  } catch (err) {
    console.error("ПОЙМАЛИ ОШИБКУ:", err.message);
    setProjects([]); // Ставим пустой массив, чтобы .map не ломался
  } finally {
    setLoading(false);
  }
}

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Декоративное свечение на фоне */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/10 blur-[120px] rounded-full"></div>

      <h2 className="text-5xl font-black mb-16 tracking-tighter italic uppercase">
        Selected <span className="text-purple-500 underline decoration-purple-500/30 underline-offset-8">Works</span>
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500 text-center py-20 text-xl italic">
          Тут пока пусто... Добавь первый проект в таблицу Supabase!
        </p>
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {projects.map((p) => (
            <div 
              key={p.id} 
              className="group relative p-[1px] bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-[2rem] transition-all duration-500 hover:scale-[1.01]"
            >
              {/* Внутреннее наполнение карточки (эффект стекла) */}
              <div className="bg-[#0f0f0f]/90 backdrop-blur-2xl p-8 rounded-[1.95rem] h-full flex flex-col border border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-[2px] w-12 bg-purple-500 rounded-full group-hover:w-24 transition-all duration-500"></div>
                  <span className="text-[10px] font-mono text-gray-600 tracking-[0.3em]">0{p.id}</span>
                </div>

                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors">
                  {p.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  {p.desc}
                </p>

                {/* Вывод массива технологий */}
                <div className="flex flex-wrap gap-2 mb-8">
  {Array.isArray(p.tech) ? (
    p.tech.map((t) => (
      <span key={t} className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300">
        {t}
      </span>
    ))
  ) : (
    /* Если это строка, а не массив, просто выводим текстом */
    <span className="text-[10px] text-purple-300">{p.tech}</span>
  )}
</div>

                <a 
                  href={p.link || "#"} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-black tracking-widest text-white hover:text-purple-400 transition-colors"
                >
                  LIVE PREVIEW 
                  <span className="ml-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}