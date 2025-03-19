import { z } from "zod";

export const UserDataSchema = z.object({
  firstName: z.string().min(1, { message: "Este campo es obligatorio" }),
  lastName: z.string().min(1, { message: "Este campo es obligatorio" }),
  emailAddress: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "No es un email válido",
    })
    .email(),
  urlRedirect: z.string().url({ message: "Debe ser una URL válida" }),
  role: z.enum(["admin", "patient", "superadmin", "doctor"], { message: "Rol inválido" }),
  plans: z.array(z.string()).optional(),
});

export type UserData = z.infer<typeof UserDataSchema>;
