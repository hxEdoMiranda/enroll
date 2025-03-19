const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3/config/buttons-home";

interface ICompanyConfig  {
  id_oauth: string;
  texto: string;
  sub_texto: string;
  image: string;
  action: string;
  target: string | null;
  createdAt: string;
  updatedAt: string;
  uid: string;
  app?: string;
}

export const getCompanyConfig = async (id_oauth: string): Promise<ICompanyConfig[]> => {
  // Aquí ya no necesitamos el cuerpo
  const requestOptions = {
    method: "GET",
    redirect: "follow" as RequestRedirect,
  };

  try {
    // Se pasa el parámetro directamente en la URL
    const response = await fetch(`${BASE_API_URL}?id_oauth=${id_oauth}`, requestOptions);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Parsear la respuesta como JSON
    const result = await response.json();

    // Verificar si el campo 'data' está presente y contiene los datos
    if (result.data) {
      return result.data; // Devuelve los datos encontrados
    } else {
      throw new Error("No se encontraron datos.");
    }
  } catch (error) {
    console.error(`Error fetching data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
};
