'use client'

import React, { useState } from 'react';
import EmpresasTable from '@/components/ms/enroll/grid-empresa';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';


const EmpresaPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="p-4 md:p-8 bg-white bg-opacity-50 mr-6 mt-14 mb-4">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
  <div className="col-span-1 lg:col-span-3">
    {/* Contenedor con fondo */}
    <div className="relative mb-4 p-4 rounded-md">
      {/* Imagen de fondo */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/fondoEmpresa.jpg" // Reemplaza con la ruta de tu imagen
          alt="Fondo de Empresas"
          layout="fill" // Hace que la imagen cubra todo el div
          objectFit="cover" // Ajusta el tamaño de la imagen
          quality={80}
        />
      </div>
      <div className=' flex flex-col gap-2' >
      <Label className='text-4xl fotn-bold text-primary-foreground'> Empresas</Label>
      <Label className='text-ms fotn-bold text-primary opacity-70'>Encuentra las empresas existentes y crea empresas.</Label> 
      <Button className='mt-4 w-fit'>CREAR EMPRESA</Button>
      </div>
    </div>
  </div>

  {/* Barra de búsqueda */}
  <div className="col-span-1 lg:col-span-2">
    <div className="mb-4">
      <input
        type="text"
        placeholder="Buscar empresa..."
        className="w-full p-2 border border-gray-300 rounded-md"
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  </div>

  {/* Tabla de empresas */}
  <div className="col-span-1 lg:col-span-3">
    <EmpresasTable searchTerm={searchTerm} />
  </div>
</div>

  </div>
);
};
    
    export default EmpresaPage;
    
