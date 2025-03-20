const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3"; 

import { CompanyModel as IEmpresa} from "../../modules/configuration/types/Company.type";
import { CompanyFullModel } from "@/modules/configuration/types/Company.type";

interface IEmpresaResponse {
  success: boolean;
  data?: IEmpresa | IEmpresa[] | CompanyFullModel;
  message?: string;
}

export const postCreateEmpresa = async (empresa: IEmpresa): Promise<IEmpresaResponse> => {
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

export const updateEmpresa = async (empresa: IEmpresa): Promise<IEmpresaResponse> => {
  console.log("JSON.stringify(empresa):",JSON.stringify(empresa),)
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
    const response = await fetch(`${BASE_API_URL}/company?id=${id}`, {
      method: "GET",
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (Array.isArray(result.data)) {
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