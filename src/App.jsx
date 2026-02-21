import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-purple-500/30">
        
        {/* НАВИГАЦИЯ: Увеличили z-index до 200 */}
        <nav className="fixed top-0 left-0 right-0 z-[200] border-b border-white/5 bg-black/80 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
            
            <Link 
  to="/" 
  onClick={closeMenu} 
  className="z-[210] hover:opacity-80 transition-opacity"
>
  <img 
    src="src/2.png"  /* Путь к твоему логотипу */
    alt="Logo" 
    className="h-8 w-auto md:h-10" /* Высота: 32px на мобилках, 40px на десктопе */
  />
</Link>
            
            {/* Десктоп */}
            <div className="hidden md:flex gap-8 items-center text-sm font-bold uppercase tracking-widest">
              <Link to="/projects" className="text-gray-400 hover:text-white transition">Projects</Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <Link to="/contact" className="ml-4 px-6 py-2 bg-white text-black rounded-full hover:bg-purple-500 hover:text-white transition-all">
                Hire Me
              </Link>
            </div>

            {/* Кнопка Бургера: z-index 210, чтобы была над оверлеем */}
            <button 
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-1.5 p-2 focus:outline-none z-[210]"
            >
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </nav>

        {/* МОБИЛЬНОЕ МЕНЮ: z-index 190 (сразу под навом) */}
        <div className={`fixed inset-0 bg-[#050505] z-[190] flex flex-col items-center justify-center transition-all duration-500 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'} md:hidden`}>
          <div className="flex flex-col items-center gap-8 text-4xl font-black uppercase tracking-tighter">
            <Link to="/projects" onClick={closeMenu}>Projects</Link>
            <Link to="/blog" onClick={closeMenu}>Blog</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/contact" onClick={closeMenu} className="text-purple-500 border-2 border-purple-500 px-10 py-3 rounded-full mt-4">Hire Me</Link>
          </div>
        </div>

        {/* КОНТЕНТ: Снизили z-index до 10 */}
        <main className="flex-grow pt-32 pb-12 px-6 max-w-6xl mx-auto w-full relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        <footer className="border-t border-white/5 py-10 text-center text-gray-500 text-xs tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} — ALEKSANDER DIGITAL
        </footer>
      </div>
    </Router>
  );
}

export default App;