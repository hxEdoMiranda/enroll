const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/nom035";

interface IPuesto {
  name_puesto: string;
  status: boolean;
}

// Definir una interfaz para la respuesta
interface IPuestoResponse {
  success: boolean;
  data?: IPuesto | IPuesto[];
  message?: string;
}

export const getPuesto = async (puesto: IPuesto): Promise<IPuestoResponse> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(puesto);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_API_URL}/puesto`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
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

export const postPuesto = async (puesto: IPuesto): Promise<IPuestoResponse> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(puesto);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_API_URL}/puesto`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error posting data: ${errorMessage}`);
  }
};
