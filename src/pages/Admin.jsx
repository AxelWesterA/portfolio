import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects');
  const [items, setItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({ 
    title: '', desc: '', tech: '', link: '', 
    content: '', image_url: '' 
  });

  // 1. Загрузка данных
  const fetchData = async () => {
    setLoading(true);
    // Определяем таблицу: вкладка 'blog' соответствует таблице 'posts'
    const tableName = activeTab === 'blog' ? 'posts' : activeTab;
    
    try {
      console.log(`Запрос к таблице: ${tableName}...`);
      let query = supabase.from(tableName).select('*');

      // Пробуем отсортировать, если колонка существует (обрабатываем ошибку внутри)
      const { data, error } = await query;

      if (error) throw error;
      
      // Сортируем вручную по id или дате, если она есть, чтобы не валить запрос
      const sortedData = data ? [...data].sort((a, b) => b.id - a.id) : [];
      
      console.log("Данные получены:", sortedData);
      setItems(sortedData);
    } catch (error) {
      console.error("Ошибка загрузки:", error.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (isLoggedIn) fetchData(); 
  }, [isLoggedIn, activeTab]);

  // 2. Сохранение и редактирование
  const handleSubmit = async (e) => {
    e.preventDefault();
    const tableName = activeTab === 'blog' ? 'posts' : activeTab;
    
    const payload = activeTab === 'projects' 
      ? { title: form.title, desc: form.desc, tech: form.tech, link: form.link }
      : { title: form.title, content: form.content, image_url: form.image_url };

    try {
      let error;
      if (editingId) {
        const { error: err } = await supabase.from(tableName).update(payload).eq('id', editingId);
        error = err;
      } else {
        const { error: err } = await supabase.from(tableName).insert([payload]);
        error = err;
      }

      if (error) throw error;

      alert('Успешно сохранено!');
      setEditingId(null);
      setForm({ title: '', desc: '', tech: '', link: '', content: '', image_url: '' });
      fetchData();
    } catch (error) {
      alert('Ошибка сохранения: ' + error.message);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      desc: item.desc || item.description || '', 
      tech: item.tech || '',
      link: item.link || '',
      content: item.content || '',
      image_url: item.image_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить эту запись навсегда?')) return;
    const tableName = activeTab === 'blog' ? 'posts' : activeTab;
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (!error) fetchData();
    else alert(error.message);
  };

  // Экран логина
  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] px-4">
        <form onSubmit={(e) => { e.preventDefault(); if(password === '1234') setIsLoggedIn(true) }} 
              className="p-10 bg-[#0A0A0A] border border-white/10 rounded-[3rem] w-full max-w-sm shadow-2xl">
          <h2 className="text-3xl font-black mb-8 text-center italic uppercase tracking-widest text-white">Admin</h2>
          <input 
            type="password" 
            placeholder="PASSWORD" 
            className="w-full bg-black border border-white/10 p-5 rounded-2xl mb-4 outline-none focus:border-purple-600 text-center text-white transition-all" 
            onChange={e => setPassword(e.target.value)} 
          />
          <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20">
            ENTER
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      {/* Навигация */}
      <div className="flex justify-center gap-3 mb-12 bg-white/5 p-2 rounded-3xl border border-white/10 w-fit mx-auto">
        {['projects', 'blog', 'messages'].map(tab => (
          <button 
            key={tab} 
            onClick={() => {setActiveTab(tab); setEditingId(null);}} 
            className={`px-8 py-3 rounded-2xl font-bold transition-all uppercase text-[10px] tracking-[0.2em] ${activeTab === tab ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Форма (скрыта для сообщений) */}
      {activeTab !== 'messages' && (
        <form onSubmit={handleSubmit} className="grid gap-6 mb-20 p-8 md:p-12 bg-[#0A0A0A] border border-white/5 rounded-[3rem] shadow-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">
              {editingId ? 'Edit' : 'Create'} <span className="text-purple-500">{activeTab}</span>
            </h2>
            {editingId && (
              <button type="button" onClick={() => {setEditingId(null); setForm({title:'', desc:'', tech:'', link:'', content:'', image_url:''})}} className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:underline">Cancel</button>
            )}
          </div>
          
          <input placeholder="Заголовок" className="bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500 text-white" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          
          {activeTab === 'projects' ? (
            <>
              <input placeholder="Технологии (React, Node...)" className="bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500 text-white" value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} />
              <input placeholder="Ссылка на проект" className="bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-purple-500 text-white" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
              <textarea placeholder="Описание" className="bg-black border border-white/10 p-5 rounded-2xl h-32 outline-none focus:border-purple-500 text-white resize-none" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
            </>
          ) : (
            <textarea placeholder="Контент поста (Markdown)..." className="bg-black border border-white/10 p-5 rounded-2xl h-64 outline-none focus:border-purple-500 text-white resize-none" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
          )}
          
          <button className="py-5 bg-white text-black rounded-2xl font-black hover:bg-purple-600 hover:text-white transition-all uppercase tracking-widest text-xs">
            {editingId ? 'Update Entry' : 'Publish Now'}
          </button>
        </form>
      )}

      {/* Список контента */}
      <div className="grid gap-4">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-4 ml-4">Current {activeTab}</h3>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500 animate-pulse uppercase text-xs tracking-widest">Loading database...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] text-gray-700 uppercase text-[10px] tracking-widest">No records found</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={`p-6 md:p-8 rounded-[2.5rem] border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              item.is_winner ? 'bg-purple-600/10 border-purple-500/30' : 'bg-white/5 border-white/5 hover:bg-white/[0.08]'
            }`}>
              <div className="overflow-hidden">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="font-bold text-xl text-white truncate">{item.title || item.name || 'Untitled'}</h4>
                  {item.is_winner && (
                    <span className="bg-purple-600 text-[9px] px-3 py-1 rounded-full font-black text-white uppercase animate-pulse">🏆 Winner</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest flex flex-wrap gap-2">
                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'No Date'} 
                  {item.tech && <span>• {item.tech}</span>}
                  {item.email && <span className="lowercase text-purple-400/60">• {item.email}</span>}
                </p>
                {activeTab === 'messages' && (
                  <p className="mt-4 text-gray-400 italic text-sm border-l-2 border-white/10 pl-4 leading-relaxed">
                    "{item.message}"
                  </p>
                )}
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                {activeTab !== 'messages' && (
                  <button onClick={() => startEdit(item)} className="flex-1 md:flex-none px-8 py-3 bg-white/5 text-white rounded-xl text-[10px] font-black hover:bg-white hover:text-black transition-all uppercase">Edit</button>
                )}
                <button onClick={() => handleDelete(item.id)} className="flex-1 md:flex-none px-8 py-3 bg-red-500/10 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all uppercase">Del</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}