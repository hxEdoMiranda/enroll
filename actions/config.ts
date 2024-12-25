const BASE_API_URL = "https://api.medibuslive.com/dev/pr/enroll/v2";

interface ICompanyConfig {
  idEmpresa: number;
  img: string;
  texto: string;
  subTexto: string;
  accion: string;
  target: string;
}

export const getCompanyConfig = async (company_id: number): Promise<ICompanyConfig[]> => {
  const requestOptions = {
    method: "GET",
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(`${BASE_API_URL}/company/config?company_id=${company_id}`, requestOptions);
    const result = await response.json();
    console.log(result);
    return result.data; // Devuelve el arreglo de objetos ICompanyConfig
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
