import { ObjectId } from "mongodb";

export interface HomeRequest {
  _id: ObjectId;
  requestedBy: string;
  requestedAt: Date;
  requestType: "Access Request";
  entranceAt: Date;
  accessTo: "Basement" | "Second Floor" | "Main Floor";
  requestReason: string;
  approvalBy?: string;
  approvalStatus?: string;
  approvalAt?: Date;
  approvalNote?: string;
}
