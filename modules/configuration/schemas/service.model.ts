import { z } from "zod";

export const ServiceSchema = z.object({
  _id: z.string().optional(),  // El campo _id es opcional
  uid: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
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
  limit: z.object({
    period: z.string().min(1, { message: "Este campo es obligatorio" }),
    period_days: z.number().int(),
    limit_quantity: z.number().int(),
  }).optional().refine((val) => val ? val : null, { message: "El objeto limit debe ser nulo si no tiene valores." }), // Si limit está vacío, se convierte en null
});

export type Service = z.infer<typeof ServiceSchema>;
