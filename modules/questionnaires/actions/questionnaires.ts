"use server";

import {
  Group,
  GroupBasic,
  Questionnaire,
} from "../types/questionnaires";

const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

export interface IGetQuestionnaireByIdResult {
  message: string;
  data: Questionnaire;
}

interface IGetQuestionnaires {
  id: string;
}

export interface IGetQuestionnairesResult {
  message: string;
  data: Questionnaire[] | [];
}

export async function getQuestionnaireById({ id }: IGetQuestionnaires) {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/questionnaire/${id}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: IGetQuestionnaireByIdResult = await response.json();

    if (response.ok) {
      return {
        ok: true,
        ...result,
      };
    } else {
      return {
        ok: false,
        data: null,
        message: null,
      };
    }
  } catch (error) {
    console.error(`Error [GET] getQuestionnaireById ID: ${id}`, error);
    throw new Error("Error fetching data");
  }
}

export async function getQuestionnaires(): Promise<{
  ok: boolean;
  data: Questionnaire[] | null;
  message: string | null;
}> {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/questionnaire`, {
      method: "GET",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result: IGetQuestionnairesResult = await response.json();

    if (response.ok) {
      return {
        ok: true,
        ...result,
      };
    } else {
      return {
        ok: false,
        data: null,
        message: null,
      };
    }
  } catch (error) {
    console.error(`Error [GET] getQuestionnaires`, error);
    throw new Error("Error fetching data");
  }
}

interface IDeleteQuestionnaireById {
  id: string;
}

export async function deleteQuestionnaireById({
  id,
}: IDeleteQuestionnaireById) {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/questionnaire/${id}`, {
      method: "DELETE",
    });

    if (response.ok && response.status === 200) {
      return {
        ok: true,
        data: null,
        message: "Cuestionario borrado correctamente",
      };
    } else {
      return {
        ok: false,
        data: null,
        message: "Ocurrió un error",
      };
    }
  } catch (error) {
    console.error(`Error [GET] deleteQuestionnaireById`, error);
    throw new Error("Error fetching data");
  }
}

interface IUpdateQuestionnaireById {
  id: string;
  title?: string;
  description?: string;
  questions?: string[];
  groups?: GroupBasic[];
}

export async function updateQuestionnaireById({
  id,
  title,
  description,
  questions,
  groups,
}: IUpdateQuestionnaireById) {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/questionnaire/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title,
        description,
        questions,
        groups,
      }),
    });

    if (response.ok && response.status === 200) {
      return {
        ok: true,
        data: null,
        message: "Cuestionario editado correctamente",
      };
    } else {
      throw new Error("Ocurrió un error");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Ocurrió un error" };
    }
  }
}

interface ICreateQuestionnaire {
  title: string;
  description: string;
  questions?: string[];
  groups?: Group[];
}

export async function createQuestionnaire({
  title,
  description,
  questions,
  groups,
}: ICreateQuestionnaire) {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/questionnaire`, {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        questions: questions ?? [],
        groups: groups ?? [],
      }),
    });

    if (response.ok && response.status === 200) {
      return {
        ok: true,
        data: null,
        message: "Cuestionario creado correctamente",
      };
    } else {
      return {
        ok: false,
        data: null,
        message: "Ocurrió un error",
      };
    }
  } catch (error) {
    console.error(`Error [GET] deleteQuestionnaireById`, error);
    throw new Error("Error fetching data");
  }
}
