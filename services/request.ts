import axios from "axios";
import { RequestValues } from "../pages/request";

export const submitRequest = async (info: RequestValues) => {
  try {
    const { entranceAt, ...request } = info;
    const result = await axios.post("/api/request", {
      request: { ...request, entranceAt: new Date(), requestedAt: new Date() },
    });
    return result;
  } catch (error: any) {
    throw error;
  }
};

export const updateRequest = async (id: string, user: string, info: any) => {
  try {
    const { approvalStatus, approvalAt, approvalNote } = info;
    const result = await axios.put(`/api/request/${id}`, {
      request: { approvalStatus, approvalAt, approvalBy: user, approvalNote },
    });
  } catch (error: any) {
    throw error;
  }
};
