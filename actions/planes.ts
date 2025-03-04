const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3";

import { Plan } from "@/modules/configuration/schemas/plan.model";
import { PlanModel as IPlan} from "../modules/configuration/types/Plan.type";


export const postCreatePlan = async (plan: Plan) => {
    console.log("LLegoooooooooooooooooooooooooooooooooooo",plan);
  try {
    const response = await fetch(`${BASE_API_URL}/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plan),
    });
    const result = await response.json();
    console.log(result);
    return result;
    
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};

export const getPlans = async (): Promise<IPlan[]> => {
  console.log("Obteniendo planes...");
  try {
    const response = await fetch(`${BASE_API_URL}/plan`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json(); // Convertir a JSON
    console.log("Respuesta de la API:", result);

    // Extraer la propiedad 'data' del objeto de respuesta
    if (!Array.isArray(result.data)) {
      throw new Error("La respuesta de getPlans no contiene un array en 'data'");
    }

    return result.data as IPlan[];
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};

export const getPlanId = async (companyId: string): Promise<IPlan[]> => {
  console.log("Obteniendo planes...");
  try {
    const url = `${BASE_API_URL}/plan?company_id=${companyId}`;
    console.log(`URL de solicitud: ${url}`); // Verifica la URL generada
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      const errorText = await response.text(); // Leer el cuerpo de la respuesta
      throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json(); // Convertir a JSON
    console.log("Respuesta de la API:", result);

    // Extraer la propiedad 'data' del objeto de respuesta
    if (!Array.isArray(result.data)) {
      throw new Error("La respuesta de getPlans no contiene un array en 'data'");
    }

    return result.data as IPlan[];
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
