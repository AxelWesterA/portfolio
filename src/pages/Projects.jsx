import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*');
      if (!error) setProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    /* Контейнер с overflow-x-hidden, чтобы ничего не вылезало вбок */
    <div className="max-w-6xl mx-auto w-full overflow-x-hidden px-2">
      <header className="mb-10">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
          Проекты<span className="text-purple-500">.</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg">Выбранные работы и цифровые эксперименты</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
        </div>
      ) : (
        /* Сетка проектов: 1 колонка на мобайле, 2 на планшете, 3 на ПК */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="group flex flex-col justify-between bg-[#0A0A0A] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-purple-500/50 transition-all duration-500"
            >
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-purple-400 transition-colors break-words">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 line-clamp-4 break-words">
                  {project.description}
                </p>
                
                {/* Тэги */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags?.split(',').map(tag => (
                    <span key={tag} className="text-[10px] uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10 text-gray-300">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Кнопка всегда прижата к низу карточки */}
              <a 
                href={project.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block w-full text-center py-4 bg-white text-black rounded-2xl font-bold text-sm hover:bg-purple-600 hover:text-white transition-all duration-300"
              >
                Открыть проект
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}