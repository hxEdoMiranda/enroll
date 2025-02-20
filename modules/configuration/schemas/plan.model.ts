import mongoose, { Schema, model } from "mongoose";
const { ObjectId } = mongoose.Types;
import { Company } from "./company.model";
import { PlanModel } from "../types/Plan.type";
import { Service } from "./service.model";

const PlanSchema: Schema<PlanModel> = new Schema({
  identifier: { type: String, required: true, uppercase: true, trim: true, unique: true },
  name: { type: String, required: true, uppercase: true, trim: true },
  state: { type: Boolean, default: true },
  start_date: { type: Date, required: true, trim: true },
  end_date: { type: Date, required: true, trim: true },
  max_number_of_holders: { type: Number, required: true },
  self_managed_load: { type: Boolean, default: false },
  max_number_of_loads: { type: Number, default: 0 },
  custom_plan_id: { type: ObjectId, ref: "Plan"},
  company: { type: ObjectId, ref: Company, required: true }
  Service: { type: ObjectId, ref: Service }
}, { timestamps: true, versionKey: false });

PlanSchema.methods.toJSON = function () {
  const { __v, _id, ...program } = this.toObject();
  program.uid = _id;
  return program;
};

// Exportar modelo
export const Plan = model<PlanModel>("Plan", PlanSchema);
