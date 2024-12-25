const BASE_API_URL = "https://api.medibuslive.com/dev/pr/enroll/v3";

interface IPais {
  uid?: string; // Hacer que uid sea opcional
  codigo: string;
  nombre: string;
  codTelefono: string;
}

export const postCreatePais = async (pais: IPais): Promise<any> => {
    console.log("LLegoooooooooooooooooooooooooooooooooooo");
  try {
    const response = await fetch(`${BASE_API_URL}/paises`, {
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

export const updatePais = async (pais: IPais): Promise<any> => {
  try {
    const response = await fetch(`${BASE_API_URL}/paises`, {
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
