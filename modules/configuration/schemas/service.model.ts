import { z } from "zod";

export const ServiceSchema = z.object({
  code: z.string().min(1, { message: "Este campo es obligatorio" }),
  name: z.string().min(1, { message: "Este campo es obligatorio" }),
  description: z.string().min(1, { message: "Este campo es obligatorio" }),
  country: z.array(z.string().min(1, { message: "Este campo es obligatorio" })),
  state: z.boolean(),
});

export type Service = z.infer<typeof ServiceSchema>;
