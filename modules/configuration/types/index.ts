// Modelo principal del resultado
export interface ConfigResponse {
  message: string;
  data: ConfigData[];
}

// Datos dentro de la configuración
export interface ConfigData {
  company_id: string;
  nom035: {
    comment_data: CommentData;
    RFC: string;
    employee_count: number;
    trade_name: string;
    postal_code: string;
    comment_status: boolean;
    configuration_status: boolean;
    periods: Period[];
    configuration_data: ConfigurationData[];
  };
  uid: string;
}

// Detalles de los comentarios
export interface CommentData {
  email: string;
  subject: string;
  body: string;
}

// Detalles de los periodos
export interface Period {
  _id: string;
  period_name: string;
  start_date: string; // Fecha como ISO 8601 (string)
  end_date: string; // Fecha como ISO 8601 (string)
  available_surveys: number;
}

// Detalles de la configuración
export interface ConfigurationData {
  _id: string;
  area: Area;
  puesto: Puesto[];
}

// Detalles del área
export interface Area {
  _id: string;
  name_area: string;
  status: boolean;
  createdAt: string; // Fecha como ISO 8601 (string)
  updatedAt: string; // Fecha como ISO 8601 (string)
}

// Detalles del puesto
export interface Puesto {
  _id: string;
  name_puesto: string;
  status: boolean;
  createdAt: string; // Fecha como ISO 8601 (string)
  updatedAt: string; // Fecha como ISO 8601 (string)
}
