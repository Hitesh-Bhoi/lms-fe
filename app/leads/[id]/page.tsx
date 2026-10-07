"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/libs/apis";
import { LeadsListType } from "@/common/types";
import { Toast } from "@/common/notification/Toast";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import { LeadForm } from "@/components/LeadForm";
import {
  ArrowLeftIcon,
  RefreshIcon,
  UsersIcon,
} from "@/common/icon";

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = (params?.id as string) || "";

  const [lead, setLead] = useState<LeadsListType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  const fetchLeadDetails = async () => {
    if (!leadId) return;
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
      console.error("Failed to fetch lead");
      setError("Failed to fetch lead details.");
      showToast("Failed to fetch lead details.", "error");
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
            setError("Lead not found");
          }
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError("Failed to fetch lead details.");
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
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* delete confirmation modal */}
      {lead && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          leadId={lead._id}
          leadName={lead.name}
          onSuccess={() => {
            router.push("/");
          }}
          showToast={showToast}
        />
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* back button */}
        <div className="flex items-center justify-between">
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
        {!loading && error && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Lead Record Not Found</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                {error || "The lead you are trying to view does not exist or may have been deleted."}
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

        {/* lead view form */}
        {!loading && lead && (
          <LeadForm mode="view" initialData={lead} leadId={lead._id} />
        )}
      </div>
    </div>
  );
}
