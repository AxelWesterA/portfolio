import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Contact() {
  const [status, setStatus] = useState(''); // 'loading', 'success', 'error'
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // 1. Сохраняем в базу Supabase
      const { error: sbError } = await supabase.from('messages').insert([form]);
      if (sbError) throw sbError;

      // 2. Отправляем на почту через Web3Forms
      const formData = new FormData();
      formData.append("access_key", "73cc3503-cad1-4d06-8ea9-6d257201e534"); // ПОМЕНЯЙ НА СВОЙ КЛЮЧ
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("message", form.message);
      formData.append("from_name", "Portfolio Contact Form");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const resData = await response.json();

      if (resData.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        throw new Error('Web3Forms failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-6 min-h-screen">
      <h1 className="text-7xl font-black italic mb-4 tracking-tighter uppercase">Get in <span className="text-purple-600">touch</span></h1>
      <p className="text-gray-500 mb-12 uppercase tracking-[0.3em] font-bold text-sm">Оставьте сообщение, и я отвечу в ближайшее время</p>
      
      <form onSubmit={handleSubmit} className="grid gap-6 p-8 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input 
            placeholder="Имя" 
            className="bg-black/50 p-5 rounded-2xl border border-white/10 focus:border-purple-600 outline-none transition-all"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            required 
          />
          <input 
            type="email"
            placeholder="Email" 
            className="bg-black/50 p-5 rounded-2xl border border-white/10 focus:border-purple-600 outline-none transition-all"
            value={form.email}
            onChange={e => setForm({...form, email: e.target.value})}
            required 
          />
        </div>
        <textarea 
          placeholder="Ваше сообщение..." 
          className="bg-black/50 p-5 rounded-2xl border border-white/10 focus:border-purple-600 outline-none transition-all h-48 resize-none"
          value={form.message}
          onChange={e => setForm({...form, message: e.target.value})}
          required 
        />
        
        <button 
          disabled={status === 'loading'}
          className="py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all duration-500 disabled:opacity-50"
        >
          {status === 'loading' ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
        </button>

        {status === 'success' && <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-center rounded-xl font-bold">✅ Сообщение отправлено! Проверьте почту.</div>}
        {status === 'error' && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-center rounded-xl font-bold">❌ Ошибка отправки. Попробуйте снова.</div>}
      </form>
    </div>
  );
}