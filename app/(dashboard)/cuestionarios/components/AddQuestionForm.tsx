"use client";

import { SubmitErrorHandler, useFieldArray, useForm } from "react-hook-form";
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
import { useModal } from "@/modules/shared/modal/provider";
import { useState } from "react";
import { createQuestion } from "@/modules/questionnaires/actions/questions";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuestionnaire } from "../[id]/components/QuestionnaireProvider";
import { isActionError } from "@/lib/utils";
import { DialogClose } from "@/components/ui/dialog";

interface IAddQuestionForm {
  groupIndex?: number;
  defaultValues?: {
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

export const AddQuestionForm = ({
  groupIndex,
  defaultValues,
}: IAddQuestionForm) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modal = useModal();
  const router = useRouter();

  const { questionnaire } = useQuestionnaire();

  const Schema = z
    .object({
      text: z
        .string({ required_error: "Este campo es requerido" })
        .min(1, "Este campo es requerido"),
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
          })
          .refine(
            (schema) => {
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
    })
    .refine(
      (schema) => {
        return !(
          (schema.type === "OPTION" ||
            schema.type === "RADIO" ||
            schema.type === "CHECK") &&
          schema.options.length === 0
        );
      },
      {
        message: "Debes agregar opciones",
        path: ["options"],
      }
    );

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues ?? {},
  });

  const { fields, append, remove } = useFieldArray<z.infer<typeof Schema>>({
    control: form.control,
    name: "options",
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    setIsLoading(true);

    const loadingToast = toast.loading("Cargando...");

    try {
      const questionResult = await createQuestion({
        text: data.text,
        type: data.type,
        options: data.options,
      });

      if (isActionError(questionResult)) {
        throw new Error("Ocurrió un error al crear la pregunta");
      }

      if (groupIndex !== undefined) {
        const updatedGroups = questionnaire.groups.map((group, i) => ({
          ...group,
          questions:
            i === groupIndex
              ? [
                  ...group.questions.map(({ _id }) => _id),
                  questionResult.data!.uid,
                ]
              : group.questions.map(({ _id }) => _id),
        }));

        console.log("groupIndex", groupIndex);

        console.log(updatedGroups);

        const result = await updateQuestionnaireById({
          id: questionnaire.uid,
          groups: updatedGroups,
        });

        if (isActionError(result)) {
          throw new Error(result.error);
        }
      } else {
        const currentQuestions = questionnaire?.questions.map(({ _id }) => _id);

        const newQuestions = [...currentQuestions, questionResult.data!.uid];

        const result = await updateQuestionnaireById({
          id: questionnaire.uid,
          questions: newQuestions,
        });

        if (isActionError(result)) {
          throw new Error(result.error);
        }
      }

      router.refresh();
      toast.success("Pregunta agregada correctamente");
      toast.dismiss(loadingToast);
      modal?.hide();
      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const onError: SubmitErrorHandler<z.infer<typeof Schema>> = (error) => {
    for (const field in error) {
      if (Object.prototype.hasOwnProperty.call(error, field)) {
        const errorInfo = error[field as keyof typeof error];
        toast.error(errorInfo?.message ?? "Error en el formulario");
      }
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-4"
      >
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
                    <FormItem className="w-6/12 flex flex-col">
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
      </form>
    </Form>
  );
};
