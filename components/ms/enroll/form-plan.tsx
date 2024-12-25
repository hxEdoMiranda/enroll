"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { postCreatePlan } from "@/actions/planes"; // Importa la función de acciones
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";

const formSchema = z.object({
  identifier: z.string().min(1, { message: "Identifier is required." }),
  name: z.string().min(1, { message: "Name is required." }),
  company: z.string().min(1, { message: "Company is required." }),
  start_validity: z.string().min(1, { message: "Start validity is required." }),
  end_validity: z.string().min(1, { message: "End validity is required." }),
  holder_quantity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Holder quantity is required." })
  ),
  manage_loads: z.boolean(),
  load_count_per_holder: z.preprocess(
    (val) => Number(val),
    z.number().min(1, { message: "Load count per holder is required." })
  ),
  selfmanage_loads: z.boolean(),
});

const PlanForm = () => {
  const [message, setMessage] = useState("");
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      name: "",
      company: "",
      start_validity: "",
      end_validity: "",
      holder_quantity: 0,
      manage_loads: false,
      load_count_per_holder: 0,
      selfmanage_loads: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Formulario enviado con los siguientes valores:", values);
    try {
      const result = await postCreatePlan(values);
      console.log("Resultado de la API:", result);
      setMessage("Plan creado exitosamente.");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setMessage("Error al crear el plan. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="identifier" className="block mb-1 text-primary-foreground">Identifier</Label>
                <FormControl>
                  <Input id="identifier" placeholder="Identifier" {...field} />
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
                <Label htmlFor="name" className="block mb-1 text-primary-foreground">Name</Label>
                <FormControl>
                  <Input id="name" placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="company" className="block mb-1 text-primary-foreground">Company</Label>
                <FormControl>
                  <Input id="company" placeholder="Company" {...field} />
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
                <Label htmlFor="start_validity" className="block mb-1 text-primary-foreground">Start Validity</Label>
                <FormControl>
                  <Input id="start_validity" type="date" {...field} />
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
                <Label htmlFor="end_validity" className="block mb-1 text-primary-foreground">End Validity</Label>
                <FormControl>
                  <Input id="end_validity" type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="holder_quantity"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="holder_quantity" className="block mb-1 text-primary-foreground">Holder Quantity</Label>
                <FormControl>
                  <Input id="holder_quantity" type="number" placeholder="Holder Quantity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="manage_loads"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="manage_loads" className="block mb-1 text-primary-foreground">Manage Loads</Label>
                <FormControl>
                  <Switch
                    id="manage_loads"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="load_count_per_holder"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="load_count_per_holder" className="block mb-1 text-primary-foreground">Load Count per Holder</Label>
                <FormControl>
                  <Input id="load_count_per_holder" type="number" placeholder="Load Count per Holder" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="selfmanage_loads"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="selfmanage_loads" className="block mb-1 text-primary-foreground">Self-manage Loads</Label>
                <FormControl>
                  <Switch
                    id="selfmanage_loads"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
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
      {message && <div className="mt-4 text-center text-primary-foreground">{message}</div>}
    </div>
  );
};

export default PlanForm;
