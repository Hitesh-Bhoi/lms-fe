import axios from "axios";
import { LeadRecordType } from "@/common/types";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export interface GetLeadsParams {
  search?: string;
  status?: string;
}

export const getAllLeadsList = async (params: GetLeadsParams ) => {
  return axios.get(`${baseUrl}/leads`, { params })};

export const getLeadById = async (id: string) => {
  return axios.get(`${baseUrl}/leads/${id}`);
};

export const createLead = async (data: LeadRecordType) => {
  return axios.post(`${baseUrl}/leads`, data);
};

export const updateLead = async (id: string, data: Partial<LeadRecordType>) => {
  return axios.put(`${baseUrl}/leads/${id}`, data);
};

export const deleteLead = async (id: string) => {
  return axios.delete(`${baseUrl}/leads/${id}`);
};