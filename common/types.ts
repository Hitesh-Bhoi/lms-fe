import { LEADS_STATUS_ENUM } from "./enums";
 
export interface LeadRecordType {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status?: LEADS_STATUS_ENUM | string;
    created_at?: string;
    updated_at?: string;
};

export interface PaginationType {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};