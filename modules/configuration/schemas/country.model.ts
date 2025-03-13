import { z } from "zod";

/*export const CountrySchema = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  code_phone: z.string().min(1, { message: "Este campo es obligatorio" }),
  time_zone_UTC: z.string().min(1, {message: "Este campo es obligatorio"})
});*/
export const CountrySchema = z.object({
  uid: z.string().optional(),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  code_phone: z.string().min(1, { message: "Este campo es obligatorio" }),
  time_zone_UTC: z
    .array(
      z.string().refine((val) => /^-?(1[0-2]|[0-9])$/.test(val), {
        message: "Debe ser un valor entre -12 y 12 como string",
      })
    )
    .min(1, { message: "Debe haber al menos una zona horaria" }),
});

export type Country = z.infer<typeof CountrySchema>;
