const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3"; 

import { CompanyModel as IEmpresa} from "../modules/configuration/types/Company.type";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";

export const postCreateEmpresa = async (empresa: IEmpresa): Promise<any> => {
  console.log("Formularioooooooooooooooooooooooooooooooooooo:");
  try {
    const response = await fetch(`${BASE_API_URL}/company`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });
    const result = await response.json();
    return result;
    
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};

export const updateEmpresa = async (empresa: IEmpresa): Promise<any> => {
  try {
    const response = await fetch(`${BASE_API_URL}/empresa/${empresa._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresa),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error updating data: ${errorMessage}`);
  }
};

export const getEmpresas = async (): Promise<IEmpresa[]> => {
  try {
    const response = await fetch(`${BASE_API_URL}/company`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Asegúrate de acceder a `result.data` que contiene el array de empresas
    if (Array.isArray(result.data)) {
      return result.data; // Devuelve el array de empresas
    } else {
      console.error("Se esperaba un array en 'result.data', pero no se encontró.");
      return []; // Devuelve un array vacío si no es un array
    }
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
export const getEmpresasFull = async (): Promise<CompanyFullModel[]> => {
  try {
    const response = await fetch(`${BASE_API_URL}/company`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Asegúrate de acceder a `result.data` que contiene el array de empresas
    if (Array.isArray(result.data)) {
      return result.data; // Devuelve el array de empresas
    } else {
      console.error("Se esperaba un array en 'result.data', pero no se encontró.");
      return []; // Devuelve un array vacío si no es un array
    }
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};

export const getEmpresa = async (id:string): Promise<CompanyFullModel|null> => {
  try {
console.log("Identioficador:", id);
    const response = await fetch(`${BASE_API_URL}/company?identifier=${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
console.log("============================================================",result)
    // Asegúrate de acceder a `result.data` que contiene el array de empresas
    if (Array.isArray(result.data)) {
      console.log("=============================================================================",result.data[0])
      return result.data[0]; // Devuelve la empresas
    } else {
      console.error("Se esperaba un array en 'result.data', pero no se encontró.");
      return null; // Devuelve un array vacío si no es un array
    }
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};