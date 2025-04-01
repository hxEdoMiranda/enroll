"use server";
import { auth } from '@clerk/nextjs/server'
import { UpdateDataUserFormatted, UserDataFormatted } from "../schemas/user-data.schema";

const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;

export const getAllUsers = async () => {
  try {
    //const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/patient`);
    const { getToken } = await auth()
    const token = await getToken()
    const response = await fetch(`${BASE_API_URL_LAMBDA}/patient/holder`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
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
    console.error(`Error [GET] getAllUsers`, error);
    throw new Error("Error fetching data");
  }
}

export const getUserById = async (id: string) => {
  try {
    //const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/patient/${id}`);
    const response = await fetch(`${BASE_API_URL_LAMBDA}/patient/holder?idOauth=${id}`);
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
    console.error(`Error [GET] getUserById`, error);
    throw new Error("Error fetching data");
  }
}

export const createUser = async (user: UserDataFormatted) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/patient`, {
      method: "POST",
      body: JSON.stringify(user)
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
    console.error(`Error [POST] createUser`, error);
    throw new Error("Error creating user");
  }
}

export const updateUserById = async (id: string, data: UpdateDataUserFormatted) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/backoffice/enroll/v3/patient/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
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
    console.error(`Error [PUT] updateUser`, error);
    throw new Error("Error updating data");
  }
}