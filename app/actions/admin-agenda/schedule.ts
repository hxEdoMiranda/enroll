import {
  CleanedSchedule,
  CreateScheduleData,
  ErrorResponse,
  ScheduleResponse,
} from "@/types/agenda-admin/schedule";

interface ScheduleResponseData {
  id: string;
  [key: string]: unknown;
}



// const BASE_API_URL_LAMBDA = process.env.BASE_API_URL_LAMBDA;
const BASE_API_URL_LAMBDA = "https://api.medibuslive.com/dev"

export const fetchGetScheduleByIdPractitioner = async (
  id: string,
  startDateTime: string
): Promise<{ data: CleanedSchedule[] } | ErrorResponse> => {
  console.log("fetchGetScheduleByIdPractitioner", id, startDateTime);
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/agenda/schedule?idPractitioner=${id}&startDateTime=${startDateTime}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ScheduleResponse = await response.json();

    const cleanedData: CleanedSchedule[] = data.data.map((schedule) => ({
      specialty: schedule.specialty[0]?.coding[0]?.display || "",
      start: schedule.planningHorizon.start,
      end: schedule.planningHorizon.end,
      id: schedule.id,
      active: schedule.active,
    }));

    return { data: cleanedData };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};

export const createSchedule = async (
  data: CreateScheduleData
): Promise<{ data: ScheduleResponseData } | ErrorResponse> => {
  console.log(data);

  try {
    const response = await fetch(
      `https://api.medibuslive.com/dev/agenda/schedule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return { data: responseData };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};

export const updateSchedule = async (
  data: CreateScheduleData,
  id: string
): Promise<{ data: ScheduleResponseData } | ErrorResponse> => {
  console.log("Updating schedule:", id, data);

  try {
    if (!id) {
      throw new Error("ID de horario no proporcionado");
    }

    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/agenda/schedule/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Error al actualizar: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log("Update success:", responseData);
    return { data: responseData };
  } catch (error) {
    console.error("Error in updateSchedule:", error);
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado al actualizar",
        message: "Ocurrió un error inesperado al actualizar",
      };
    }
  }
};

export const deleteSchedule = async (
  id: string
): Promise<{ data?: ScheduleResponseData | null; message?: string } | ErrorResponse> => {
  try {
    if (!id) {
      throw new Error("ID no proporcionado");
    }
     const  url =  `${BASE_API_URL_LAMBDA}/agenda/schedule/${id}`
     console.log(url)
    const response = await fetch(
      url,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
    }

    let responseData;
    try {
      responseData = await response.json();
      console.log("Delete response:", responseData);
    } catch {
      console.log("Response is not valid JSON, returning generic success");
      return { message: "Recurso eliminado correctamente" };
    }

    return {
      data: responseData.data || null,
      message: responseData.message || "Eliminado correctamente"
    };
    
  } catch (error) {
    console.error("Error in deleteSchedule:", error);
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado al eliminar",
        message: "Ocurrió un error inesperado al eliminar",
      };
    }
  }
};

export const fetchGetScheduleByIdPractitionerAndSpeciality = async (
  id: string,
  idSpecialty: string
): Promise<{ data: unknown[] } | ErrorResponse> => {
  try {
    const response = await fetch(
      `${BASE_API_URL_LAMBDA}/agenda/schedule?idPractitioner=${id}&idSpecialty=${idSpecialty}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const responseData: ScheduleResponse = await response.json();
    return { data: responseData.data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message, message: error.message };
    } else {
      return {
        error: "Ocurrió un error inesperado",
        message: "Ocurrió un error inesperado",
      };
    }
  }
};
