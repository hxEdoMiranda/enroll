import { SlotRequestBody, Slot, ErrorResponse } from "@/types/agenda-admin/slots";

interface SlotsResponse {
  data: Slot[];
  message?: string;
}

const BASE_API_URL_LAMBDA = "https://api.medibuslive.com/dev";

export const fetchCreateSlot = async (slotData: SlotRequestBody): Promise<{ data: Slot } | ErrorResponse> => {
     console.log('slotData', slotData);
  try {
      const response = await fetch(
        `${BASE_API_URL_LAMBDA}/agenda/slot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(slotData),
        },
      );
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      
      return { data: responseData.data };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, message: error.message };
      } else {
        return {
          error: "Ocurrió un error inesperado",
          message: "No se pudo crear el slot",
        };
      }
    }
  };
  
  
  export const fetchGetSlotsByScheduleId = async (scheduleId: string, timeZone: string): Promise<{ data: Slot[] } | ErrorResponse> => {
    try {
      const response = await fetch(
        `${BASE_API_URL_LAMBDA}/agenda/slot?idSchedule=${scheduleId}&timeZone=${timeZone}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: SlotsResponse = await response.json();
      
      return { data: data.data };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, message: error.message };
      } else {
        return {
          error: "Ocurrió un error inesperado",
          message: "No se pudieron obtener los slots",
        };
      }
    }
  };
  
  export const fetchDeleteSlot = async (slotId: string): Promise<{ success: boolean } | ErrorResponse> => {
    try {
      const response = await fetch(
        `${BASE_API_URL_LAMBDA}/agenda/slot/${slotId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, message: error.message };
      } else {
        return {
          error: "Ocurrió un error inesperado",
          message: "No se pudo eliminar el slot",
        };
      }
    }
  };


  export const fetchGetSlotsByidPractitioner= async (idPractitioner: string): Promise<{ data: Slot[] } | ErrorResponse> => {
     
    try {
      const response = await fetch(
        `${BASE_API_URL_LAMBDA}/agenda/slot?idPractitioner=${idPractitioner}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data: SlotsResponse = await response.json();
      
      return { data: data.data };
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message, message: error.message };
      } else {
        return {
          error: "Ocurrió un error inesperado",
          message: "No se pudieron obtener los slots",
        };
      }
    }
  };