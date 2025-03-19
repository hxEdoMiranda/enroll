'use client';

import Link from 'next/link';
import React from 'react';

const MyComponent = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Link href="enroll/empresa/">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          EMPRESA
        </div>
      </Link>
      <Link href="/ruta2">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          Botón 2
        </div>
      </Link>
      <Link href="/ruta3">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          Botón 3
        </div>
      </Link>
      <Link href="/ruta4">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          Botón 4
        </div>
      </Link>
      <Link href="/ruta5">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          Botón 5
        </div>
      </Link>
      <Link href="/ruta6">
        <div className="w-full h-24 bg-primary text-primary-foreground flex items-center justify-center">
          Botón 6
        </div>
      </Link>
    </div>
  );
};

export default MyComponent;
