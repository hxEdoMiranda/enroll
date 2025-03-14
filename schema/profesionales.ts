import * as z from "zod";

export const profesionalFormSchema = z.object({
  // Personal information
  firstName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido paterno debe tener al menos 2 caracteres"),
  secondName: z.string().optional(),
  motherLastName: z.string().optional(),
  document: z.string().min(1, "El documento de identidad es requerido"),
  documentType: z.string().default("RUT"),
  birthDate: z.string().min(1, "La fecha de nacimiento es requerida"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "UNKNOWN"], {
    required_error: "El género es requerido",
  }),
  country_birth: z.string().default("CL"),
  timeZone: z.string().min(1, "Ingresar cuidad de recidencia"),
  
  // Contact information
  emailAddress: z.string().email("Correo electrónico inválido").optional(),
  phoneNumber: z.string().optional(),
  
  // Address
  addressLine: z.string().optional(),
  addressCity: z.string().default("Santiago"),
  addressState: z.string().default("RM"),
  
  // Professional information
  prefix: z.string().optional(),
  
  // Qualifications
  certificateNumber: z.string().min(1, "El número de certificado es requerido"),
  titleCode: z.string().default("MD"),
  titleDisplay: z.string().min(1, "El titulo es requerido"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  issuer: z.string().min(1, "El nombre de la Universidad es requerido"),
  
  // Specialization
  // specialtyCode: z.string().optional(),
  // specialtyDisplay: z.string().optional(),
  specialtyCode: z.array(z.string()).default([]),
  specialtyDisplay: z.array(z.string()).default([]),
  
  // Additional fields for UI only
  estado: z.string().default("active"),
  duracionAtencion: z.string().optional(),
  valorTotal: z.string().optional(),
  valorConvenio: z.string().optional(),
  biografia: z.string().optional(),
  modalidad: z.string().optional(),
});

export type ProfesionalFormValues = z.infer<typeof profesionalFormSchema>;