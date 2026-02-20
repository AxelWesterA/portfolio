import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('projects'); // projects, blog, messages
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', desc: '', tech: '', link: '', content: '', image_url: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');

const fetchData = async () => {
  // Проверьте, чтобы название таблицы 'messages' совпадало с БД
  const table = activeTab === 'projects' ? 'projects' : activeTab === 'blog' ? 'posts' : 'messages';
  
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Ошибка загрузки:", error);
  } else {
    setItems(data || []);
  }
};

  useEffect(() => { if (isLoggedIn) fetchData(); }, [isLoggedIn, activeTab]);

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      const fileName = `${Date.now()}-${file.name}`;
      await supabase.storage.from('blog-images').upload(fileName, file);
      const { data } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      setForm({ ...form, image_url: data.publicUrl });
      alert('Фото загружено!');
    } catch (err) {
      alert('Ошибка загрузки!');
    } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const table = activeTab === 'projects' ? 'projects' : 'posts';
    let payload = activeTab === 'projects' 
      ? { title: form.title, desc: form.desc, link: form.link, tech: typeof form.tech === 'string' ? form.tech.split(',').map(t => t.trim()) : form.tech }
      : { title: form.title, content: form.content, image_url: form.image_url };

    if (editingId) {
      await supabase.from(table).update(payload).eq('id', editingId);
    } else {
      await supabase.from(table).insert([payload]);
    }
    setForm({ title: '', desc: '', tech: '', link: '', content: '', image_url: '' });
    setEditingId(null);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить запись?')) {
      const table = activeTab === 'projects' ? 'projects' : activeTab === 'blog' ? 'posts' : 'messages';
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <form onSubmit={(e) => { e.preventDefault(); if(password === '1234') setIsLoggedIn(true) }} className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] w-full max-w-sm">
          <h2 className="text-2xl font-black mb-6 text-center italic">ADMIN ACCESS</h2>
          <input type="password" placeholder="Пароль" className="w-full bg-black border border-white/20 p-4 rounded-2xl mb-4 outline-none focus:border-purple-600" onChange={e => setPassword(e.target.value)} />
          <button className="w-full py-4 bg-purple-600 rounded-2xl font-black hover:bg-purple-500 transition-all">ВХОД</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex gap-4 mb-10 bg-white/5 p-2 rounded-2xl w-fit mx-auto border border-white/10">
        {['projects', 'blog', 'messages'].map(tab => (
          <button key={tab} onClick={() => {setActiveTab(tab); setEditingId(null)}} className={`px-8 py-3 rounded-xl font-black transition-all uppercase text-xs tracking-widest ${activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-500 hover:text-white'}`}>{tab}</button>
        ))}
      </div>

      {activeTab !== 'messages' && (
        <form onSubmit={handleSubmit} className="grid gap-4 mb-16 p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
          <h2 className="text-2xl font-black uppercase italic mb-4">{editingId ? 'Редактировать' : 'Создать'} {activeTab}</h2>
          <input placeholder="Заголовок" className="bg-black/50 p-4 rounded-xl border border-white/10" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          {activeTab === 'projects' ? (
            <>
              <input placeholder="Технологии (через запятую)" className="bg-black/50 p-4 rounded-xl border border-white/10" value={form.tech} onChange={e => setForm({...form, tech: e.target.value})} />
              <input placeholder="Ссылка" className="bg-black/50 p-4 rounded-xl border border-white/10" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
              <textarea placeholder="Описание" className="bg-black/50 p-4 rounded-xl border border-white/10 h-24" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} />
            </>
          ) : (
            <>
              <input type="file" onChange={handleImageUpload} className="mb-2 text-sm text-gray-400" />
              {form.image_url && <img src={form.image_url} className="w-32 h-20 object-cover rounded-xl mb-2 border border-white/10" />}
              <textarea placeholder="Текст поста" className="bg-black/50 p-4 rounded-xl border border-white/10 h-48" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            </>
          )}
          <button className="py-4 bg-white text-black rounded-xl font-black hover:bg-purple-600 hover:text-white transition-all uppercase tracking-tighter">Сохранить</button>
        </form>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-purple-600/50 transition-all">
            <div className="max-w-[70%]">
              <h3 className="font-bold text-lg">{item.title || item.name}</h3>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{new Date(item.created_at).toLocaleString()}</p>
              {activeTab === 'messages' && (
                <div className="mt-4 text-gray-400 bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-purple-400 font-bold mb-1 text-xs underline">{item.email}</p>
                  <p className="italic">"{item.message}"</p>
                </div>
              )}
            </div>
            <button onClick={() => handleDelete(item.id)} className="p-4 text-red-500 font-black hover:bg-red-500/10 rounded-2xl transition-all">DELETE</button>
          </div>
        ))}
      </div>
    </div>
  );
}