"use client";

import { useModal } from "@/modules/shared/modal/provider";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { deleteQuestionnaireById } from "@/modules/questionnaires/actions/questionnaires";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeleteQuestionnaireModal({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const modal = useModal();
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    const loadingToast = toast.loading("Cargando");
    const result = await deleteQuestionnaireById({ id });

    if (!result.ok) {
      toast.error("Ocurrió un error", {
        action: {
          label: "Descartar",
          onClick: () => console.log("Descartar"),
        },
      });
      setLoading(false);
      toast.dismiss(loadingToast);
      return;
    }

    toast.success(result.message);
    setLoading(false);
    toast.dismiss(loadingToast);
    router.refresh();
    modal?.hide();
  };

  return (
    <div className="border w-[400px] rounded-md p-4 bg-white shadow-md">
      <h1 className="mb-4 font-semibold">
        ¿Estas seguro de borrar el cuestionario?
      </h1>
      <p>Esta acción es permanente y no se puede deshacer</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="secondary"
          onClick={() => modal?.hide()}
          disabled={loading}
        >
          Cancelar
        </Button>
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
}
