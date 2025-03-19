"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useQuestionnaire } from "./QuestionnaireProvider";
import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { isActionError } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const DeleteGroupForm = ({ groupIndex }: { groupIndex: number }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { questionnaire } = useQuestionnaire();

  const onSubmit = async () => {
    setLoading(true);

    const loadingToast = toast.loading("Cargando");

    try {
      const updatedGroups = questionnaire.groups
        .filter((group, i) => i !== groupIndex)
        .map((group) => ({
          ...group,
          questions: group.questions.map(({ _id }) => _id),
        }));

      const result = await updateQuestionnaireById({
        id: questionnaire.uid,
        groups: updatedGroups,
      });

      if (isActionError(result)) {
        throw new Error(result.error);
      }

      router.refresh();
      toast.success("Grupo removido correctamente,");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error");
      }
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="w-full ">
      <h1 className="mb-4 font-semibold">
        ¿Estas seguro de borrar el grupo del cuestionario?
      </h1>
      <p>Esta acción es permanente y no se puede deshacer</p>
      <fieldset className="flex justify-end gap-2 mt-4" disabled={loading}>
        <DialogClose>
          <Button variant="secondary" type="button" disabled={loading}>
            Cancelar
          </Button>
        </DialogClose>
        <Button
          variant="destructive"
          type="submit"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Borrar
        </Button>
      </fieldset>
    </div>
  );
};
