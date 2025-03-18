"use client";

import { Questionnaire } from "@/modules/questionnaires/types/questionnaires";
import { ReactNode, createContext, useContext, useState } from "react";

interface QuestionnaireContextProps {
  questionnaire: Questionnaire;
  setQuestionnaire: (questionnaire: Questionnaire) => void;
}

const QuestionnaireContext = createContext<
  QuestionnaireContextProps | undefined
>(undefined);

export function QuestionnaireProvider({
  children,
  defaultQuestionnaire,
}: {
  children: ReactNode;
  defaultQuestionnaire: Questionnaire;
}) {
  const [questionnaire, setQuestionnaireState] =
    useState<Questionnaire>(defaultQuestionnaire);

  const setQuestionnaire = (data: Questionnaire) => {
    setQuestionnaireState(data);
  };

  return (
    <QuestionnaireContext.Provider
      value={{ questionnaire, setQuestionnaire }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error(
      "useQuestionnaire must be used within a QuestionnaireProvider"
    );
  }
  return context;
}
