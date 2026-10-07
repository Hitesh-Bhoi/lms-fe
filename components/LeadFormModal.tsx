"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../common/modal/Modal";
import { LeadsListType } from "@/common/types";
import { EditIcon, UserAddIcon, SpinnerIcon } from "../common/icon";
import { createLead, updateLead } from "@/libs/apis";

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: LeadsListType | null;
  isEdit?: boolean;
  showToast?: (message: string, type?: "success" | "error") => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  isEdit = false,
  showToast,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: "new",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        status: initialData.status || "new",
      });
    } else {
      setFormData({ name: "", email: "", phone: "", status: "new" });
    }
    setFormErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Lead name is required";
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (isEdit && initialData?._id) {
        await updateLead(initialData._id, formData);
        showToast?.("Lead updated successfully!", "success");
      } else {
        await createLead(formData);
        showToast?.("Lead created successfully!", "success");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        (isEdit ? "Failed to update lead." : "Failed to create lead.");
      showToast?.(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Lead" : "Add New Lead"}
      icon={
        isEdit ? (
          <EditIcon className="w-5 h-5 text-blue-600" />
        ) : (
          <UserAddIcon className="w-5 h-5 text-indigo-600" />
        )
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. John Doe"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.name
              ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
              : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
          />
          {formErrors.name && (
            <p className="text-xs text-rose-500 mt-1">{formErrors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="e.g. john@example.com"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.email
              ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
              : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
          />
          {formErrors.email && (
            <p className="text-xs text-rose-500 mt-1">{formErrors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="e.g. 9876543210"
            className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 transition-all ${formErrors.phone
              ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500"
              : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"
              }`}
          />
          {formErrors.phone && (
            <p className="text-xs text-rose-500 mt-1">{formErrors.phone}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl shadow-xs transition-colors disabled:opacity-50 ${isEdit
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-indigo-600 hover:bg-indigo-700"
              }`}
          >
            {submitting && <SpinnerIcon className="w-4 h-4" />}
            {isEdit ? "Save Changes" : "Save Lead"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
