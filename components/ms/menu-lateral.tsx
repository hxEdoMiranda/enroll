'use client';

import Link from 'next/link';
import React from 'react';
import { FaHome, FaUser, FaCog, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

const LateralMenu = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Imagen encima del menú lateral */}
      <Image
        src="/img/Vector.svg"
        alt="Header Image"
        width={80} 
        height={80}
        className="mb-4 mt-10 ml-6" 
      />

      {/* Menú lateral */}
      <div className="w-18 h-96 text-card-foreground flex flex-col ml-8 mt-20 mr-8 border border-white rounded-full justify-center items-center py-8 bg-white bg-opacity-20">
        <nav>
          <ul className="flex flex-col space-y-4">
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-50 rounded-lg relative group">
              <Link href="/home/enroll" className="flex items-center">
                <FaHome className="mr-2 text-2xl text-primary-foreground" />
                <span className="text-primary-foreground absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                  Inicio
                </span>
              </Link>
            </li>

            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaUser className="mr-2 text-2xl text-primary-foreground" />
              <span className="text-primary-foreground absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Perfil
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaCog className="mr-2 text-2xl text-primary-foreground" />
              <span className="text-primary-foreground absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Configuración
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaInfoCircle className="mr-2 text-2xl text-primary-foreground" />
              <span className="text-primary-foreground absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Información
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaSignOutAlt className="mr-2 text-2xl text-primary-foreground" />
              <span className="text-primary-foreground absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Salir
              </span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LateralMenu;
