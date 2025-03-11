import { z } from "zod";

export const ServiceSchema = z.object({
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  description: z.string().min(1, { message: "Este campo es obligatorio" }),
  country: z.array(z.string().min(1, { message: "Este campo es obligatorio" })),
  price_2b: z.string().min(1, { message: "Este campo es obligatorio" }),  // Nuevo campo
  discount_2b: z.string().min(1, { message: "Este campo es obligatorio" }),  // Nuevo campo
  price_2c: z.string().min(1, { message: "Este campo es obligatorio" }),  // Nuevo campo
  discount_2c: z.string().min(1, { message: "Este campo es obligatorio" }),  // Nuevo campo
  responsible_name: z.string().min(1, { message: "Este campo es obligatorio" }),  // Nuevo campo
  responsible_mail: z.string().email({ message: "El correo debe ser válido" }),  // Nuevo campo, validación de email
  state: z.boolean(),
});

export type Service = z.infer<typeof ServiceSchema>;
