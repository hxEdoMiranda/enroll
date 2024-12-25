const BASE_API_URL = "https://api.medibuslive.com/dev/pr/enroll/v3";

interface ICountry {
  codigo: string;
  nombre: string;
  codTelefono: string;
  createdAt: string;
  updatedAt: string;
  uid: string;
}

export interface IEmpresa {
  uid?: string;
  identifier: string;
  nid: string;
  name: string;
  industry_type: string;
  business_type: string;
  country: ICountry; // Cambié esto para que sea un objeto de tipo ICountry
  start_validity: string;
  end_validity: string;
  contact: { name: string }[];
  commercial_manager: { name: string };
  kam: { name: string };
}


export const postCreateEmpresa = async (empresa: IEmpresa): Promise<any> => {
    console.log("Formulario00000000000000000000000000000000000:");
  try {
    const response = await fetch(`${BASE_API_URL}/empresa`, {
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
    const response = await fetch(`${BASE_API_URL}/empresa/${empresa.uid}`, {
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
    const response = await fetch(`${BASE_API_URL}/empresa`, {
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
