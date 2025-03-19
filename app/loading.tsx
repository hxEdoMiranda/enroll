import Image from "next/image";

export default function Loading() {
  return (
    <div className="w-full h-screen">
      <div className="absolute -z-10 inset-0 bg-backgroundLoginSolid"></div>
      <div className="absolute -z-10 inset-0 bg-gradient-to-b from-backgroundLoginGradientFrom to-backgroundLoginGradientTo"></div>
      <div className="absolute -z-10 inset-0 bg-[url('/img/login/bg-vector.svg')] bg-no-repeat bg-center bg-cover opacity-50"></div>
      <div className="flex flex-col justify-center items-center h-full">
        <div className="absolute animate-spin h-72 w-72 rounded-full border-4 border-t-transparent border-b-transparent border-l-transparent border-[#69BAC8]"></div>
        <div className="absolute animate-[spin_1.5s_ease-in-out_infinite] h-64 w-64 rounded-full border-4 border-t-transparent border-b-transparent border-r-transparent border-[#4675E0]"></div>
        <div className="absolute animate-[spin_1s_linear_infinite] h-56 w-56 rounded-full border-4 border-t-transparent border-l-transparent border-r-transparent border-[#CB3A8D]"></div>
        <Image
          src="/img/logo-medismart.svg"
          alt="logo medismart"
          width={200}
          height={200}
          className="absolute"
        />
      </div>
    </div>
  );
}
