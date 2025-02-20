import { z } from "zod";

export const PlanSchema = z.object({
  uid: z.string().min(1, { message: "Este campo es obligatorio" }),
  identifier: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  state: z.boolean(),
  start_date: z.date({ required_error: "Este campo es obligatorio" }),
  end_date: z.date({ required_error: "Este campo es obligatorio" }),
  max_number_of_holders: z.number().int().nonnegative(),
  self_managed_load: z.boolean(),
  max_number_of_loads: z.number().int().nonnegative(),
  custom_plan_id: z.string().min(1, { message: "Este campo es obligatorio" }),
  company: z.string().min(1, { message: "Este campo es obligatorio" }),
  service: z.string().min(1, { message: "Este campo es obligatorio" }),
});

export type Plan = z.infer<typeof PlanSchema>;
