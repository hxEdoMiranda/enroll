const BASE_API_URL = "https://api.medibuslive.com/dev/backoffice/nom035";

interface IArea {
  name_area: string;
  status: boolean;
}


interface IAreaResponse {
  success: boolean;
  data?: IArea | IArea[];
  message?: string;
}

export const getArea = async (area: IArea): Promise<IAreaResponse> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(area);

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(`${BASE_API_URL}/area`, requestOptions);
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
export const postArea = async (area: IArea): Promise<IAreaResponse> => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    const raw = JSON.stringify(area);
  
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
  
    try {
      const response = await fetch(`${BASE_API_URL}/area`, requestOptions);
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