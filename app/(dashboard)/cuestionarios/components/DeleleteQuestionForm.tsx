"use client";

import { updateQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useQuestionnaire } from "../[id]/components/QuestionnaireProvider";
import { isActionError } from "@/lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";

interface IDeleteQuestionForm {
  groupIndex?: number;
  questionId: string;
  questionnaireId: string;
}

export const DeleleteQuestionForm = ({
  groupIndex,
  questionId,
  questionnaireId,
}: IDeleteQuestionForm) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { questionnaire } = useQuestionnaire();

  const questions = questionnaire.questions.map(({ _id }) => _id);

  const onSubmit = async () => {
    setLoading(true);

    const loadingToast = toast.loading("Cargando");

    const resultingQuestions = questions.filter((id) => questionId !== id);

    try {
      if (groupIndex !== undefined) {
        const updatedGroups = questionnaire.groups.map((group, i) => ({
          ...group,
          questions:
            i === groupIndex
              ? [
                  ...group.questions
                    .filter(({ _id }) => _id !== questionId)
                    .map(({ _id }) => _id),
                ]
              : group.questions.map(({ _id }) => _id),
        }));

        console.log(updatedGroups);

        const result = await updateQuestionnaireById({
          id: questionnaireId,
          groups: updatedGroups,
        });

        if (isActionError(result)) {
          throw new Error(result.error);
        }
      } else {
        const result = await updateQuestionnaireById({
          id: questionnaireId,
          questions: resultingQuestions,
        });

        if (isActionError(result)) {
          throw new Error(result.error);
        }
      }

      router.refresh();
      toast.success("Pregunta removida correctamente,");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error")
      }
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  return (
    <div className="w-full ">
      <h1 className="mb-4 font-semibold">
        ¿Estas seguro de borrar la pregunta del cuestionario?
      </h1>
      <p>Esta acción es permanente y no se puede deshacer</p>
      <div className="flex justify-end gap-2 mt-4">
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
      </div>
    </div>
  );
};
