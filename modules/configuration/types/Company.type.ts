import { CountryModel } from "@/modules/configuration/types/Country.type";

export interface ContactModel {
    name: string;
    phone?: string;  // Hacer opcional
    mail?: string;   // Hacer opcional
}

export interface CompanyModel {
    _id?: string;
    id?: string;
    uid?: string;  // Hacer requerido
    identifier: string;
    name: string;
    trade_name: string;
    corporate_name: string;
    country: string;
    industry_type: string;
    business_type: string;
    company_phone: string;
    company_email: string;
    contact: ContactModel[];  
    commercial_manager: ContactModel[];  
    kam: ContactModel[];  
    employee_count: number;
    state: boolean;  // Añadir el campo state
}

export interface CompanyFullModel {
    _id?: string;
    id?: string;
    uid?: string;  // Hacer requerido
    identifier: string;
    name: string;
    trade_name: string;
    corporate_name: string;
    country: CountryModel;
    industry_type: string;
    business_type: string;
    company_phone: string;
    company_email: string;
    contact: ContactModel[];  
    commercial_manager: ContactModel[];  
    kam: ContactModel[];  
    employee_count: number;
    state: boolean;  // Añadir el campo state
}
