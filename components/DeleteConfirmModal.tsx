"use client";

import React, { useState } from "react";
import { deleteLead } from "@/libs/Apis";
import { Modal } from "@/common/modal/Modal";
import { SpinnerIcon, WarningIcon } from "@/common/icon";
import { TOAST_TYPE_ENUM } from "@/common/enums";

// delete confirmation modal props interface
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  leadId: string;
  leadName: string;
  showToast?: (message: string, type?: TOAST_TYPE_ENUM) => void;
}

// modal dialog to confirm lead deletion
export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  leadId,
  leadName,
  showToast,
}) => {
  // submitting state during deletion api call
  const [submitting, setSubmitting] = useState(false);

  // handle lead deletion api submission
  const handleConfirm = async () => {
    if (submitting || !leadId) return;
    setSubmitting(true);
    try {
      const res = await deleteLead(leadId);
      showToast?.(res?.data?.message || "Lead deleted successfully!", TOAST_TYPE_ENUM.SUCCESS);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const msg = error instanceof Error ? error?.message : "Failed to delete lead.";
      showToast?.(msg, TOAST_TYPE_ENUM.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" ariaLabel="Delete Lead?">
      <div className="p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <WarningIcon className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900">Delete Lead?</h3>
          <p className="text-xs text-slate-500">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-slate-800">&quot;{leadName}&quot;</span>?
            This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-1/2 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="w-1/2 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
          >
            {submitting && <SpinnerIcon className="w-4 h-4" />}
            {submitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
