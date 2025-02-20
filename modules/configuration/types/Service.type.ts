import { ObjectId } from "mongoose";

export interface ServiceModel {
    _id: string;
    code: string;
    name: string;
    description: string;
    country: ObjectId[];
  }
  