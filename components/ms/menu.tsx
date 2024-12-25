'use client';

import Link from 'next/link';
import React, { ReactNode } from 'react';
import { FaHome, FaUser, FaCog, FaInfoCircle, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { Label } from '@/components/ui/label';
import { useTheme } from 'next-themes';

interface LayoutProps {
  children: ReactNode;
}

const Menu: React.FC<LayoutProps> = ({ children }) => {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <div className={`flex h-screen ${theme}`}>
      {/* Menú lateral */}
      <div className="w-24 h-auto text-card-foreground flex flex-col ml-8 mt-20 mr-8 border border-white rounded-full justify-center items-center py-8 bg-white bg-opacity-20">
        <nav>

          <ul className="flex flex-col space-y-4">
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <Link href="/home/enroll" className="flex items-center">
                <FaHome className="mr-2 text-2xl" />
                <span className="absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                  Inicio
                </span>
              </Link>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaUser className="mr-2 text-2xl" />
              <span className="absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Perfil
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaCog className="mr-2 text-2xl" />
              <span className="absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Configuración
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaInfoCircle className="mr-2 text-2xl" />
              <span className="absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Información
              </span>
            </li>
            <li className="flex items-center p-2 hover:bg-muted hover:bg-opacity-10 rounded-lg relative group">
              <FaSignOutAlt className="mr-2 text-2xl " />
              <span className="absolute left-10 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-opacity duration-200">
                Salir
              </span>
            </li>
          </ul>
        </nav>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Menú superior */}

        <div className="w-full text-card-foreground flex items-center justify-between p-4 rounded-lg">
                    <Label
            className="text-5xl font-bold mb-6 text-primary"
            style={{ opacity: 0.7 }}
          >
            Enroll 3.0
          </Label>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-muted bg-opacity-10 rounded-full hover:bg-opacity-20 transition"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            <select
              onChange={(e) => changeTheme(e.target.value)}
              className="p-2 bg-muted bg-opacity-10 rounded-lg border border-white text-foreground"
            >
              <option value="theme" disabled>Tema</option>
              <option value="orange-theme" style={{ backgroundColor: 'orange', color: 'white' }}>Orange</option>
              <option value="ligth-red-theme" style={{ backgroundColor: 'red', color: 'white' }}>Red</option>
              <option value="blue-theme" style={{ backgroundColor: 'blue', color: 'white' }}>Blue</option>
            </select>
          </div>
        </div>
        <div style={{ background: 'transparent', flexGrow: 1 }}>
              {children}
            </div>
      </div>

    </div>
  );


};

export { Menu };
