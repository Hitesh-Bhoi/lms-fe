"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LeadsListType, LeadRecordPayload } from "@/common/types";
import { createLead, updateLead } from "@/libs/apis";
import { Toast } from "@/common/notification/Toast";
import { EditConfirmModal } from "./EditConfirmModal";
import {
  MailIcon,
  PhoneIcon,
  EditIcon,
  SpinnerIcon,
} from "@/common/icon";
import { emailRegx } from "@/common/helper";
import { LEAD_MODE_TYPE_ENUM, LEADS_STATUS_ENUM, TOAST_TYPE_ENUM } from "@/common/enums";

interface LeadFormProps {
  mode: LEAD_MODE_TYPE_ENUM;
  initialData?: LeadsListType | null;
  leadId?: string;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  mode,
  initialData,
  leadId,
}) => {
  const router = useRouter();
  const isView = mode === LEAD_MODE_TYPE_ENUM.VIEW;
  const isEdit = mode === LEAD_MODE_TYPE_ENUM.EDIT;
  const isAdd = mode === LEAD_MODE_TYPE_ENUM.ADD;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || LEADS_STATUS_ENUM.NEW,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: TOAST_TYPE_ENUM.SUCCESS | TOAST_TYPE_ENUM.ERROR;
  } | null>(null);

  const showToast = (
    message: string,
    type: TOAST_TYPE_ENUM.SUCCESS | TOAST_TYPE_ENUM.ERROR = TOAST_TYPE_ENUM.SUCCESS
  ) => {
    setToast({ message, type });
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegx.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // unified api execution for both add and edit
  const handleSubmitApi = async () => {
    setSubmitting(true);
    try {
      const payload: LeadRecordPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      if (isEdit && leadId) {
        await updateLead(leadId, payload);
        setIsConfirmModalOpen(false);
        router.push(`/leads/${leadId}`);
      } else {
        await createLead(payload);
        router.push("/");
      }
    } catch (error: unknown) {
      console.error(`Failed to ${isEdit ? "update" : "create"} lead:`, error);
      let msg =
        error instanceof Error
          ? error.message
          : `Failed to ${isEdit ? "update" : "create"} lead.`;
      if (typeof error === "object" && error !== null && "response" in error) {
        const responseData = (error as { response?: { data?: { message?: string } } }).response?.data;
        if (responseData?.message) msg = responseData.message;
      }
      setIsConfirmModalOpen(false);
      showToast(msg, TOAST_TYPE_ENUM.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  // submit function
  const handleFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (isView) return;

    if (!validate()) return;

    if (isEdit) {
      // edit mode: open confirmation modal first
      setIsConfirmModalOpen(true);
    } else if (isAdd) {
      // add mode: directly execute api call
      handleSubmitApi();
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* edit confirmation modal */}
      {isEdit && (
        <EditConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleSubmitApi}
          leadName={formData.name || initialData?.name || "this lead"}
          submitting={submitting}
        />
      )}

      {/* form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* full name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name {!isView && <span className="text-rose-500">*</span>}
              </label>
              <input
                type="text"
                value={formData.name}
                disabled={isView}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name)
                    setFormErrors({ ...formErrors, name: "" });
                }}
                placeholder="e.g. John Doe"
                className={`w-full px-4 py-2.5 text-sm rounded-xl transition-all ${isView
                    ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                    : formErrors.name
                      ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                      : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  }`}
              />
              {formErrors.name && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {formErrors.name}
                </p>
              )}
            </div>

            {/* email address */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address {!isView && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MailIcon className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  disabled={isView}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email)
                      setFormErrors({ ...formErrors, email: "" });
                  }}
                  placeholder="e.g. john@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${isView
                      ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                      : formErrors.email
                        ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                        : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* phone number */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number {!isView && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  disabled={isView}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone)
                      setFormErrors({ ...formErrors, phone: "" });
                  }}
                  placeholder="e.g. +91 98765 43210"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${isView
                      ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                      : formErrors.phone
                        ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                        : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    }`}
                />
              </div>
              {formErrors.phone && (
                <p className="text-xs text-rose-500 mt-1 font-medium">
                  {formErrors.phone}
                </p>
              )}
            </div>

            {/* status */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                disabled={isView}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={`w-full px-4 py-2.5 text-sm rounded-xl transition-all ${isView
                    ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                    : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  }`}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {/* action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {isEdit && (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 text-slate-800 bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-600/30 transition-all hover:shadow-blue-600/40 cursor-pointer"
                >
                  <EditIcon className="w-4 h-4" />
                  <span>Update</span>
                </button>
              </>
            )}

            {isAdd && (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/40 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <SpinnerIcon className="w-4 h-4" />}
                  <span>{submitting ? "Saving..." : "Save Lead"}</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
