import { ObjectId } from "mongoose";
import { PatientPlanModel } from "./Patient_Plan.type";

export interface PlanModel {
    uid: string;
    identifier: string;
    name: string;
    state: boolean;
    start_date: Date;
    end_date: Date;
    max_number_of_holders: number;
    self_managed_load: boolean;
    max_number_of_loads: number;
    custom_plan_id: ObjectId;
    company: ObjectId;
    service: ObjectId;
}
