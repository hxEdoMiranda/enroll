'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { postCreatePais } from '@/actions/pais';
import { CountrySchema } from '@/modules/configuration/schemas/country.model'; // Importamos el schema

const CountryForm = () => {
  const [message, setMessage] = useState('');

  const form = useForm({
    resolver: zodResolver(CountrySchema),
    defaultValues: {
      code: '',
      name: '',
      code_phone: '',
    },
  });

const onSubmit = async (values: z.infer<typeof CountrySchema>) => {
  // Convertimos undefined a null para que coincida con el modelo
  const data = { ...values, uid: values.uid ?? null };

  console.log("Formulario enviado con los siguientes valores:", data);

  try {
    const result = await postCreatePais(data);
    console.log("Resultado de la API:", result);
    setMessage('País creado exitosamente.');
  } catch (error) {
    console.error("Error al enviar los datos:", error);
    setMessage('Error al crear el país. Por favor, inténtalo de nuevo.');
  }
};


  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <span className="block mb-1 text-primary">Código</span>
                <FormControl>
                  <Input placeholder="Código" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <span className="block mb-1 text-primary">Nombre</span>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code_phone"
            render={({ field }) => (
              <FormItem>
                <span className="block mb-1 text-primary">Código de Teléfono</span>
                <FormControl>
                  <Input placeholder="Código de Teléfono" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-8 flex justify-center">
            <Button type="submit" className="w-full lg:w-1/2">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      {message && <div className="mt-4 text-center text-primary">{message}</div>}
    </div>
  );
};

export default CountryForm;
