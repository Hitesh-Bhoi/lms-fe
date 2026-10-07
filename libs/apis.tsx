import axios from "axios";
import { LeadRecordPayload } from "@/common/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllLeadsList = async () => {
  return await axios.get(`${baseUrl}/leads`);
};

export const getLeadById = async (id: string) => {
  return await axios.get(`${baseUrl}/leads/${id}`);
};

export const createLead = async (data: LeadRecordPayload) => {
  return await axios.post(`${baseUrl}/leads`, data);
};

export const updateLead = async (id: string, data: Partial<LeadRecordPayload>) => {
  return await axios.patch(`${baseUrl}/leads/${id}`, data);
};

export const deleteLead = async (id: string) => {
  return await axios.delete(`${baseUrl}/leads/${id}`);
};