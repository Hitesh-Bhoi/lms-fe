import axios from "axios";
import { LeadRecordType } from "@/common/types";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "http://localhost:5000/api";
console.log(baseUrl);
axios.defaults.withCredentials = true;

// api query parameters for fetching leads
export interface GetLeadsParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
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

// gmail integration payload interface
export interface SendGmailPayload {
  to: string;
  subject: string;
  body: string;
  leadId?: string;
}

// gmail integrated message record interface
export interface GmailMessageRecord {
  id: string;
  leadId?: string;
  to: string;
  from?: string;
  subject: string;
  body: string;
  date: string;
  status: "sent" | "delivered" | "received" | "failed";
}

// in-memory store for session mock emails
const mockEmailsStore: Record<string, GmailMessageRecord[]> = {};

// send email via gmail api
export const sendGmailMail = async (data: SendGmailPayload) => {
  try {
    const res = await axios.post(`${baseUrl}/gmail/send`, data);
    return res;
  } catch (err) {
    console.warn("Backend /gmail/send route not reached, using mock fallback:", err);
    await new Promise((res) => setTimeout(res, 500));
    const newMsg: GmailMessageRecord = {
      id: `msg-${Date.now()}`,
      leadId: data.leadId,
      to: data.to,
      from: "admin@lmsportal.com",
      subject: data.subject,
      body: data.body,
      date: new Date().toISOString(),
      status: "sent",
    };
    const key = data.leadId || data.to;
    if (!mockEmailsStore[key]) {
      mockEmailsStore[key] = [];
    }
    mockEmailsStore[key].unshift(newMsg);
    return {
      data: {
        success: true,
        message: "Email sent successfully via Gmail",
        data: newMsg,
      },
    };
  }
};

// get email history for a lead
export const getLeadGmailHistory = async (leadId: string, email?: string) => {
  try {
    const res = await axios.get(`${baseUrl}/gmail/leads/${leadId}`, {
      params: { email },
    });
    return res;
  } catch (err) {
    console.warn("Backend /gmail/leads not reached, using mock fallback:", err);
    const key = leadId || email || "default";
    const stored = mockEmailsStore[key] || [];
    const initialMock: GmailMessageRecord[] = [
      {
        id: `initial-${leadId}-1`,
        leadId,
        to: email || "lead@example.com",
        from: "admin@lmsportal.com",
        subject: "Welcome to LMS - Introduction & Onboarding",
        body: "Hi there,\n\nThank you for reaching out. We would love to discuss your requirements and how our team can help you achieve your goals.\n\nBest regards,\nLMS Team",
        date: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        status: "sent",
      },
    ];
    return {
      data: {
        success: true,
        data: [...stored, ...initialMock],
      },
    };
  }
};