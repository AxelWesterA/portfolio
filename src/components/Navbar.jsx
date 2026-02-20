import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex flex-col md:flex-row justify-between items-center py-6 px-4 gap-4">
      <Link to="/" className="text-2xl font-black tracking-tighter">PORTFOLIO.</Link>
      
      <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-md">
        <Link title="Projects" to="/projects" className="hover:text-purple-500 transition-colors">Works</Link>
        <Link title="Contact" to="/contact" className="hover:text-purple-500 transition-colors">Contact</Link>
        <Link title="Admin" to="/admin" className="hover:text-purple-400 opacity-50 text-[8px]">Admin</Link>
      </div>
    </nav>
  );
}