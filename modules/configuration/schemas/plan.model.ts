import { z } from "zod";

export const PlanSchema = z.object({

  uid: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  identifier: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  state: z.boolean(),
  start_date: z.string({ required_error: "Este campo es obligatorio" }),
  end_date: z.string({ required_error: "Este campo es obligatorio" }),
  max_number_of_holders: z.number().int().nonnegative(),
  self_managed_load: z.boolean(),
  max_number_of_loads: z.number().int().nonnegative(),
  //custom_plan_id: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  company: z.string().min(1, { message: "Este campo es obligatorio" }),
  //service: z.string().min(1, { message: "Este campo es obligatorio" }),
  //service: z.array(z.string()).min(1, { message: "Debe seleccionar al menos un servicio" }), // Asegura que haya al menos un servicio seleccionado
});

export type Plan = z.infer<typeof PlanSchema>;
