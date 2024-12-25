'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes'; // Importar hook para detectar el tema
import { getCompanyConfig } from '@/actions/config';

interface ICompanyConfig {
    idEmpresa: number;
    img: string;
    texto: string;
    subTexto: string;
    accion: string;
    target: string;
}

const HomeButton = () => {
    const [companyConfigs, setCompanyConfigs] = useState<ICompanyConfig[]>([]);
    const { theme } = useTheme(); // Detectar el tema actual

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCompanyConfig(99);
                setCompanyConfigs(data);
            } catch (error) {
                console.error('Error fetching company config:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {companyConfigs.map((config) => (
                <Link
                    key={config.idEmpresa}
                    href={config.accion}
                    target={config.target || '_blank'}
                    className="w-62 h-36 bg-secondary text-primary-menu rounded-lg flex flex-col items-center justify-center relative no-underline"
                >
                    {theme === 'light' ? (
                        <Image
                            src={config.img}
                            alt={config.texto}
                            width={90}
                            height={90}
                            className="absolute top-2 right-2 mt-2 mr-2"
                        />
                    ) : (
                        <span className="absolute top-2 right-2 mt-2 mr-2 text-sm italic font-semibold">MEDISMART</span>
                    )}
                    <span className="text-lg font-semibold">{config.texto}</span>
                    {theme === 'light' ? (
                        <span className="text-sm font-normal text-primary opacity-70">{config.subTexto}</span>

                    ) : (<span className="text-sm font-normal text-primary-foreground">{config.subTexto}</span>
                    )}
                </Link>
            ))}
        </>
    );
};

export default HomeButton;
