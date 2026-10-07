"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/libs/apis";
import { LeadsListType } from "@/common/types";
import { LeadForm } from "@/components/LeadForm";
import {
  ArrowLeftIcon,
  UsersIcon,
  RefreshIcon,
} from "@/common/icon";

export default function EditLeadPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = (params?.id as string) || "";

  const [lead, setLead] = useState<LeadsListType | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchLeadDetails = async () => {
    if (!leadId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const response = await getLeadById(leadId);
      const leadData = response.data?.data || response.data;
      if (leadData) {
        setLead(leadData);
      } else {
        setLoadError("Lead not found");
      }
    } catch {
      console.error("Failed to load lead");
      setLoadError("Failed to load lead details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadData = async () => {
      if (!leadId) return;
      try {
        const response = await getLeadById(leadId);
        const leadData = response.data?.data || response.data;
        if (!ignore) {
          if (leadData) {
            setLead(leadData);
          } else {
            setLoadError("Lead not found");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setLoadError("Failed to load lead details.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadData();
    return () => {
      ignore = true;
    };
  }, [leadId]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* back to home */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <span className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
            </span>
            <span>Back to Home</span>
          </div>
        </div>

        {/* loading */}
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
        {!loading && loadError && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Lead Not Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {loadError || "Could not find the lead you are attempting to edit."}
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

        {/* lead edit form */}
        {!loading && !loadError && lead && (
          <LeadForm mode="edit" initialData={lead} leadId={leadId} />
        )}
      </div>
    </div>
  );
}
