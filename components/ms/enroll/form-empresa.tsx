'use client';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { postCreateEmpresa } from '@/actions/empresa'; // Importa la función de acciones

const formSchema = z.object({
  identifier: z.string().min(1, { message: 'Identifier is required.' }),
  nid: z.string().min(1, { message: 'NID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  industry_type: z.string().min(1, { message: 'Industry type is required.' }),
  business_type: z.string().min(1, { message: 'Business type is required.' }),
  country: z.object({
    codigo: z.string().min(1, { message: 'Country code is required.' }),
    nombre: z.string().min(1, { message: 'Country name is required.' }),
    codTelefono: z.string().min(1, { message: 'Country phone code is required.' }),
    createdAt: z.string().min(1, { message: 'Creation date is required.' }),
    updatedAt: z.string().min(1, { message: 'Update date is required.' }),
    uid: z.string().min(1, { message: 'Country UID is required.' }),
  }),
  start_validity: z.string().min(1, { message: 'Start validity is required.' }),
  end_validity: z.string().min(1, { message: 'End validity is required.' }),
  contact: z.array(
    z.object({
      name: z.string().min(1, { message: 'Contact name is required.' }),
    })
  ),
  commercial_manager: z.object({
    name: z.string().min(1, { message: 'Commercial manager name is required.' }),
  }),
  kam: z.object({
    name: z.string().min(1, { message: 'KAM name is required.' }),
  }),
});

const EmpresaForm = () => {
  const [message, setMessage] = useState('');
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: '',
      nid: '',
      name: '',
      industry_type: '',
      business_type: '',
      country: {
        codigo: '',
        nombre: '',
        codTelefono: '',
        createdAt: '',
        updatedAt: '',
        uid: '',
      },
      start_validity: '',
      end_validity: '',
      contact: [{ name: '' }],
      commercial_manager: { name: '' },
      kam: { name: '' },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'contact',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes valores:", values); // Mensaje adicional
    try {
      const result = await postCreateEmpresa(values);
      console.log("Resultado de la API:", result);
      setMessage('Empresa creada exitosamente.');
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage('Error al crear la empresa. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna 1 y 2 (ocupan 2 columnas) */}
            <div className="lg:col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">Identifier</span>
                    <FormControl>
                      <Input placeholder="MiEmpresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nid"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">NID</span>
                    <FormControl>
                      <Input placeholder="77652415-1" {...field} />
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
                    <span className="block mb-1 text-primary-foreground">Name</span>
                    <FormControl>
                      <Input placeholder="Mi Super Empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <span className="block mb-1 text-primary-foreground">Contact</span>
                {fields.map((item, index) => (
                  <FormField
                    key={item.id}
                    control={form.control}
                    name={`contact.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder={`Contact ${index + 1}`} {...field} />
                        </FormControl>
                        <FormMessage />
                        <div className="flex space-x-2 mt-2">
                          <Button type="button" onClick={() => remove(index)}>
                            Remove
                          </Button>
                          <Button type="button" onClick={() => append({ name: '' })}>
                            Add Contact
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormField
                control={form.control}
                name="commercial_manager.name"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">Commercial Manager</span>
                    <FormControl>
                      <Input placeholder="Pedro contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Columna 3 (solo Start Validity y End Validity) */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="industry_type"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">Industry Type</span>
                    <FormControl>
                      <Input placeholder="B2B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="business_type"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">Business Type</span>
                    <FormControl>
                      <Input placeholder="Suscripción B2B" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="start_validity"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">Start Validity</span>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_validity"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">End Validity</span>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kam.name"
                render={({ field }) => (
                  <FormItem>
                    <span className="block mb-1 text-primary-foreground">KAM</span>
                    <FormControl>
                      <Input placeholder="diego contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Resto del formulario */}
          <div className="mt-8 flex justify-center">
            <Button type="submit" className="w-full lg:w-1/2">
              Submit
            </Button>
          </div>
        </form>
      </Form>
      {message && <div className="mt-4 text-center text-primary-foreground">{message}</div>}
    </div>
  );
};

export default EmpresaForm;
