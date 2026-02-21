import AnimatedBackground from '../components/AnimatedTriangles';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      
      {/* 1. ФОН */}
      <AnimatedBackground />

      {/* 2. КОНТЕНТ */}
      <div className="relative z-50 text-center px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.9] mb-8 uppercase italic">
          ALEKSANDER <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-indigo-500">
            DIGITAL
          </span>
        </h1>
        
        <p className="text-gray-400 text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium px-2">
          Создаю современные веб-интерфейсы с характером. <br className="hidden md:block" />
          Люблю минимализм, темные темы и чистый код.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 px-4"> 
          <Link 
            to="/projects" 
            className="w-full sm:w-auto px-10 py-5 bg-purple-600 text-white rounded-full font-bold text-lg hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 text-center uppercase tracking-widest"
          >
            Мои работы
          </Link>
          
          <Link 
            to="/contact" 
            className="w-full sm:w-auto px-10 py-5 border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center uppercase tracking-widest"
          >
            Связаться
          </Link>
        </div>
      </div>

      {/* 3. ДЕКОР */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none"></div>
    </div>
  );
}