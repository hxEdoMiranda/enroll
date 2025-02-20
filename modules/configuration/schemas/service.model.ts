import { Schema, model, ObjectId } from "mongoose";
import { ServiceModel } from "../types/Service.type";

const ServiceSchema: Schema<ServiceModel> = new Schema({
    code: { type: String, required: true, uppercase: true, trim: true },
    name: { type: String, required: true, uppercase: true, trim: true },
    description: { type: String, required: true, trim: true },
    country: [{ type: Schema.Types.ObjectId, ref: 'Country' }]
}, { timestamps: true, versionKey: false });

ServiceSchema.methods.toJSON = function () {
    const { __v, _id, ...service } = this.toObject();
    service.uid = _id;
    return service;
};

// Exporta el modelo
export const Service = model("Service", ServiceSchema);
