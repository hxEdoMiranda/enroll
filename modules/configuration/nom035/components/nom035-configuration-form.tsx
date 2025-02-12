"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {  useState } from "react";
import { SubmitErrorHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import MainSchema from "../../schemas/configuration.schema";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { es } from "date-fns/locale";


export const NOM035ConfigurationForm = ({defaultValues}:{defaultValues:z.infer<typeof MainSchema>}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof MainSchema>>({
    resolver: zodResolver(MainSchema),
    mode: "onChange",
    defaultValues: defaultValues
  });

  const onSubmit = async (data: z.infer<typeof MainSchema>) => {
    console.log(data);
    try {
      setIsLoading(true);
      // Aquí iría la lógica de envío
      // const result = await...
      // if(isActionError(result)){
      //   throw new Error(result.error)
      // }
      console.log(data);
      toast.success("Configuración guardada exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        throw new Error("Ocurrió un error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onError: SubmitErrorHandler<z.infer<typeof MainSchema>> = (errors) => {
    console.log(errors);
    toast.error("Por favor revisa los errores en el formulario");
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "nom035.periods",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Datos generales</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nom035.employee_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad de empleados</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="Ej: 150"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom035.trade_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre comercial</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: Comercial ACME S.A." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom035.RFC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RFC</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: ABC123456700" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nom035.postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ej: 12345" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Periodos</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  _id: Math.random().toString(36).substr(2, 9),
                  start_date: new Date().toISOString(),
                  end_date: new Date().toISOString(),
                  period_name: "",
                  available_surveys: 100,
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar periodo
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-4 gap-4 items-end border p-4 rounded-lg"
            >
              <FormField
                control={form.control}
                name={`nom035.periods.${index}.period_name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del periodo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Ej: Primer Semestre 2025"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`nom035.periods.${index}.start_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", {
                                locale: es,
                              })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`nom035.periods.${index}.end_date`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de término</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", {
                                locale: es,
                              })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={es}
                          mode="single"
                          selected={new Date(field.value)}
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`nom035.periods.${index}.available_surveys`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Encuestas disponibles</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="self-end"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Buzón anónimo</h3>
          <FormField
            control={form.control}
            name={`nom035.comment_data.email`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Email de la empresa, buzón" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-3xl px-8"
          >
            {isLoading ? "Guardando..." : "Guardar configuración"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
