import { z } from "zod";

const ObjectId = z.string();

const CommentDataSchema = z.object({
  email: z
    .string({
      required_error: "Este campo es requerido",
      invalid_type_error: "No es un email valido",
    })
    .email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

const PeriodSchema = z.object({
  _id: ObjectId,
  period_name: z.string({ required_error: "Este campo es requerido " }).min(1),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  available_surveys: z.number().int().positive(),
});

const ConfigurationDataSchema = z.object({
  area: ObjectId,
  puestos: z.array(ObjectId),
});

export const NOM035Schema = z.object({
  RFC: z.string(),
  employee_count: z.number().int().positive(),
  trade_name: z.string().min(1),
  postal_code: z.string(),
  comment_status: z.boolean(),
  configuration_status: z.boolean(),
  comment_data: CommentDataSchema,
  periods: z.array(PeriodSchema),
  configuration_data: z.array(ConfigurationDataSchema),
});

export const MainSchema = z.object({
  company_id: ObjectId,
  nom035: NOM035Schema,
});

export type NOM035Type = z.infer<typeof NOM035Schema>;
export type MainSchemaType = z.infer<typeof MainSchema>;

export default MainSchema;
