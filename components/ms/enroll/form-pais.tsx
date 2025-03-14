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
import {
	Select,
	SelectItem,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import { postCreatePais } from '@/actions/pais';
import { CountrySchema } from '@/modules/configuration/schemas/country.model'; // Importamos el schema
import { CountryModel } from "@/modules/configuration/types/Country.type";
// Define el tipo de props para incluir closeModal y el esquema opcional
type CountryFormProps = {
  closeModal: () => void;
  Pais?: CountryModel; // Prop opcional para el esquema
}
const CountryForm = ({ closeModal, Pais }: CountryFormProps) => {
  let Msg:string = "País creado exitosamente.";
  let MsgButon:string="Crear";
  let deault_pais:CountryModel = {
    uid:null,
    _id:null,
    code: '',
    name: '',
    code_phone: '',
    time_zone_UTC: [],
  };

if(Pais){
  deault_pais._id = Pais.uid;
  deault_pais.uid = Pais.uid;
  deault_pais.code = Pais.code;
  deault_pais.name = Pais.name;
  deault_pais.code_phone = Pais.code_phone;
  deault_pais.time_zone_UTC = Pais.time_zone_UTC;
  Msg = "País Actualizado exitosamente.";
  MsgButon="Actualizar"
}

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const TimeZone:string[] = ["-12","-11","-10","-9","-8","-7","-6","-5","-4","-3","-2","-1","0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const [selectedTimeZone, setSelectedTimeZone] = useState<string[]>(deault_pais.time_zone_UTC);

  const form = useForm({
    resolver: zodResolver(CountrySchema),
    defaultValues:deault_pais,
  });

const onSubmit = async (values: CountryModel) => {
  // Convertimos undefined a null para que coincida con el modelo
  const data = { ...values, uid: values.uid ?? null, _id: values.uid ?? null };

  console.log("Formulario enviado con los siguientes valores:", data);

  try {
    const result = await postCreatePais(data);
    console.log("Resultado de la API:", result);
    setMessage(Msg);
    // Llama a closeModal para cerrar el Dialog
    closeModal();
    
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
          {/* Select de Zonas Horarias*/}
          <div className="grid w-full items-center col-span-6">
            <Select
              onValueChange={(value: string) => { // Aseguramos el tipo explícito de value
                setSelectedTimeZone([...selectedTimeZone, value]);
                const currentTimeZone = form.getValues("time_zone_UTC") || [];
                form.setValue("time_zone_UTC", [...currentTimeZone, value]);
              }}
              disabled={loading || TimeZone.length === 0}
            >
              <Label htmlFor="time_zone_UTC">Zonas Horarias *</Label>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loading
                      ? "Cargando zonas horarias..."
                      : "Seleccionar Zona Horaria"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem disabled value="loading">
                    Cargando zonas horarias...
                  </SelectItem>
                ) : TimeZone.length > 0 ? (
                  TimeZone
                    .filter((time) => !selectedTimeZone.includes(time))
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        UTC {time}
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem disabled value="no-timezones">
                    No hay zonas horarias disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid w-full items-center col-span-6">
            <h3 className="text-sm font-medium mb-2">
              Zonas Horarias Seleccionadas:
            </h3>
            {selectedTimeZone.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedTimeZone.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-muted rounded-md p-2"
                  >
                    <span className="text-sm">
                      UTC {time}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      className="h-6 w-6 p-0 ml-2"
                      onClick={() => {
                        const newSelectedTimeZone = [...selectedTimeZone];
                        newSelectedTimeZone.splice(index, 1);
                        setSelectedTimeZone(newSelectedTimeZone);
                        form.setValue("time_zone_UTC", newSelectedTimeZone);
                      }}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay zonas horarias seleccionadas
              </p>
            )}
          </div>
          {/* Select de Zonas Horarias*/}
          <div className="mt-8 flex justify-center">
            <Button type="submit" className="w-full lg:w-1/2">
              {MsgButon}
            </Button>
          </div>
        </form>
      </Form>
      {message && <div className="mt-4 text-center text-primary">{message}</div>}
    </div>
  );
};

export default CountryForm;
