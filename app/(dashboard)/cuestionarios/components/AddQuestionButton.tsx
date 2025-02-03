"use client";

import { useModal } from "@/components/modal/provider";
import { Button } from "@/components/ui/button";
import { AddQuestionForm } from "./AddQuestionForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddGroupForm } from "../[id]/components/AddGroupForm";
import { useQuestionnaire } from "../[id]/components/QuestionnaireProvider";

interface IAddQuestionButton {
  questionnaireId: string;
  currentQuestions: string[];
}

export const AddQuestionButton = () => {
  return (
    <Dialog>
      <DialogHeader>
        <DialogTitle hidden>Agregar grupo al cuestionario</DialogTitle>
      </DialogHeader>
      <DialogTrigger asChild>
        <Button>Agregar preguntas</Button>
      </DialogTrigger>
      <DialogContent>
        <AddQuestionForm />
      </DialogContent>
    </Dialog>
  );
};
