"use server";

import { UserData } from "../schemas/user-patient.schema"; 

const BASE_API_URL_LAMBDA = "https://api.medibuslive.com/dev/clerk";


export const getClerkUsers = async () => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/user`, {
      method: "GET",
      redirect: "follow"
    });
    const result = await response.json();
    return {
      ok: response.ok,
      data: result,
      message: response.ok ? "Users fetched successfully" : "Failed to fetch users"
    };
  } catch (error) {
    console.error(`Error [GET] getClerkUsers`, error);
    throw new Error("Error fetching Clerk users");
  }
};

export const createMailUser = async (user: UserData) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/invitation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user),
      redirect: "follow"
    });
    const result = await response.json();
    return {
      ok: response.ok,
      data: result,
      message: response.ok ? "User invitation sent successfully" : "Failed to send invitation"
    };
  } catch (error) {
    console.error(`Error [POST] createMailUser`, error);
    throw new Error("Error sending user invitation");
  }
};

export const updateClerkUserById = async (id: string, data: Partial<UserData>) => {
  try {
    const response = await fetch(`${BASE_API_URL_LAMBDA}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    return {
      ok: response.ok,
      data: result,
      message: response.ok ? "User updated successfully" : "Failed to update user"
    };
  } catch (error) {
    console.error(`Error [PUT] updateClerkUserById`, error);
    throw new Error("Error updating Clerk user");
  }
};