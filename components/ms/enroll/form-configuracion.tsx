'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';


const EmpresaConfig = () => {
    const form = useForm({

    });

    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(!isClicked);
    };

    return (

        <div className="space-y-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(12)].map((_, index) => (
                <div
                    key={index}
                    className="group relative flex flex-col items-center justify-center w-full mt-8"
                >
                    <Button
                        onClick={handleClick}
                        className={`w-32 h-32 flex flex-col items-center justify-center space-y-2 ${isClicked ? 'bg-primary opacity-100' : 'bg-primary bg-opacity-40 opacity-70'}`}
                    >
                        <div className="text-3xl font-bold">
                            &#9733;
                        </div>
                        <div className="text-lg font-semibold">
                            Botón {index + 1}
                        </div>
                    </Button>

                    {/* Subtexto que aparece al pasar el mouse */}
                    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-secondary text-secondary-foreground text-sm rounded opacity-0 group-hover:opacity-100 transition">
                        Este es el subtexto del botón {index + 1}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default EmpresaConfig;
