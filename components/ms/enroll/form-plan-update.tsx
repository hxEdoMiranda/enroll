"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm, FormProvider } from "react-hook-form"; // Importamos FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import { Plan, PlanSchema } from "@/modules/configuration/schemas/plan.model";
import { updatePlan } from "@/actions/planes";
import { toast } from "sonner";
import NameServicesTable from "@/components/ms/enroll/grid-name-services";

interface PlanFormUpdateProps {
  company?: string;
  onPlanCreated: () => void;
  plan: Plan; // Recibe el plan para ser editado
}

const PlanFormUpdate = ({ company, onPlanCreated, plan }: PlanFormUpdateProps) => {
  const form = useForm<Plan>({
    resolver: zodResolver(PlanSchema),
    defaultValues: {
      identifier: plan.identifier,
      name: plan.name,
      state: plan.state,
      start_date: plan.start_date,
      end_date: plan.end_date,
      max_number_of_holders: plan.max_number_of_holders,
      self_managed_load: plan.self_managed_load,
      max_number_of_loads: plan.max_number_of_loads,
      custom_plan_id: plan.custom_plan_id,
      company: company ?? "",
      service: plan.service,
    },
  });

  const handleSubmit = async (values: Plan) => {
    try {
      // Verifica si el plan tiene un uid válido
      if (!plan.uid) {
        throw new Error("El UID del plan es inválido");
      }

      // Asegúrate de que los servicios tengan el uid
      const updatedServices = values.service.map((service) => ({
        ...service,
        uid: service.uid || "", // Aquí asignas el uid correspondiente si falta
      }));

      const updatedPlan = {
        ...values,
        uid: plan.uid, // Incluye el uid del plan a actualizar
        service: updatedServices, // Asegúrate de que los servicios tengan uid
      };

      // Llamada a la función para actualizar el plan
      await updatePlan(updatedPlan);
      toast.success("Plan actualizado exitosamente");
      onPlanCreated(); // Notifica al componente principal que el plan ha sido actualizado
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar el plan");
    }
  };

  return (
    <div className="w-full mt-6">
      <h2 className="text-xl font-bold text-primary mb-6">Actualiza el Plan</h2>
      {/* Usamos FormProvider para proporcionar el contexto del formulario */}
      <FormProvider {...form}> 
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-12 gap-4">
          {/* Campo: Identificador */}
          <FormField control={form.control} name="identifier" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Identificador del plan *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Identificador único del plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Nombre */}
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Nombre del plan *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Nombre del plan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Estado */}
          {/* Agrega el campo Estado aquí si es necesario */}

          {/* Campo: Fecha de inicio */}
          <FormField control={form.control} name="start_date" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha de inicio *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Fecha de fin */}
          <FormField control={form.control} name="end_date" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Fecha de fin *</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Número máximo de titulares */}
          <FormField control={form.control} name="max_number_of_holders" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Número máximo de titulares *</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Número máximo de cargas */}
          <FormField control={form.control} name="max_number_of_loads" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Número máximo de cargas *</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: ID del plan personalizado */}
          <FormField control={form.control} name="custom_plan_id" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>ID Plan Personalizado *</FormLabel>
              <FormControl>
                <Input placeholder="Ej: ID único del plan personalizado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Campo: Empresa */}
          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem className="col-span-6">
              <FormLabel>Empresa *</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la empresa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        
          {/* Aquí puedes agregar un componente de servicios para seleccionar o editar los servicios del plan */}

          <div className="col-span-12 flex justify-end mt-6">
            <Button type="submit" className="bg-primary rounded-full text-white font-bold text-base">
              Actualizar Plan
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default PlanFormUpdate;
