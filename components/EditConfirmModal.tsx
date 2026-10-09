"use client";

import React from "react";
import { Modal } from "@/common/modal/Modal";
import { SpinnerIcon, EditIcon } from "@/common/icon";

// edit confirmation modal props interface
interface EditConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  submitting?: boolean;
}

export const EditConfirmModal: React.FC<EditConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  submitting = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" ariaLabel="Confirm Changes?">
      <div className="p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <EditIcon className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-900">Confirm Changes?</h3>
          <p className="text-xs text-slate-500">
            Are you sure you want to save the changes for{" "}
            <span className="font-semibold text-slate-800">&quot;{leadName}&quot;</span>?
          </p>
        </div>
        <div className="flex items-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="w-1/2 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={submitting}
            className="w-1/2 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {submitting && <SpinnerIcon className="w-4 h-4" />}
            {submitting ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
