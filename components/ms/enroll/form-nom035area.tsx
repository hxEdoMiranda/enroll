"use client";
import { useForm, Controller } from 'react-hook-form';
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
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';
import { postArea } from '@/app/actions/nom035-area';


const formSchema = z.object({
  name_area: z.string().min(1, { message: 'Nombre del Área es requerido.' }),
  status: z.boolean().default(true).refine(value => value !== null, {
    message: 'Status es requerido.',
  }),
});

const AreaForm = () => {
  const [message, setMessage] = useState('');
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_area: '',
      status: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes valores:", values); // Mensaje adicional
    try {
      const result = await postArea(values);
      console.log("Resultado de la API:", result);
      setMessage('Área creada exitosamente.');
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage('Error al crear el área. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name_area"
            render={({ field }) => (
              <FormItem>
                <span className="block mb-1 text-primary">Nombre del Área</span>
                <FormControl>
                  <Input placeholder="Nombre del Área" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ }) => (
              <FormItem>
                <span className="block mb-1 text-primary">Status</span>
                <FormControl>
                  <Controller
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="status"
                      />
                    )}
                  />
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

export default AreaForm;
