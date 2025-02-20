import { Schema, model } from "mongoose";
import { CountryModel } from "../types/Country.type";

const CountrySchema: Schema<CountryModel> = new Schema({
    code: { type: String, required: true, uppercase:true, trim:true },
    name: { type: String, required: true, uppercase:true, trim:true  },
    code_phone: { type: String, required: true, uppercase:true, trim:true  },
},{ timestamps: true, versionKey: false});

CountrySchema.methods.toJSON = function () {
  const { __v, _id, state, ...program } = this.toObject();
  program.uid = _id;
  return program;
};

//export default model("Country", CountrySchema);
export const Country = model("Country", CountrySchema);