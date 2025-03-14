interface Reference {
  reference: string;
}

export interface Slot {
  id?: string;
  resourceType: "Slot";
  schedule: Reference;
  status: string;
  start: string;
  end: string;
  specialty?: {
    coding: {
      system: string;
      code: string;
      display: string;
    }[];
  }[];
}
  
  export interface SlotRequestBody {
    idSchedule: string;
    timeZone: string;
    startDateTime: string;
    endDateTime: string;
  }
  
  export interface ErrorResponse {
    error: string;
    message?: string;
    status?: number;
  }