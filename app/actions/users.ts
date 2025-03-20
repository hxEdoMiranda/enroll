const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/enroll/v3";

interface IPatient {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const fetchPatients = async (): Promise<IPatient[]> => {
  const requestOptions = {
    method: "GET",
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(`${BASE_API_URL}/patient`, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    let errorMessage = 'An error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error(errorMessage);
    throw new Error(`Error fetching data: ${errorMessage}`);
  }
};
