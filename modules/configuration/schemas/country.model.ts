import { z } from "zod";

export const CountrySchema = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  code_phone: z.string().min(1, { message: "Este campo es obligatorio" }),
  time_zone_UTC: z.string().min(1, {message: "Este campo es obligatorio"})
});

export type Country = z.infer<typeof CountrySchema>;
