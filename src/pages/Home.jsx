import AnimatedBackground from '../components/AnimatedTriangles';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    /* Контейнер на всю высоту экрана, relative нужен для позиционирования фона */
    <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      
      {/* 1. ФОН: Вставляем наши 3D кристаллы */}
      <AnimatedBackground />

      {/* 2. КОНТЕНТ: Оборачиваем в z-10, чтобы текст был поверх кристаллов */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-10">
          ALEKSANDER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500">
            DIGITAL
          </span>
        </h1>
        
        <p className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
          Создаю современные веб-интерфейсы с характером. 
          Люблю минимализм, темные темы и чистый код.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <Link 
            to="/projects" 
            className="px-10 py-4 bg-purple-600 rounded-full font-bold text-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
          >
            Мои работы
          </Link>
          
          <Link 
            to="/contact" 
            className="px-10 py-4 border border-white/10 rounded-full font-bold text-lg hover:bg-white/5 transition-all"
          >
            Связаться
          </Link>
        </div>
      </div>

      {/* 3. ДЕКОР: Дополнительное мягкое свечение внизу для глубины */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] to-transparent z-20"></div>
    </div>
  );
}