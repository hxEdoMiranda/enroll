const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

import { UserData } from "../types/user-data.type.js"; 
import { z } from "zod";
import { UserDataSchema } from "../schemas/user-data.schema.js";

interface ErrorResponse {
  error: string;
}

export async function fetchAllUsers(): Promise<UserData[] | ErrorResponse> {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/patient`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: unknown = await response.json();
    
    // Valida los datos recibidos usando el esquema de validación
    const validatedData = z.array(UserDataSchema).parse(data);

    return validatedData as UserData[];
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Ocurrió un error inesperado" };
    }
  }
}
