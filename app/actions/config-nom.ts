const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/nom035";

import { ConfigData as INom035Config} from "../../modules/configuration/types/nom035-config.type.ts";

export const getNom035Config = async (): Promise<INom035Config> => {
  console.log("Obteniendo configuración NOM-035...");
  try {
    const url = `${BASE_API_URL}/config`;
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

    return result as INom035Config;
  } catch (error) {
    let errorMessage = "An error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching NOM-035 config: ${errorMessage}`);
  }
};

