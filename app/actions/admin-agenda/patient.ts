const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

export const fetchGetPatientExists = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${BASE_API_URL_LAMBDA}/patient/holder?idPatient=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "Patient not found") {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data.success !== false;
  
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Ocurrió un error inesperado");
      }
      return false;
    }
  };