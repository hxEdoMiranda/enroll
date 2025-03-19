"use client";

import { CreateQuestionnaireForm } from "@/app/dashboard/cuestionarios/components/CreateQuestionnaireForm";
import { Button } from "@/components/ui/button";
import { useModal } from "@/modules/shared/modal/provider";
import { SquarePlus } from "lucide-react";

export const AddQuestionnaireButton = () => {
  const modal = useModal();

  return (
    <Button
      className="rounded-[100px] border border-white bg-white/10 shadow-lg hover:bg-white/10"
      onClick={() =>
        modal?.show(
          <div className="border rounded-xl shadow-xl bg-white p-4 w-full max-w-md">
            <CreateQuestionnaireForm />
          </div>
        )
      }
      type="button"
    >
      <SquarePlus className="size-4 shrink-0 mr-1" />
      Crear cuestionario
    </Button>
  );
};
