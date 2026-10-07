"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/libs/apis";
import { LeadsListType } from "@/common/types";
import { LeadForm } from "@/components/LeadForm";
import { ArrowLeftIcon, UsersIcon, RefreshIcon } from "@/common/icon";
import { LEAD_MODE_TYPE_ENUM } from "@/common/enums";

interface ManageLeadProps {
    mode: LEAD_MODE_TYPE_ENUM;
}

export const ManageLead = ({ mode }: ManageLeadProps) => {
    const router = useRouter();
    const params = useParams();
    const leadId = (params?.id as string) || "";
    const isAdd = mode === LEAD_MODE_TYPE_ENUM.ADD;

    const [lead, setLead] = useState<LeadsListType | null>(null);
    const [loading, setLoading] = useState<boolean>(!isAdd);
    const [error, setError] = useState<string | null>(null);

    const fetchLeadDetails = async () => {
        if (!leadId || isAdd) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getLeadById(leadId);
            const leadData = response.data?.data || response.data;
            if (leadData) {
                setLead(leadData);
            } else {
                setError("Lead not found");
            }
        } catch {
            console.error("Failed to load lead");
            setError("Failed to load lead details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdd || !leadId) return;

        let ignore = false;
        const loadData = async () => {
            try {
                const response = await getLeadById(leadId);
                const leadData = response.data?.data || response.data;
                if (!ignore) {
                    if (leadData) setLead(leadData);
                    else setError("Lead not found");
                }
            } catch {
                if (!ignore) setError("Failed to load lead details.");
            } finally {
                if (!ignore) setLoading(false);
            }
        };

        loadData();
        return () => {
            ignore = true;
        };
    }, [leadId, isAdd]);

    return (
        <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* back to home */}
                <div className="flex items-center gap-4">
                    <div
                        onClick={() => router.push("/")}
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
                    >
                        <span className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </span>
                        <span>Back to Home</span>
                    </div>
                </div>

                {/* loading skeleton */}
                {loading && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs space-y-6 animate-pulse">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="sm:col-span-2 h-12 bg-slate-100 rounded-xl"></div>
                            <div className="h-12 bg-slate-100 rounded-xl"></div>
                            <div className="h-12 bg-slate-100 rounded-xl"></div>
                            <div className="sm:col-span-2 h-12 bg-slate-100 rounded-xl"></div>
                        </div>
                    </div>
                )}

                {/* no data */}
                {!loading && error && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                            <UsersIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Lead Not Found</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                                {error}
                            </p>
                        </div>
                        <div className="pt-2 flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={fetchLeadDetails}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                            >
                                <RefreshIcon className="w-4 h-4" />
                                <span>Try Again</span>
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-xs"
                            >
                                Return to Home
                            </Link>
                        </div>
                    </div>
                )}

                {/* form for add, view and edit */}
                {(!loading && !error) && (
                    <LeadForm mode={mode} initialData={lead} leadId={leadId} />
                )}
            </div>
        </div>
    );
};