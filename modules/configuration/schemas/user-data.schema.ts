import { z } from "zod";

const AddressSchema = z.object({
  line: z.array(z.string()),
  city: z.string(),
  state: z.string(),
});

export const UserDataSchema = z.object({
  firstName: z.string().min(1, { message: "Este campo es obligatorio" }),
  secondName: z.string().optional(),
  lastName: z.string().min(1, { message: "Este campo es obligatorio" }),
  motherLastName: z.string().optional(),
  emailAddress: z
    .string({
      required_error: "Este campo es obligatorio",
      invalid_type_error: "No es un email válido",
    })
    .email(),
  country: z.string().min(2, { message: "Este campo es obligatorio" }),
  birthDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "El formato debe ser YYYY-MM-DD"
    )
    .refine((date) => !isNaN(new Date(date).getTime()), {
      message: "Fecha inválida",
    }),
  gender: z.enum(["MALE", "FEMALE"], { message: "Este campo es obligatorio" }),
  document: z.string().min(1, { message: "Este campo es obligatorio" }),
  documentType: z.string().min(1, { message: "Este campo es obligatorio" }),
  address: AddressSchema,
  maritalStatus: z.string().optional(),
  plans: z.array(z.string()).optional(),
  roles: z
    .array(z.enum(["admin", "patient", "superadmin", "doctor"]))
    .optional(),
  countryResidence: z.string().min(2, { message: "Este campo es obligatorio" }),
});

export type UserData = z.infer<typeof UserDataSchema>;
