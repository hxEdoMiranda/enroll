"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { toast } from "sonner";

interface IQuestionnaireForm {
    questionnaireId: string;
    defaultValues: {
        title: string;
        description: string;
    }
}

export const QuestionnaireForm = ({ questionnaireId, defaultValues }: IQuestionnaireForm) => {

    const [isLoading, setIsLoading] = useState(false);

    const Schema = z.object({
        title: z.string().min(1, { message: "Este campo es requerido" }),
        description: z.string().min(1, { message: "Este campo es requerido" })
    });

    const form = useForm<z.infer<typeof Schema>>({
        resolver: zodResolver(Schema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            ...defaultValues
        }
    });

    const onSubmit = async (data: z.infer<typeof Schema>) => {
        setIsLoading(true);

        const result = await updateQuestionnaireById({
            id: questionnaireId,
            title: data.title,
            description: data.description
        });

        if (result.ok) {
            toast.success("Se guardaron los cambios correctamente.");
            setIsLoading(false);
        } else {
            toast.error("Ocurrió un error, no se pudieron guardar los cambios.");
            setIsLoading(false);
        }

    }

    const debounced = useDebouncedCallback(() => {
        form.handleSubmit(onSubmit)();
    }, 1000, { leading: false });

    return (
        <Form {...form}>
            <form onChange={debounced} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="w-full px-2 flex flex-col">
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    {...field}
                                    value={field.value ?? ""}
                                    disabled={isLoading}
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
                        <FormItem className="w-full p-1 flex flex-col">
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder="Ej: Respuesta"
                                    value={field.value ?? ""}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
