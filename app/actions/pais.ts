const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3";

import { CountryModel as IPais} from "../../modules/configuration/types/Country.type";

interface IPaisResponse {
  success: boolean;
  data?: IPais | IPais[];
  message?: string;
}

export const postCreatePais = async (pais: IPais): Promise<IPaisResponse> => {
    console.log("LLegoooooooooooooooooooooooooooooooooooo");
  try {
    const response = await fetch(`${BASE_API_URL}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pais),
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

export const updatePais = async (pais: IPais): Promise<IPaisResponse> => {
  try {
    const response = await fetch(`${BASE_API_URL}/country`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pais),
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
export const getPais = async (): Promise<IPais> => {
  try {
    const response = await fetch(`${BASE_API_URL}/country`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result: IPais = await response.json();
    return result;
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
export const getPaises = async (): Promise<IPais[]> => {
  const response = await fetch(`${BASE_API_URL}/country`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los países");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.data || [];
};
