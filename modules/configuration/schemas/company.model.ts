import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  phone: z.string().optional(),
  mail: z.string().email({ message: "No es un email válido" }).optional(),
});

export const CompanySchema = z.object({
  uid: z.string().min(1, { message: "Este campo es obligatorio" }).optional().or(z.literal("")),
  identifier: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  trade_name: z.string().min(1, { message: "Este campo es obligatorio" }),
  corporate_name: z.string().min(1, { message: "Este campo es obligatorio" }),
  country: z.string().min(1, { message: "Este campo es obligatorio" }),
  industry_type: z.string().min(1, { message: "Este campo es obligatorio" }),
  business_type: z.string().min(1, { message: "Este campo es obligatorio" }),
  company_phone: z.string().min(1, { message: "Este campo es obligatorio" }),
  company_email: z.string().email({ message: "No es un email válido" }),
  contact: z.array(ContactSchema),
  commercial_manager: z.array(ContactSchema),
  kam: z.array(ContactSchema),
  employee_count: z.number(),
  state: z.boolean(),
});

export type Company = z.infer<typeof CompanySchema>;
