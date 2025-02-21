export interface ContactModel {
    name: string;
    phone?: string;  // Hacer opcional
    mail?: string;   // Hacer opcional
}

export interface CompanyModel {
    _id?: string;
    uid: string;  // Hacer requerido
    identifier: string;
    name: string;
    trade_name: string;
    corporate_name: string;
    country: string;
    industry_type: string;
    business_type: string;
    company_phone: string;
    company_email: string;
    contact: ContactModel[];  // Cambiar a array de ContactModel
    commercial_manager: ContactModel[];  // Cambiar a array de ContactModel
    kam: ContactModel[];  // Cambiar a array de ContactModel
    employee_count: number;
    state: boolean;  // Añadir el campo state
}
