const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3/";
//https://api.medibuslive.com/dev/backoffice/enroll/v3/country

interface IPais {
  uid?: string; // Hacer que uid sea opcional
  codigo: string;
  nombre: string;
  codTelefono: string;
}

export const postCreatePais = async (pais: IPais): Promise<any> => {
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

export const updatePais = async (pais: IPais): Promise<any> => {
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
export const getPais = async (uid: string): Promise<IPais> => {
  try {
    const response = await fetch(`${BASE_API_URL}/country/${uid}`, {
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