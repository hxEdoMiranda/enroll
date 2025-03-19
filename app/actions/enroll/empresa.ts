const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3";

interface IContact {
  name: string;
  phone?: string | null; // Permitir null o undefined
  email?: string;
}
interface ICountry {
  _id: string;
  code: string;
  name: string;
  code_phone: string;
}
export interface IEmpresa {
  _id?: string; // ID de la empresa
  identifier: string; // Identificador único
  name: string; // Nombre de la empresa
  trade_name: string; // Nombre comercial
  corporate_name: string; // Razón social
  country: ICountry; // El país es referenciado por su ObjectId (ID del país)
  industry_type: string; // Tipo de industria
  business_type: string; // Tipo de negocio
  company_phone: string; // Teléfono de la empresa
  company_email: string; // Email de la empresa
  contact: IContact; // Contacto de la empresa con nombre, teléfono y email opcionales
  commercial_manager: string; // Nombre del gerente comercial
  commercial_manager_email: string; // Email del gerente comercial
  kam: string; // Nombre del Key Account Manager (KAM)
  email_kam: string; // Email del Key Account Manager (KAM)
  employee_count: number; // Número de empleados
  enabled: boolean; // Campo para habilitar/deshabilitar
}


export const postCreateEmpresa = async (empresa: IEmpresa): Promise<any> => {
    console.log("Formulario00000000000000000000000000000000000:");
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
