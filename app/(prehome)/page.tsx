import HomeBackButton from "@/components/ms/boton-backoffice";
import Image from "next/image";

export default async function HomePage() {
  return (
    <main className="min-h-screen px-4 md:px-10">
  <div className="flex items-center space-x-2 text-white text-4xl font-bold mb-6">
    <Image
      src="/img/back-office/Group.png"
      alt="Medismart Logo"
      width={400}
      height={120}
    />
    <span className="text-4xl font-sans font-light"> | BACKOFFICE</span>
  </div>
  <div className="p-4 md:p-8 bg-white bg-opacity-20 mt-6 rounded-lg mx-auto w-[100%] px-4">
  <h2 className="text-white text-2xl font-semibold mb-4">
      Selecciona el módulo que deseas explorar:
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <HomeBackButton />
    </div>
  </div>
</main>

  
  );
}
