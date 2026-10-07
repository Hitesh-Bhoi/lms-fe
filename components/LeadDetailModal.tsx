"use client";

import React from "react";
import { Modal } from "../common/modal/Modal";
import { formatDate } from "@/common/helper";
import { LeadsListType } from "@/common/types";

interface LeadDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadsListType | null;
  onEdit: (lead: LeadsListType) => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  new: {
    label: "New",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  qualified: {
    label: "Qualified",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  lost: {
    label: "Lost",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  isOpen,
  onClose,
  lead,
  onEdit,
}) => {
  if (!lead) return null;

  const statusKey = lead.status?.toLowerCase() || "new";
  const conf = STATUS_CONFIG[statusKey] || STATUS_CONFIG.new;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lead.name}
      maxWidth="max-w-lg"
    >
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Email Address
            </span>
            <a
              href={`mailto:${lead.email}`}
              className="block text-xs sm:text-sm font-medium text-indigo-600 hover:underline break-all"
            >
              {lead.email}
            </a>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Phone Number
            </span>
            <div className="text-xs sm:text-sm font-medium text-slate-800">
              {lead.phone || "Not specified"}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Lead Status
            </span>
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${conf.bg} ${conf.text} ${conf.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${conf.dot}`}></span>
                {conf.label}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] font-semibold uppercase text-slate-400">
              Created At
            </span>
            <div className="text-xs font-medium text-slate-700">
              {formatDate(lead.created_at || "")}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Last Updated: {formatDate(lead.updated_at || "")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(lead)}
              className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Edit Record
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
