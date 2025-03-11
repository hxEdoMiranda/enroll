
export interface ServiceModel {
  uid: string;  // Si necesitas mantener el uid
  code: string;
  name: string;
  description: string;
  country: string[];  // Listado de países (puede ser un array de IDs)
  price_2b: string;  // El precio del servicio en 2b
  discount_2b: string;  // Descuento para 2b
  price_2c: string;  // El precio del servicio en 2c
  discount_2c: string;  // Descuento para 2c
  responsible_name: string;  // Nombre de la persona responsable
  responsible_mail: string;  // Correo electrónico de la persona responsable
  state: boolean;
}

  