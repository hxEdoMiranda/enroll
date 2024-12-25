'use client';

import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

const MenuSuperior: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
<div className="w-full text-card-foreground flex items-center justify-between p-2 rounded-lg">
  <div className="flex items-center space-x-3 ml-auto"> {/* Reducido el espacio entre los elementos */}
    {/* Botón para alternar el modo oscuro */}
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-muted bg-opacity-10 rounded-full hover:bg-opacity-20 transition"
    >
      {theme === 'dark' ? <FaSun /> : <FaMoon />}
    </button>
    {/* Enlace a la página de accesibilidad */}
    <Link href="/accesibilidad">
      <Image
        src="/img/icon-accesibilidad.svg"
        alt="Icono de Accesibilidad"
        width={50} 
        height={50}  
        className="mb-2 mt-2 ml-3 cursor-pointer" 
      />
    </Link>
    {/* Enlace a la página de notificaciones */}
    <Link href="/notificaciones">
      <Image
        src="/img/icon-notificaciones.svg"
        alt="Icono de Notificaciones"
        width={50}  
        height={50}  
        className="mb-2 mt-2 ml-3 cursor-pointer"  
      />
    </Link>
    {/* Enlace a otra página */}
    <Link href="/otro">
      <Image
        src="/img/accesibilidad.svg"
        alt="Otro Icono"
        width={50}  
        height={50}  
        className="mb-2 mt-2 ml-3 cursor-pointer"  
      />
    </Link>
  </div>
</div>

  );
};

export { MenuSuperior };
