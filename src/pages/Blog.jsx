import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Ошибка загрузки постов:', error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

async function fetchPosts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Ошибка загрузки постов:', error.message);
    } finally {
      setLoading(false);
    } // Вот эта скобка и всё, что выше после try, должны быть на месте
  }

  return (
    <div className="max-w-screen-xl mx-auto py-20 px-6">
      {/* Заголовок в стиле брутализма */}
      <header className="mb-20">
        <h1 className="text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
          Journal <span className="text-purple-600">.</span>
        </h1>
        <p className="text-gray-500 mt-4 text-lg font-medium uppercase tracking-widest">
          Мысли о коде, дизайне и будущем
        </p>
      </header>

      {/* Сетка постов */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
        {posts.map((post) => (
          <article key={post.id} className="group relative flex flex-col">
            {/* Картинка поста */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 mb-8">
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/10 font-black text-4xl italic">
                  NO IMAGE
                </div>
              )}
              {/* Дата поверх картинки */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-xs font-bold text-white uppercase tracking-tighter">
                  {new Date(post.created_at).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Текст поста */}
            <div className="flex flex-col flex-grow">
              <h2 className="text-3xl font-bold leading-tight group-hover:text-purple-500 transition-colors duration-300 mb-4">
                {post.title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed line-clamp-3 mb-6">
                {post.content}
              </p>
              
              <button className="mt-auto self-start text-xs font-black uppercase tracking-[0.2em] py-3 px-6 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                Читать далее
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Если постов нет */}
      {posts.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
          <p className="text-gray-600 font-bold uppercase tracking-widest text-sm">Здесь пока пусто. Скоро будут новые посты!</p>
        </div>
      )}
    </div>
  );
}