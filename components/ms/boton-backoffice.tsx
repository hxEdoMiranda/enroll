"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { getCompanyConfig } from "@/actions/config";

interface ICompanyConfig {
  id_oauth: string;
  texto: string;
  sub_texto: string;
  image: string;
  action: string;
  target: string | null;
  createdAt: string;
  updatedAt: string;
  uid: string;
  app?: string;
}

const HomeBackButton = () => {
  const { isLoaded, userId } = useAuth();
  const [companyConfigs, setCompanyConfigs] = useState<ICompanyConfig[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !userId) return; // Esperamos a que se cargue la sesión

      try {
        const data = await getCompanyConfig(userId); // Pasamos el userId dinámico
        console.log('Fetched company config data:', data); // Print the data

        setCompanyConfigs(data);
      } catch (error) {
        console.error("Error fetching company config:", error);
      }
    };

    fetchData();
  }, [isLoaded, userId]); // Se ejecuta cuando `isLoaded` y `userId` cambian

  if (!isLoaded || !userId) {
    return null; // No renderizar nada si la sesión aún no está lista
  }

  // Filter configs to only show Enroll buttons
  const filteredConfigs = companyConfigs.filter(config => 
    config.app?.toLowerCase() === "backoffice"
);


  return (
    <>
      {filteredConfigs?.length > 0 ? (
        filteredConfigs.map((config) => (
          <Link
            key={config.uid}
            href={config.action}
            target={config.target || "_blank"}
            className="w-62 h-36 bg-secondary text-primary-menu rounded-lg flex flex-col items-center justify-center relative no-underline"
          >
            <Image
              src={config.image}
              alt={config.texto || "Imagen sin descripción"}
              width={40}
              height={40}
              className="absolute top-2 left-2"
            />
            <span className="text-lg font-semibold">{config.texto}</span>
            <span className="text-sm font-normal text-primary opacity-70">
              {config.sub_texto}
            </span>
          </Link>
        ))
      ) : (
        <p className="text-gray-500">No hay configuraciones disponibles.</p>
      )}
    </>
  );
  
  
};

export default HomeBackButton;
