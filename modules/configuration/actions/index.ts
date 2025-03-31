const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

import { ConfigResponse } from "../types/nom035-config.type.ts";

interface ErrorResponse {
  error: string;
}

export async function fetchConfigByCompanyId({
  companyId,
}: {
  companyId: string;
}): Promise<ConfigResponse | ErrorResponse> {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/backoffice/nom035/config?company_id=${companyId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: ConfigResponse = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Ocurrió un error inesperado" };
    }
  }
}

export async function fetchConfigByCompany({
  companyId,
}: {
  companyId: string;
}): Promise<ConfigResponse | ErrorResponse> {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/backoffice/nom035/config`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data: ConfigResponse = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "Ocurrió un error inesperado" };
    }
  }
}
