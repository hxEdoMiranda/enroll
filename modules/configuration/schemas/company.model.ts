import mongoose, { Schema, model } from "mongoose";
import { CompanyModel, ContactModel } from "../types/Company.type";
import { Country } from "./country.model";

const { ObjectId } = mongoose.Types;

// Contact schema como subdocumento
const ContactSchema: Schema<ContactModel> = new Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, default: '', uppercase: true, trim: true },
  mail: { type: String, default: '', lowercase: true, trim: true }
}, { timestamps: true, versionKey: false });

const CompanySchema: Schema<CompanyModel> = new Schema({
  name: { type: String, required: true, trim: true },
  identifier: { type: String, required: true, uppercase: true, trim: true, unique: true },
  trade_name: { type: String, required: true, trim: true },
  corporate_name: { type: String, required: true, trim: true },
  country: { type: Schema.Types.ObjectId, ref: Country, required: true },
  industry_type: { type: String, required: true, trim: true },
  business_type: { type: String, required: true, trim: true },
  company_phone: { type: String, required: true, trim: true },
  company_email: { type: String, required: true, lowercase: true, trim: true },
  contact: { type: ContactSchema, required: true }, // Incluye el subdocumento de contacto
  commercial_manager: { type: String, required: true, trim: true },
  commercial_manager_email: { type: String, required: true, lowercase: true, trim: true },
  kam: { type: String, required: true, trim: true },
  email_kam: { type: String, required: true, lowercase: true, trim: true },
  employee_count: { type: Number, required: true },
}, { timestamps: true, versionKey: false });

// Middleware para capitalizar nombres
CompanySchema.pre('save', function (next) {
  if (this.name) {
    this.name = this.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  if (this.industry_type) {
    this.industry_type = this.industry_type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  if (this.business_type) {
    this.business_type = this.business_type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  next();
});

// Personalización de la conversión de documentos
CompanySchema.methods.toJSON = function () {
  const { __v, _id, ...rest } = this.toObject();
  rest.id = _id;  // Rename `_id` to `id` if you prefer
  return rest;
};

// Exportar modelo
export const Company = model("Company", CompanySchema);
