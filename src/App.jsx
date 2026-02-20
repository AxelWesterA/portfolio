import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';


function App() {
  return (
    <Router>
      {/* Основной контейнер: теперь ТОЛЬКО черный */}
      <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-purple-500/30">
        
        {/* Навигация с эффектом стекла */}
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link to="/" className="font-black text-2xl tracking-tighter hover:text-purple-400 transition-colors">V.</Link>
            
            <div className="flex gap-8 items-center text-sm font-bold uppercase tracking-widest">
              <Link to="/projects" className="text-gray-400 hover:text-white transition">Projects</Link>
              <Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition">About</Link>
              <Link to="/contact" className="ml-4 px-6 py-2 bg-white text-black rounded-full hover:bg-purple-500 hover:text-white transition-all duration-300">
                Hire Me
              </Link>
            </div>
          </div>
        </nav>

        {/* Контент сайта */}
        <main className="flex-grow pt-32 pb-12 px-6 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </main>

        {/* Подвал */}
        <footer className="border-t border-white/5 py-10 text-center text-gray-500 text-xs tracking-[0.2em] uppercase">
          © {new Date().getFullYear()} — Designed by You
        </footer>
      </div>
    </Router>
  );
}

export default App;