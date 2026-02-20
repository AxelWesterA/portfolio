export default function VideoPlayer({ url }) {
  return (
    <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black aspect-video shadow-2xl">
      <video 
        src={url} 
        controls 
        className="w-full h-full object-cover"
        preload="auto"
        playsInline
      >
        {/* Это сработает, если браузер не поддерживает video */}
        Ваш браузер не поддерживает встроенные видео.
      </video>
    </div>
  );
}