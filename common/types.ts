export interface LeadsListType {
    _id: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    created_at: string;
    updated_at: string;
};

export type LeadRecordPayload = {
    name: string;
    email: string;
    phone: string;
    status?: string;
};