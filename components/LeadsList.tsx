"use client";
import { formatDate } from "@/common/helper";
import { LeadRecordType, PaginationType } from "@/common/types";
import { getAllLeadsList } from "@/libs/Apis";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { Toast } from "../common/notification/Toast";
import { LEADS_STATUS_ENUM, TOAST_TYPE_ENUM } from "@/common/enums";
import { useDebounce } from "@/hooks/useDebounce";
import {
  UsersIcon,
  RefreshIcon,
  PlusIcon,
  SearchIcon,
  CloseIcon,
  ViewIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
} from "../common/icon";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { StatusDropdownFilter } from "../micro-components/StatusDropdownFilter";
import { Pagination } from "../micro-components/Pagination";

// filter state interface
export interface LeadsFilterState {
  search: string;
  status: string;
}

// default pagination state
const defaultPaginationInfo: PaginationType = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

// initial values of filter state
const defaultFilterState: LeadsFilterState = {
  search: "",
  status: "",
};

// leads status badge styling by status
const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  [LEADS_STATUS_ENUM.NEW]: {
    label: "New",
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
  },
  [LEADS_STATUS_ENUM.CONTACTED]: {
    label: "Contacted",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
  [LEADS_STATUS_ENUM.QUALIFIED]: {
    label: "Qualified",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  [LEADS_STATUS_ENUM.LOST]: {
    label: "Lost",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    dot: "bg-rose-500",
  },
};

// search and status filter with pagination support
const filterParams = (
  search: string,
  status: string,
  page: number = 1,
  limit: number = 10,
) => {
  const queryParams: {
    search?: string;
    status?: string;
    page: number;
    limit: number;
  } = {
    page,
    limit,
  };
  if (search.trim()) {
    queryParams.search = search.trim();
  }
  if (status.trim()) {
    queryParams.status = status.trim();
  }
  return queryParams;
};

export const LeadsList = () => {
  // leads list records from API
  const [leadsList, setLeadsList] = useState<LeadRecordType[]>([]);
  // loading state
  const [loading, setLoading] = useState<boolean>(true);
  // refreshing state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  // error state
  const [error, setError] = useState<string | null>(null);
  // search and status filter state
  const [filters, setFilters] = useState<LeadsFilterState>(defaultFilterState);
  // debounced search input to prevent excessive API requests
  const debouncedSearch = useDebounce<string>(filters.search, 800);
  // pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginationInfo, setPaginationInfo] =
    useState<PaginationType>(defaultPaginationInfo);

  // keep track of active request identity to discard stale responses
  const latestRequestIdRef = useRef<number>(0);
  const currentParamsRef = useRef({
    search: debouncedSearch,
    status: filters.status,
    page: currentPage,
  });

  useEffect(() => {
    currentParamsRef.current = {
      search: debouncedSearch,
      status: filters.status,
      page: currentPage,
    };
  }, [debouncedSearch, filters.status, currentPage]);

  const isCurrentRequest = (
    params: { search: string; status: string; page: number },
    requestId: number,
  ) => {
    return (
      requestId === latestRequestIdRef.current &&
      params.search === currentParamsRef.current.search &&
      params.status === currentParamsRef.current.status &&
      params.page === currentParamsRef.current.page
    );
  };

  // delete modal state
  const [deleteLeadTarget, setDeleteLeadTarget] =
    useState<LeadRecordType | null>(null);
  // toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type: TOAST_TYPE_ENUM;
  } | null>(null);
  const showToast = (
    message: string,
    type: TOAST_TYPE_ENUM = TOAST_TYPE_ENUM.SUCCESS,
  ) => {
    setToast({ message, type });
  };
  // check for applied filter
  const hasActiveFilters = Boolean(filters.search.trim() || filters.status);
  // handle search change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };
  // clear search filter
  const handleClearSearch = () => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, search: "" }));
  };
  // handle status change
  const handleStatusChange = (status: string) => {
    setCurrentPage(1);
    setFilters((prev) => ({ ...prev, status }));
  };
  // handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= paginationInfo.totalPages && newPage !== currentPage) {
      setLoading(true);
      setCurrentPage(newPage);
    }
  };

  // API call to sync ui data on search, status filter, or page changes
  useEffect(() => {
    const requestParams = {
      search: debouncedSearch,
      status: filters.status,
      page: currentPage,
    };
    const requestId = ++latestRequestIdRef.current;

    const fetchFilteredLeads = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = filterParams(
          requestParams.search,
          requestParams.status,
          requestParams.page,
          10,
        );
        const response = await getAllLeadsList(queryParams);
        if (!isCurrentRequest(requestParams, requestId)) {
          return;
        }
        setLeadsList(response.data?.data || []);
        if (response.data?.pagination) {
          setPaginationInfo(response.data.pagination);
        } else {
          setPaginationInfo(defaultPaginationInfo);
        }
        setError(null);
      } catch (err: unknown) {
        if (axios.isCancel(err) || !isCurrentRequest(requestParams, requestId)) {
          return;
        }
        console.error("Failed to fetch leads:", err);
        setLeadsList([]);
        setPaginationInfo(defaultPaginationInfo);
        setError("Failed to fetch leads from backend server");
        showToast("Failed to fetch leads", TOAST_TYPE_ENUM.ERROR);
      } finally {
        if (isCurrentRequest(requestParams, requestId)) {
          setLoading(false);
        }
      }
    };
    fetchFilteredLeads();
  }, [debouncedSearch, filters.status, currentPage]);

  // refresh handler
  const handleRefresh = async () => {
    const requestParams = {
      search: debouncedSearch,
      status: filters.status,
      page: currentPage,
    };
    const requestId = ++latestRequestIdRef.current;

    setIsRefreshing(true);
    setError(null);
    try {
      const queryParams = filterParams(
        requestParams.search,
        requestParams.status,
        requestParams.page,
        10,
      );
      const response = await getAllLeadsList(queryParams);
      if (!isCurrentRequest(requestParams, requestId)) {
        return;
      }
      setLeadsList(response.data?.data || []);
      if (response.data?.pagination) {
        setPaginationInfo(response.data.pagination);
      } else {
        setPaginationInfo(defaultPaginationInfo);
      }
      setError(null);
    } catch (err: unknown) {
      if (axios.isCancel(err) || !isCurrentRequest(requestParams, requestId)) {
        return;
      }
      console.error("Failed to refresh leads:", err);
      setLeadsList([]);
      setPaginationInfo(defaultPaginationInfo);
      setError("Failed to fetch leads from backend server");
      showToast(
        "Failed to fetch leads from backend server",
        TOAST_TYPE_ENUM.ERROR,
      );
    } finally {
      if (isCurrentRequest(requestParams, requestId)) {
        setTimeout(() => {
          setIsRefreshing(false);
          setLoading(false);
        }, 1000);
      }
    }
  };
  return (
    <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8">
      {/* toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* main container */}
      <div className="space-y-6">
        <header className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-linear-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <UsersIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Leads Management Portal
              </h1>
            </div>
          </div>
        </header>
        {/* filter section*/}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
            {/* search input */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <SearchIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search leads by name or email..."
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-800"
              />
              {filters.search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search query"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            {/* right side: status filter, refresh, and add new lead button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* refresh btn */}
              <button
                type="button"
                onClick={handleRefresh}
                disabled={loading || isRefreshing}
                title="Refresh lead list"
                className="inline-flex items-center justify-center gap-1.5 h-10 px-3.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer text-sm font-medium"
              >
                <RefreshIcon
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              {/* status filter */}
              <StatusDropdownFilter
                selectedStatus={filters.status}
                onStatusChange={handleStatusChange}
                disabled={loading}
              />
              {/* add new lead btn */}
              <Link
                href="/leads/add"
                className="inline-flex items-center justify-center gap-2 h-10 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 active:scale-98"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add New Lead</span>
              </Link>
            </div>
          </div>
        </div>
        {/* leads list table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Index
                  </th>
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
                        <div className="w-24 h-4 bg-slate-200 rounded"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-24 h-4 bg-slate-200 rounded"></div>
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
                ) : leadsList.length > 0 ? (
                  leadsList.map((lead, i) => {
                    const statusKey =
                      (lead.status?.toLowerCase() as LEADS_STATUS_ENUM) ||
                      LEADS_STATUS_ENUM.NEW;
                    const statusStyle =
                      statusConfig[statusKey] ||
                      statusConfig[LEADS_STATUS_ENUM.NEW];
                    return (
                      <tr
                        key={lead._id}
                        className="hover:bg-slate-50/80 transition-colors group cursor-default"
                      >
                        {/* index number */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {(paginationInfo.page - 1) * paginationInfo.limit + i + 1}
                        </td>
                        {/* name */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lead.name}
                        </td>
                        {/* email */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span>{lead.email}</span>
                        </td>
                        {/* phone*/}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span>{lead.phone}</span>
                        </td>
                        {/* status */}
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
                        {/* created date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {lead.created_at ? formatDate(lead.created_at) : "N/A"}
                        </td>
                        {/* updated date */}
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {lead.updated_at ? formatDate(lead.updated_at) : "N/A"}
                        </td>
                        {/* actions buttons */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* view lead */}
                            <Link
                              href={`/leads/${lead._id}`}
                              title="View Lead Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors inline-flex items-center justify-center"
                            >
                              <ViewIcon className="w-5 h-5" />
                            </Link>
                            {/* edit lead */}
                            <Link
                              href={`/leads/${lead._id}/edit`}
                              title="Edit Lead Details"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors inline-flex items-center justify-center"
                            >
                              <EditIcon className="w-5 h-5" />
                            </Link>
                            {/* delete lead */}
                            <button
                              type="button"
                              onClick={() => setDeleteLeadTarget(lead)}
                              title="Delete Lead"
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : error ? (
                  /* error UI */
                  <tr>
                    <td colSpan={8} className="px-6 py-14 text-center">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
                          <CloseIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-semibold text-slate-800">
                          Failed to load leads
                        </h3>
                        <p className="text-sm text-slate-500">
                          {error}
                        </p>
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={handleRefresh}
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm font-medium transition-colors shadow-xs cursor-pointer"
                          >
                            <RefreshIcon
                              className={`w-4 h-4 ${
                                isRefreshing ? "animate-spin" : ""
                              }`}
                            />
                            <span>Retry</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* no data UI */
                  <tr>
                    <td colSpan={8} className="px-6 py-14 text-center">
                      <div className="max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                          {hasActiveFilters ? (
                            <FilterIcon className="w-6 h-6 text-indigo-500" />
                          ) : (
                            <SearchIcon className="w-6 h-6" />
                          )}
                        </div>
                        <h3 className="text-base font-semibold text-slate-800">
                          No leads found matching your filters
                        </h3>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* pagination bar */}
          <Pagination
            page={paginationInfo.page}
            totalPages={paginationInfo.totalPages}
            total={paginationInfo.total}
            limit={paginationInfo.limit}
            hasNextPage={paginationInfo.hasNextPage}
            hasPrevPage={paginationInfo.hasPrevPage}
            onPageChange={handlePageChange}
            disabled={loading || Boolean(error)}
          />
        </div>
      </div>
      {/* delete lead confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteLeadTarget}
        onClose={() => setDeleteLeadTarget(null)}
        leadId={deleteLeadTarget?._id || ""}
        leadName={deleteLeadTarget?.name || ""}
        onSuccess={handleRefresh}
        showToast={showToast}
      />
    </div>
  );
};
