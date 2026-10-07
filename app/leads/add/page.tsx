"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@/common/icon";
import { LeadForm } from "@/components/LeadForm";

export default function AddLeadPage() {
  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* back to home */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors group"
          >
            <span className="p-1.5 rounded-lg bg-white border border-slate-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
            </span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* add lead form */}
        <LeadForm mode="add" />
      </div>
    </div>
  );
}
