import VideoPlayer from '../components/VideoPlayer';


export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-5xl font-black mb-10 italic">ABOUT <span className="text-purple-500">ME</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-xl text-gray-300 leading-relaxed">
            Привет! Я разработчик, который любит создавать не просто сайты, а цифровой опыт. 
          </p>
          <p className="text-gray-500">
            В этом видео я кратко показываю свой процесс работы и инструменты, которые использую ежедневно.
          </p>
        </div>

        {/* Сюда вставляем плеер */}
       <VideoPlayer url="/videos/1.mp4" />
      </div>
    </div>
  );
}