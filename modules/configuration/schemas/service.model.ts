import { z } from "zod";

export const ServiceSchema = z.object({
  _id: z.string().min(1, { message: "Este campo es obligatorio" }),
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  state: z.boolean(),
  description: z.string().min(1, { message: "Este campo es obligatorio" }),
  country: z.array(z.string().min(1, { message: "Este campo es obligatorio" })),
});

export type Service = z.infer<typeof ServiceSchema>;
