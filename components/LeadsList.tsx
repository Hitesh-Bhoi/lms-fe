"use client";

import { formatDate } from "@/common/helper";
import { LeadsListType } from "@/common/types";
import { getAllLeadsList } from "@/libs/apis";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Toast } from "../common/notification/Toast";
import {
  UsersIcon,
  RefreshIcon,
  PlusIcon,
  SearchIcon,
  CloseIcon,
  MailIcon,
  PhoneIcon,
  ViewIcon,
  EditIcon,
  TrashIcon,
} from "../common/icon";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

// leads status style tag by status
const statusConfig: Record<
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

export const LeadsList = () => {
  const router = useRouter();

  // leads state for storing leads api data
  const [leadsList, setLeadsList] = useState<LeadsListType[]>([]);
  // loading state for displaying loading
  const [loading, setLoading] = useState<boolean>(true);
  // search state for search functionality
  const [searchTerm, setSearchTerm] = useState<string>("");

  // delete modal state
  const [deleteLeadTarget, setDeleteLeadTarget] =
    useState<LeadsListType | null>(null);

  // toast state for displaying toast
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


  // get all lead records
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await getAllLeadsList();
      setLeadsList(response.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      showToast("Failed to fetch leads from backend server", "error");
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchLeads();
  }, []);

  // filter leads by search term
  const filteredLeads = useMemo(() => {
    if (!searchTerm.trim()) return leadsList;
    const term = searchTerm.toLowerCase();
    return leadsList.filter((lead) => {
      return (
        lead.name?.toLowerCase().includes(term) ||
        lead.email?.toLowerCase().includes(term) ||
        (lead.phone && lead.phone.includes(term))
      );
    });
  }, [leadsList, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      {/* toast notification component */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* main container */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* top header */}
        <header className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-linear-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Leads Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Track, qualify, and organize prospective client leads
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {/* refresh btn for table list */}
            <button
              onClick={fetchLeads}
              disabled={loading}
              title="Refresh lead list"
              className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer text-sm font-medium"
            >
              <RefreshIcon
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            {/* add new lead btn */}
            <Link
              href="/leads/add"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 active:scale-98"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add New Lead</span>
            </Link>
          </div>
        </header>

        {/* searchbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-slate-400 text-slate-800"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* leads table card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                Leads List
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                {filteredLeads.length}{" "}
                {filteredLeads.length === 1 ? "lead" : "leads"}
              </span>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
              >
                Clear search
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Lead Name
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Contact Email
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Phone Number
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="space-y-1.5">
                          <div className="w-24 h-4 bg-slate-200 rounded"></div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-28 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-28 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="w-16 h-8 bg-slate-200 rounded-lg ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const statusKey = lead.status?.toLowerCase() || "new";
                    const statusStyle =
                      statusConfig[statusKey] || statusConfig.new;

                    return (
                      <tr
                        key={lead._id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-default"
                      >
                        {/* lead name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <Link
                              href={`/leads/${lead._id}`}
                              className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors hover:underline"
                            >
                              {lead.name}
                            </Link>
                          </div>
                        </td>

                        {/* lead email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`mailto:${lead.email}`}
                            className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                          >
                            <MailIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.email}</span>
                          </a>
                        </td>

                        {/* lead phone */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.phone ? (
                            <a
                              href={`tel:${lead.phone}`}
                              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                            >
                              <PhoneIcon className="w-3.5 h-3.5 text-slate-400" />
                              <span>{lead.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic text-xs">
                              Not specified
                            </span>
                          )}
                        </td>

                        {/* lead status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}
                            ></span>
                            {statusStyle.label}
                          </span>
                        </td>

                        {/* lead created date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDate(lead.created_at || "")}
                        </td>

                        {/* lead updated date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {formatDate(lead.updated_at || "")}
                        </td>

                        {/* lead actions button */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* view page link */}
                            <Link
                              href={`/leads/${lead._id}`}
                              title="View Lead Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors inline-flex items-center justify-center"
                            >
                              <ViewIcon className="w-4 h-4" />
                            </Link>

                            {/* edit page link */}
                            <Link
                              href={`/leads/${lead._id}/edit`}
                              title="Edit Lead Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                            >
                              <EditIcon className="w-4 h-4" />
                            </Link>

                            {/* delete modal trigger */}
                            <button
                              onClick={() => setDeleteLeadTarget(lead)}
                              title="Delete Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                          <SearchIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          No matching leads found
                        </h3>
                        <p className="text-xs text-slate-500">
                          {searchTerm
                            ? "Try adjusting your search query to locate records."
                            : "No leads currently in your pipeline. Get started by adding a new lead."}
                        </p>
                        {searchTerm ? (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            Reset search
                          </button>
                        ) : (
                          <button
                            onClick={() => router.push("/leads/add")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
                          >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>Create First Lead</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* delete lead confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteLeadTarget}
        onClose={() => setDeleteLeadTarget(null)}
        leadId={deleteLeadTarget?._id || ""}
        leadName={deleteLeadTarget?.name || ""}
        onSuccess={fetchLeads}
        showToast={showToast}
      />
    </div>
  );
};
