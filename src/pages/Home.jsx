import SecretHomeTrigger from '../components/SecretHomeTrigger';

export default function Home() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase">
  Aleksander <br />
  <span className="text-purple-500">
    <SecretHomeTrigger text="Digital" />
  </span>
</h1>
      <p className="max-w-xl text-gray-400 text-lg uppercase tracking-widest">
        Создаю цифровые интерфейсы будущего
      </p>
    </section>
  );
}