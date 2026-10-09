import { LEADS_STATUS_ENUM, TOAST_TYPE_ENUM } from "./enums";

// lead record domain entity interface (used across apis, dashboard, lead form, and modals)
export interface LeadRecordType {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    status?: LEADS_STATUS_ENUM | string;
    created_at?: string;
    updated_at?: string;
}

// pagination state and api metadata interface (used across apis, dashboard, and pagination)
export interface PaginationType {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// lead note domain entity interface (used across lead form and note records)
export interface NoteRecordType {
    _id?: string;
    lead_id?: string | LeadRecordType;
    content: string;
    created_at?: string;
    updated_at?: string;
}

// toast notification state interface (shared across topbar, lead form, and leads list)
export interface ToastInfoType {
    message: string;
    type: TOAST_TYPE_ENUM;
}

// function signature for displaying toast notifications (shared across lead form, leads list, and delete modal)
export type ShowToastFunction = (message: string, type?: TOAST_TYPE_ENUM) => void;
