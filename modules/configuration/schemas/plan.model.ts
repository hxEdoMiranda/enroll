import { z } from "zod";
import { ServiceSchema } from "./service.model";

export const PlanSchema = z.object({

  uid: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  identifier: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  state: z.boolean(),
  start_date: z.string().min(1, { message: "Este campo es obligatorio" }),
  end_date: z.string().min(1, { message: "Este campo es obligatorio" }),
  max_number_of_holders: z.number().int().nonnegative().optional().or(z.literal(0)),
  self_managed_load: z.boolean(),
  max_number_of_loads: z.number().int().nonnegative().optional().or(z.literal(0)),
  custom_plan_id: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  company: z.string().min(1, { message: "Este campo es obligatorio" }),
  //service: z.array(z.string()).min(1, { message: "Debe seleccionar al menos un servicio" }), // Asegura que haya al menos un servicio seleccionado
  service: z.array(ServiceSchema).min(1, { message: "Debe seleccionar al menos un servicio" }), // Ahora validamos objetos en lugar de strings
});

export const UpdatePlanSchema = z.object({
  uid: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  identifier: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  state: z.boolean(),
  start_date: z.string().min(1, { message: "Este campo es obligatorio" }),
  end_date: z.string().min(1, { message: "Este campo es obligatorio" }),
  max_number_of_holders: z.number().int().nonnegative().optional().or(z.literal(0)),
  self_managed_load: z.boolean(),
  max_number_of_loads: z.number().int().nonnegative().optional().or(z.literal(0)),
  custom_plan_id: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  company: z.string().min(1, { message: "Este campo es obligatorio" }),
  service: z.array(z.any()).optional()
});

export type Plan = z.infer<typeof PlanSchema>;
export type UpdatePlan = z.infer<typeof UpdatePlanSchema>;
