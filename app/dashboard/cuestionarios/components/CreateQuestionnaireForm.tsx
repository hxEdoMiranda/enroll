"use client";

import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useModal } from "@/modules/shared/modal/provider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createQuestionnaire } from "@/modules/questionnaires/actions/questionnaires";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export const CreateQuestionnaireForm = () => {

    const [loading, setLoading] = useState(false);
    const modal = useModal();
    const router = useRouter();

    const FormDataSchema = z.object({
        title: z
            .string()
            .min(1, { message: 'Este campo es requerido' }),
        description: z
            .string()
            .min(1, { message: 'Este campo es requerido' }),
    })

    type Inputs = z.infer<typeof FormDataSchema>

    const form = useForm<Inputs>({
        resolver: zodResolver(FormDataSchema),
        mode: 'onSubmit',
        reValidateMode: "onSubmit"
    });


    const onSubmit: SubmitHandler<Inputs> = async data => {
        setLoading(true);
        const loadingToast = toast.loading('Cargando');
        const result = await createQuestionnaire({
            title: data.title,
            description: data.description
        });

        if (!result.ok) {
            toast.error("Ocurrió un error", {
                action: {
                    label: "Descartar",
                    onClick: () => console.log("Descartar"),
                },
            });
            setLoading(false);
            toast.dismiss(loadingToast);
            return
        }

        router.refresh();
        toast.success("Se guardaron los cambios")
        setLoading(false);
        toast.dismiss(loadingToast);
        form.reset();
        modal?.hide();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="CUESTIONARIO OQ-45.2" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        disabled={loading}
                        variant="secondary"
                        onClick={modal?.hide}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Guardar
                    </Button>
                </div>
            </form>
        </Form>
    )
}
