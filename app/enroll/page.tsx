
import HomeButton from '@/components/ms/boton-menu';

export default async function HomePage() {
  return (
    <main className="min-h-screens">
    <div className="p-4 md:p-8 bg-white bg-opacity-20 mr-4 mt-14 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <HomeButton />
      </div>
    </div>
    </main>
  );
}
