import axios from "axios";
import { LeadRecordType } from "@/common/types";

const baseUrl = process.env.NODE_ENV === "production" 
  ? process.env.NEXT_PUBLIC_BASE_URL_PROD 
  : process.env.NEXT_PUBLIC_BASE_URL_DEV;
console.log(baseUrl);
axios.defaults.withCredentials = true;

// api query parameters for fetching leads
export interface GetLeadsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const getAllLeadsList = async (params?: GetLeadsParams) => {
  return axios.get(`${baseUrl}/leads`, { params });
};

export const getLeadById = async (id: string) => {
  return axios.get(`${baseUrl}/leads/${id}`);
};

export const createLead = async (data: LeadRecordType) => {
  return axios.post(`${baseUrl}/leads`, data);
};

export const updateLead = async (id: string, data: Partial<LeadRecordType>) => {
  return axios.patch(`${baseUrl}/leads/${id}`, data);
};

export const deleteLead = async (id: string) => {
  return axios.delete(`${baseUrl}/leads/${id}`);
};

export const createLeadNote = async (leadId: string, data: { content: string }) => {
  return axios.post(`${baseUrl}/leads/${leadId}/notes`, data);
};

export const getLeadNotes = async (leadId: string) => {
  return axios.get(`${baseUrl}/leads/${leadId}/notes`);
};

export const loginAdmin = async (data: { email: string; password: string }) => {
  return axios.post(`${baseUrl}/auth/login`, data);
};

export const logoutAdmin = async () => {
  return axios.post(`${baseUrl}/auth/logout`);
};

export const getAdminProfile = async () => {
  return axios.get(`${baseUrl}/auth/me`);
};