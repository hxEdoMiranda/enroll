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

const formSchema = z.object({
  codigo: z.string().min(1, { message: 'Código is required.' }),
  nombre: z.string().min(1, { message: 'Nombre is required.' }),
  codTelefono: z.string().min(1, { message: 'Código de Teléfono is required.' }),
});

const CountryForm = () => {
  const [message, setMessage] = useState('');
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      codTelefono: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes valores:", values); // Mensaje adicional
    try {
      const result = await postCreatePais(values);
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
            name="codigo"
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
            name="nombre"
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
            name="codTelefono"
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
