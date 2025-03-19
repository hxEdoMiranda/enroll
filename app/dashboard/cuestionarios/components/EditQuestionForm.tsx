"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateQuestionById } from "@/modules/questionnaires/actions/questions";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { isActionError } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

interface IEditQuestionForm {
  id: string;
  defaultValues: {
    groupId?: string;
    text: string;
    type: "TEXT" | "OPTION" | "RADIO" | "CHECK" | "TEXTAREA";
    options: {
      text: string;
      score?: number;
      correct_answer?: boolean;
      _id: string;
    }[];
  };
}

export const EditQuestionForm = ({ id, defaultValues }: IEditQuestionForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const Schema = z.object({
    text: z.string(),
    type: z.enum(["TEXT", "OPTION", "RADIO", "CHECK", "TEXTAREA"]),
    options: z.array(
      z
        .object({
          text: z.string().min(1, { message: "Este campo es requerido" }),
          score: z.coerce
            .string()
            .transform((value) =>
              value === "" || value === undefined || value === "undefined"
                ? undefined
                : Number(value)
            ),
          correct_answer: z.boolean().default(false),
          _id: z.string().optional(),
        })
        .refine(
          (schema) => {
            console.log(schema.score);
            return !(
              schema.score !== undefined && schema.correct_answer !== false
            );
          },
          {
            message: "Opción no puede ser correcta y tener puntaje.",
            path: ["text"],
          }
        )
    ),
  });

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues,
  });

  const { fields, append, remove } = useFieldArray<z.infer<typeof Schema>>({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    setIsLoading(true);

    const loadingToast = toast.loading("Cargando...");

    try {
      const result = await updateQuestionById({
        id,
        text: data.text,
        type: data.type,
        options: data.options,
      });

      if (isActionError(result)) {
        throw new Error(result.error);
      }

      router.refresh();
      toast.success("Pregunta editada correctamente");
      toast.dismiss(loadingToast);
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.success(error.message);
      } else {
        toast.error("Ocurrió un error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="space-y-4">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="w-full px-2 flex flex-col">
                <FormLabel>Texto</FormLabel>
                <FormControl>
                  <Input type="text" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="w-full px-2 flex flex-col">
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-wrap space-y-1 items-center"
                  >
                    <FormItem>
                      <FormLabel className="flex items-center font-normal border-2 gap-2 rounded-md p-2 has-[:checked]:bg-indigo-50">
                        <FormControl>
                          <RadioGroupItem value="TEXT" />
                        </FormControl>
                        TEXT
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="flex items-center font-normal border-2 gap-2 rounded-md p-2 has-[:checked]:bg-indigo-50">
                        <FormControl>
                          <RadioGroupItem value="OPTION" />
                        </FormControl>
                        OPTION
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="flex items-center font-normal border-2 gap-2 rounded-md p-2 has-[:checked]:bg-indigo-50">
                        <FormControl>
                          <RadioGroupItem value="RADIO" />
                        </FormControl>
                        RADIO
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="flex items-center font-normal border-2 gap-2 rounded-md p-2 has-[:checked]:bg-indigo-50">
                        <FormControl>
                          <RadioGroupItem value="CHECK" />
                        </FormControl>
                        CHECK
                      </FormLabel>
                    </FormItem>
                    <FormItem>
                      <FormLabel className="flex items-center font-normal border-2 gap-2 rounded-md p-2 has-[:checked]:bg-indigo-50">
                        <FormControl>
                          <RadioGroupItem value="TEXTAREA" />
                        </FormControl>
                        TEXTAREA
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full space-y-4 px-2">
            <div className="flex items-center text-center justify-between">
              <FormLabel>Opciones</FormLabel>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  append({ text: "", score: undefined, correct_answer: false });
                }}
              >
                Agregar opción
              </Button>
            </div>
            {fields.map((field, index) => {
              return (
                <div className="flex gap-2 py-2" key={field.id}>
                  <FormField
                    control={form.control}
                    name={`options.${index}.text`}
                    render={({ field }) => (
                      <FormItem className="w-8/12 flex flex-col">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={`Opción ${index + 1}`}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.score`}
                    render={({ field }) => (
                      <FormItem className="w-2/12 flex flex-col">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Puntaje"
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.correct_answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex h-9 shadow-sm items-center font-normal border gap-2 rounded-md p-2 has-[:checked]:bg-green-50">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          ¿Correcta?
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <FormItem className="w-2/12 px-2 flex flex-col">
                    <Button
                      type="button"
                      variant="secondary"
                      className=""
                      onClick={() => remove(index)}
                    >
                      Remover
                    </Button>
                  </FormItem>
                </div>
              );
            })}
          </div>
          <div className="w-full flex gap-2 mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                disabled={isLoading}
                variant="secondary"
                className="w-full"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Agregar
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};
