"use server";

import { Service } from "../schemas/service.model";

const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

export const createService = async (service: Service) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/services`, {
      method: "POST",
      body: JSON.stringify(service)
    });
    const result = await response.json();
    if (response.status === 200) {
      return {
        ok: true,
        data: result.data,
        message: result.message
      }
    } else {
      return {
        ok: false,
        data: result.data,
        message: result.message
      }
    }
  } catch (error) {
    console.error(`Error [POST] createService`, error);
    throw new Error("Error creating service");
  }
}

export const updateService = async (id:string, service: Service) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/services?service_id=${id}`, {
      method: "PUT",
      body: JSON.stringify(service)
    });
    const result = await response.json();
    console.log("Result:", result)
    if (response.status === 200) {
      return {
        ok: true,
        data: result.data,
        message: result.message
      }
    } else {
      return {
        ok: false,
        data: result.data,
        message: result.message
      }
    }
  } catch (error) {
    console.error(`Error [POST] createService`, error);
    throw new Error("Error creating service");
  }
}

