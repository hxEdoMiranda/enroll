const BASE_API_URL = "https://api.medibuslive.com/dev/pr/enroll/v3";

interface IPlan {
  identifier: string;
  name: string;
  company: string;
  start_validity: string;
  end_validity: string;
  holder_quantity: number;
  manage_loads: boolean;
}

export const postCreatePlan = async (plan: IPlan): Promise<any> => {
    console.log("LLegoooooooooooooooooooooooooooooooooooo");
  try {
    const response = await fetch(`${BASE_API_URL}/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plan),
    });
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
