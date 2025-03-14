const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3";

export interface IService {
  uid?: string; // Hacer que uid sea opcional
  code: string;
  name: string;
  description: string;
  country: string[];
}

// Función para obtener servicios con filtros opcionales (code, name, uid)
export const getServices = async (code?: string, name?: string, uid?: string): Promise<IService[]> => {
  try {
    // Construimos la URL con parámetros opcionales
    let url = `${BASE_API_URL}/services`;
    const queryParams: string[] = [];
    if (code) queryParams.push(`code=${code}`);
    if (name) queryParams.push(`name=${name}`);
    if (uid) queryParams.push(`uid=${uid}`);

    if (queryParams.length) {
      url += '?' + queryParams.join('&');
    }

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los servicios");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
