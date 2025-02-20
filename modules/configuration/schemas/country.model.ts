import { z } from "zod";

export const CountrySchema = z.object({
  uid: z.string().nullable(),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  code_phone: z.string().min(1, { message: "Este campo es obligatorio" }),
});

export type Country = z.infer<typeof CountrySchema>;
