export interface ErrorResponse {
    error: string;
    message: string;
  }
  
  export interface ScheduleResponse {
    data: Schedule[];
  }
  
  export interface Schedule {
    serviceCategory: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    meta: {
      lastUpdated: string;
      versionId: string;
      extension: {
        url: string;
        valueInstant: string;
      }[];
    };
    specialty: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    resourceType: string;
    serviceType: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    planningHorizon: {
      end: string;
      start: string;
    };
    active: boolean;
    id: string;
    comment: string;
    actor: {
      display: string;
      reference: string;
    }[];
  }
  
  export interface CleanedSchedule {
    specialty: string;
    start: string;
    end: string;
    id: string;
    active: boolean;
  }



  export interface ErrorResponse {
    error: string;
    message: string;
  }
  
  export interface ScheduleResponse {
    data: Schedule[];
  }
  
  export interface Schedule {
    serviceCategory: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    meta: {
      lastUpdated: string;
      versionId: string;
      extension: {
        url: string;
        valueInstant: string;
      }[];
    };
    specialty: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    resourceType: string;
    serviceType: {
      coding: {
        code: string;
        system: string;
        display: string;
      }[];
    }[];
    planningHorizon: {
      end: string;
      start: string;
    };
    active: boolean;
    id: string;
    comment: string;
    actor: {
      display: string;
      reference: string;
    }[];
  }
  
  export interface CleanedSchedule {
    specialty: string;
    start: string;
    end: string;
    id: string;
    active: boolean;
  }
  
  export interface CreateScheduleData {
    idPractitioner: string;
    idSpecialty?: string;
    nameSpecialty?: string;
    startDateTime: string;
    endDateTime: string;
    timeZone: string;
    comment?: string;
  }

  export interface TimeSlot {
    startTime: string;
    endTime: string;
    isNew?: boolean;
    isExisting?: boolean;
    scheduleId?: string;
    specialtyCode?: string;
    specialtyDisplay?: string;
  }
  
  export interface DaySchedule {
    date: Date;
    enabled: boolean;
    timeSlots: TimeSlot[];
    isExisting?: boolean;
    specialty?: string;
    specialtyCode?: string;
    scheduleId?: string;
  }
  
  export interface WeekSchedule {
    weekNumber: number;
    startDate: Date;
    endDate: Date;
    days: DaySchedule[];
  }

  export interface Slot {
    id: string;
    idSchedule?: string;
    startDateTime: string;
    endDateTime: string;
    status: "free" | "occupied"; 
    timeZone?: string; 
    
    patientId?: string;
    practitionerId?: string;
    specialty?: string;
    
    isNew?: boolean;
    isExisting?: boolean;
    specialtyDisplay?: string;
  }