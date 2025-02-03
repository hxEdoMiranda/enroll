"use server";

import { IQuestion } from "../types/questionnaires";

const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

interface ICreateQuestion {
  text: string;
  type: "TEXT" | "OPTION" | "RADIO" | "CHECK" | "TEXTAREA";
  options: {
    text: string;
    score?: number;
  }[];
}

interface ICreateQuestionResult {
  message: string;
  data: {
    uid: string;
    createdAt: string;
    updatedAt: string;
    text: string;
    type: string;
    options: {
      text: string;
      type: string;
      _id: string;
    }[];
  };
}

export async function createQuestion({ text, type, options }: ICreateQuestion) {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/questionnaire/question`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          type,
          options,
        }),
      }
    );

    const result: ICreateQuestionResult = await response.json();

    if (response.ok && response.status === 200) {
      return {
        ok: true,
        data: result.data,
        message: "Pregunta creada correctamente",
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

interface IGetQuestionsResult {
  message?: string;
  data: Data[];
}

interface Data {
  text?: string;
  type?: string;
  options?: Option[];
  state?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  uid?: string;
}

interface Option {
  text?: string;
  score?: number;
  _id?: string;
}

export async function getQuestions() {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/questionnaire/question`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const result: IGetQuestionsResult = await response.json();

    if (response.ok && response.status === 200) {
      return {
        ok: true,
        data: result.data,
        message: "",
      };
    } else {
      return {
        ok: false,
        data: result.data,
        message: result.message,
      };
    }
  } catch (error) {
    console.error(`Error [GET] getQuestions`, error);
    throw new Error("Error fetching data");
  }
}

interface IUpdateQuestionById {
  id: string;
  text: string;
  type: string;
  options: {
    text: string;
    score?: number;
    correct_answer?: boolean;
    _id?: string;
  }[];
}

interface IUpdateQuestionByIdResult {
  ok: boolean;
  message: string;
  data: IQuestion;
}

export async function updateQuestionById({
  id,
  text,
  type,
  options,
}: IUpdateQuestionById) {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/questionnaire/question/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          text,
          type,
          options,
        }),
      }
    );

    const result = await response.json();

    if (response.ok && response.status === 200) {
      return result as IUpdateQuestionByIdResult;
    }

    throw new Error("Ocurrió un error");
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Ocurrió un error" };
    }
  }
}
