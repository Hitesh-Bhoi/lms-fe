"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LeadRecordType, NoteRecordType, ToastInfoType, ShowToastFunction } from "@/common/types";
import { createLead, updateLead, createLeadNote, getLeadNotes } from "@/libs/Apis";
import { Toast } from "@/common/notification/Toast";
import { EditConfirmModal } from "./EditConfirmModal";
import {
  MailIcon,
  PhoneIcon,
  EditIcon,
  SpinnerIcon,
  PlusIcon,
  CloseIcon,
} from "@/common/icon";
import { emailRegx, formatDate, isValidTextContent } from "@/common/helper";
import { LEAD_MODE_TYPE_ENUM, LEADS_STATUS_ENUM, TOAST_TYPE_ENUM } from "@/common/enums";

// lead form props interface
interface LeadFormProps {
  mode: LEAD_MODE_TYPE_ENUM;
  initialData?: LeadRecordType | null;
  leadId?: string;
}

// reusable lead form component for create, edit, and view modes
export const LeadForm: React.FC<LeadFormProps> = ({
  mode,
  initialData,
  leadId,
}) => {
  // router instance for navigation
  const router = useRouter();
  // check current mode of the form
  const isView = mode === LEAD_MODE_TYPE_ENUM.VIEW;
  const isEdit = mode === LEAD_MODE_TYPE_ENUM.EDIT;
  const isAdd = mode === LEAD_MODE_TYPE_ENUM.ADD;

  // used to store form data
  const [formData, setFormData] = useState<LeadRecordType>({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    status: initialData?.status || LEADS_STATUS_ENUM.NEW,
  });
  // used to store lead notes fetched by api
  const [existingNotes, setExistingNotes] = useState<NoteRecordType[]>([]);
  // used to store new notes added by user before submitting
  const [currentNote, setCurrentNote] = useState<string>("");
  // used to store notes that are staged for submission
  const [stagedNotes, setStagedNotes] = useState<string[]>([]);
  // used to store validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  // used to store loading state
  const [submitting, setSubmitting] = useState(false);
  // used to store lead notes loading state
  const [notesLoading, setNotesLoading] = useState<boolean>(!isAdd && Boolean(leadId));
  // used to store confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  // used to store toast state
  const [toast, setToast] = useState<ToastInfoType | null>(null);


  // fetch notes data
  useEffect(() => {
    let ignore = false;
    const getLeadNoteRecords = async () => {
      if (isAdd || !leadId) return;
      try {
        const res = await getLeadNotes(leadId);
        if (!ignore) {
          setExistingNotes(res.data?.data || []);
        }
      } catch {
        if (!ignore) {
          setExistingNotes([]);
        }
      } finally {
        if (!ignore) {
          setNotesLoading(false);
        }
      }
    };

    getLeadNoteRecords();
    return () => {
      ignore = true;
    };
  }, [isAdd, leadId]);
  // sort notes
  const sortedExistingNotes = useMemo(() => {
    return [...existingNotes].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  }, [existingNotes]);

  // save notes into local state
  const handleAddNote = () => {
    if (!isValidTextContent(currentNote)) {
      setFormErrors((prev) => ({
        ...prev,
        note: "Note content cannot be empty",
      }));
      return;
    }
    setStagedNotes((prev) => [...prev, currentNote.trim()]);
    setCurrentNote("");
    if (formErrors.note) {
      setFormErrors((prev) => ({ ...prev, note: "" }));
    }
  };

  // remove note from state before update
  const handleRemoveNote = (index: number) => {
    setStagedNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const showToast: ShowToastFunction = (
    message: string,
    type: TOAST_TYPE_ENUM = TOAST_TYPE_ENUM.SUCCESS
  ) => {
    setToast({ message, type });
  };

  // form validator
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim() || !isValidTextContent(formData.name)) {
      errors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegx.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim() || !isValidTextContent(formData.phone)) {
      errors.phone = "Phone number is required";
    }
    if (currentNote.length > 0 && !isValidTextContent(currentNote)) {
      errors.note = "Note content cannot be empty";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // api handle for both add and edit
  const handleSubmitApi = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const payload: LeadRecordType = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        status: formData.status,
      };

      let targetLeadId = leadId;
      let leadActionMessage = "";

      if (isEdit && leadId) {
        const changedFields: Partial<LeadRecordType> = {};
        if (formData.name.trim() !== (initialData?.name || "").trim()) {
          changedFields.name = formData.name.trim();
        }
        if (formData.email.trim() !== (initialData?.email || "").trim()) {
          changedFields.email = formData.email.trim();
        }
        if (formData.phone.trim() !== (initialData?.phone || "").trim()) {
          changedFields.phone = formData.phone.trim();
        }
        if (formData.status !== initialData?.status) {
          changedFields.status = formData.status;
        }

        const hasFieldChanges = Object.keys(changedFields).length > 0;
        const hasValidActiveNote = isValidTextContent(currentNote);
        const hasNewNotes = stagedNotes.length > 0 || hasValidActiveNote;

        if (!hasFieldChanges && !hasNewNotes) {
          setIsConfirmModalOpen(false);
          showToast("No changes detected", TOAST_TYPE_ENUM.SUCCESS);
          setTimeout(() => router.push(`/`), 1500);
          return;
        }

        if (hasFieldChanges) {
          const res = await updateLead(leadId, changedFields);
          leadActionMessage = res?.data?.message || "Lead updated successfully";
        } else {
          leadActionMessage = "Lead notes updated successfully";
        }
        setIsConfirmModalOpen(false);
      } else {
        const res = await createLead(payload);
        const createdLead = res?.data?.data;
        targetLeadId = createdLead?._id;
        leadActionMessage = res?.data?.message || "Lead created successfully";
      }

      // save all notes staged notes + active text in textarea
      const notesToSave = [
        ...stagedNotes,
        ...(isValidTextContent(currentNote) ? [currentNote.trim()] : []),
      ];

      if (targetLeadId && notesToSave.length > 0) {
        try {
          await Promise.all(
            notesToSave.map((noteContent) =>
              createLeadNote(targetLeadId, { content: noteContent })
            )
          );
          showToast(
            isEdit
              ? "Lead and new notes updated successfully"
              : notesToSave.length > 1
                ? "Lead and notes created successfully"
                : "Lead and note created successfully",
            TOAST_TYPE_ENUM.SUCCESS
          );
        } catch (noteError) {
          console.error("Failed to save notes for lead:", noteError);
          showToast(
            isEdit
              ? "Lead updated, but failed to save new notes"
              : "Lead created, but failed to save notes",
            TOAST_TYPE_ENUM.ERROR
          );
        }
      } else {
        showToast(leadActionMessage, TOAST_TYPE_ENUM.SUCCESS);
      }
      setTimeout(() => router.push(`/`), 1500);
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error)
        ? error.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} lead.`
        : error instanceof Error
          ? error.message
          : `Failed to ${isEdit ? "update" : "create"} lead.`;
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
              <label htmlFor="lead-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Full Name {!isView && <span className="text-rose-500">*</span>}
              </label>
              <input
                id="lead-name"
                type="text"
                value={formData.name}
                disabled={isView}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formErrors.name)
                    setFormErrors({ ...formErrors, name: "" });
                }}
                placeholder="Enter your name"
                className={`w-full px-4 py-2.5 text-sm rounded-xl transition-all ${isView
                  ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                  : formErrors.name
                    ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                    : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              <label htmlFor="lead-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Email Address {!isView && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MailIcon className="w-4 h-4" />
                </div>
                <input
                  id="lead-email"
                  type="email"
                  value={formData.email}
                  disabled={isView}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email)
                      setFormErrors({ ...formErrors, email: "" });
                  }}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${isView
                    ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                    : formErrors.email
                      ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                      : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              <label htmlFor="lead-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Phone Number {!isView && <span className="text-rose-500">*</span>}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <input
                  id="lead-phone"
                  type="tel"
                  value={formData.phone}
                  disabled={isView}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone)
                      setFormErrors({ ...formErrors, phone: "" });
                  }}
                  placeholder="Enter your phone"
                  className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl transition-all ${isView
                    ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                    : formErrors.phone
                      ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                      : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
              <label htmlFor="lead-status" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Status
              </label>
              <select
                id="lead-status"
                value={formData.status}
                disabled={isView}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={`w-full px-4 py-2.5 text-sm rounded-xl transition-all ${isView
                  ? "bg-slate-100/70 border border-slate-200 text-slate-800 cursor-not-allowed select-text"
                  : "bg-slate-50/70 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                  }`}
              >
                <option value={LEADS_STATUS_ENUM.NEW}>New</option>
                <option value={LEADS_STATUS_ENUM.CONTACTED}>Contacted</option>
                <option value={LEADS_STATUS_ENUM.QUALIFIED}>Qualified</option>
                <option value={LEADS_STATUS_ENUM.LOST}>Lost</option>
              </select>
            </div>

            {/* notes section */}
            <div className="sm:col-span-2 pt-1">
              <div className="rounded-2xl border border-slate-200/90 bg-slate-50/50 p-4 ">
                {/* note textarea input */}
                <div className="space-y-2">
                  {!isView && (
                    <div className="relative">
                      <textarea
                        id="lead-notes"
                        rows={3}
                        value={currentNote}
                        disabled={isView || submitting}
                        onChange={(e) => {
                          setCurrentNote(e.target.value);
                          if (formErrors.note && isValidTextContent(e.target.value)) {
                            setFormErrors((prev) => ({ ...prev, note: "" }));
                          }
                        }}
                        placeholder="Write note here..."
                        className={`w-full px-3.5 py-2.5 text-sm rounded-xl transition-all placeholder:text-slate-400 text-slate-800 resize-y min-h-20 ${
                          formErrors.note
                            ? "border border-rose-300 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/20"
                            : "bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        }`}
                      />
                      {formErrors.note && (
                        <p className="text-xs text-rose-500 mt-1 font-medium">
                          {formErrors.note}
                        </p>
                      )}
                    </div>
                  )}

                  {!isView && (
                    <div className="flex items-center justify-end pb-4">
                      <button
                        type="button"
                        onClick={handleAddNote}
                        disabled={submitting}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                      >
                        <PlusIcon className="w-4 h-4" />
                        <span className="text-md">Add Note</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* notes loading skeleton */}
                {notesLoading && (
                  <div className={`${isView ? 'p-0' : 'pt-2 space-y-2.5 border-t border-slate-200/60'}`}>
                    <div className="flex items-center justify-between">
                      <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      {Array.from({ length: 2 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs animate-pulse"
                        >
                          <div className="w-5 h-5 rounded-full bg-slate-200 shrink-0 mt-0.5"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                            <div className="h-2.5 bg-slate-100 rounded w-1/2"></div>
                            <div className="h-2 bg-slate-100 rounded w-20 mt-1"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* existing saved notes list (edit and view modes) */}
                {!notesLoading && sortedExistingNotes.length > 0 && (
                  <div className={`${isView ? 'p-0' : 'pt-2 space-y-2 border-t border-slate-200/60'}`}>
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span className="font-semibold">LEAD NOTES</span>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {sortedExistingNotes.map((note, idx) => (
                        <div
                          key={note._id || idx}
                          className="group flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs text-slate-700 hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
                              {idx + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="whitespace-pre-wrap wrap-break-words text-slate-800 leading-relaxed">
                                {note.content}
                              </p>
                              {note.created_at && (
                                <span className="inline-block mt-1 text-[10px] font-medium text-slate-400">
                                  {formatDate(note.created_at)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* staged notes list (new notes to be saved) */}
                {stagedNotes.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>Notes to be saved ({stagedNotes.length})</span>
                    </div>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {stagedNotes.map((noteText, idx) => (
                        <div
                          key={idx}
                          className="group flex items-start justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs text-slate-700 hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-semibold">
                              {sortedExistingNotes.length + idx + 1}
                            </span>
                            <p className="whitespace-pre-wrap wrap-break-words flex-1 text-slate-800 leading-relaxed">
                              {noteText}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveNote(idx)}
                            disabled={submitting}
                            title="Remove note"
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                          >
                            <CloseIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            {isEdit && (
              <>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-5 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 rounded-xl transition-colors cursor-pointer"
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
                  className="px-5 py-2.5 text-sm font-medium text-slate-800 bg-slate-100 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-500/25 transition-all hover:shadow-blue-500/35 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <SpinnerIcon className="w-4 h-4" />}
                  <span>{submitting ? "Saving..." : "Save"}</span>
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
