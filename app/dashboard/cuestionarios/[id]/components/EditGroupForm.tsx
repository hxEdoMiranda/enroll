"use client";

import { SubmitErrorHandler, useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useModal } from "@/modules/shared/modal/provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuestionnaire } from "./QuestionnaireProvider";
import { Textarea } from "@/components/ui/textarea";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { DialogClose } from "@/components/ui/dialog";
import { isActionError } from "@/lib/utils";

interface DefaultValues {
  name: string;
  description: string;
}

export const EditGroupForm = ({
  groupIndex,
  defaultValues,
}: {
  groupIndex: number;
  defaultValues: DefaultValues;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const modal = useModal();
  const router = useRouter();

  const { questionnaire, setQuestionnaire } = useQuestionnaire();

  const Schema = z.object({
    name: z
      .string({ required_error: "Este campo es requerido" })
      .min(1, "Este campo es requerido"),
    description: z
      .string({ required_error: "Este campo es requerido" })
      .min(1, "Este campo es requerido"),
  });

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: defaultValues ?? {},
  });

  const onSubmit = async (data: z.infer<typeof Schema>) => {
    setIsLoading(true);

    const loadingToast = toast.loading("Cargando...");

    const newGroups = questionnaire.groups.map((group, index) => {
      if (groupIndex === index) {
        return {
          ...group,
          name: data.name,
          description: data.description,
        };
      } else {
        return group;
      }
    });

    try {
      const result = await updateQuestionnaireById({
        id: questionnaire.uid,
        groups: newGroups.map((group) => ({
          ...group,
          questions: group.questions.map(({ _id }) => _id),
        })),
      });

      if (isActionError(result)) {
        throw new Error(result.error);
      }

      setQuestionnaire({
        ...questionnaire,
        groups: newGroups,
      });

      router.refresh();
      toast.success("Nuevo grupo agregado correctamente");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error");
      }
    } finally {
      toast.dismiss(loadingToast);
      setIsLoading(false);
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
          name="name"
          render={({ field }) => (
            <FormItem className="w-full px-2 flex flex-col">
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Sección 1."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full px-2 flex flex-col">
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="En esta sección responderás..."
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex gap-2 mt-4">
          <DialogClose asChild>
            <Button
              type="button"
              disabled={isLoading}
              variant="secondary"
              onClick={modal?.hide}
              className="w-full"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};
