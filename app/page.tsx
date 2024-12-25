'use client'

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";



export default function Login() {
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");
  const images = [
    "/images/img1menu.png",
    "/images/img2menu.png",
    "/images/img3menu.png"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("RUT:", rut, "Password:", password);
    // Aquí puedes manejar la lógica del login
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sección izquierda - Carrusel */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100 relative">
        <Image
          src={images[currentImageIndex]} 
          alt="Imagen del carrusel"
          layout="fill" 
          objectFit="cover" 
          className="absolute inset-0" 
        />
        <div className="absolute bottom-4 flex gap-4">
          <button 
            onClick={prevImage} 
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            ◀
          </button>
          <button 
            onClick={nextImage} 
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400 transition"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Sección derecha - Formulario de login */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md p-8 bg-gray-50 shadow-lg rounded-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
            Inicio de Sesión
          </h2>
          <div className="mb-4">
            <label
              htmlFor="rut"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              RUT
            </label>
            <Input
              type="text"
              id="rut"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Ingrese su RUT"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Clave
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
              placeholder="Ingrese su clave"
              required
            />
          </div>
          <Button onClick={() => window.location.href = "/home"}>
  Iniciar Sesión
</Button>

          <div className="flex items-center justify-center h-screen">
    </div>
        </form>
      </div>
    </div>
  );
}
