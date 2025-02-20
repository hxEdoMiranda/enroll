import { ObjectId } from "mongoose";

export interface ContactModel {
    name: string;
    phone: string | null;
    mail: string | null;
    _id?: string; 
    uid?: string;
}

export interface CompanyModel {
    _id?: ObjectId;
    identifier: string;
    name: string;
    trade_name: string;
    corporate_name: string;
    country: ObjectId;
    industry_type: string;
    business_type: string;
    company_phone: string;
    company_email: string;
    contact: ContactModel;
    commercial_manager: string;
    commercial_manager_email: string;
    kam: string;
    email_kam: string;
    employee_count: number;
}
