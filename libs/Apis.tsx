import axios from "axios";
import { LeadRecordType } from "@/common/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllLeadsList = async () => {
  return axios.get(`${baseUrl}/leads`);
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