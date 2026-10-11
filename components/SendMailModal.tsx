"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/common/modal/Modal";
import { MailIcon, SendIcon, SpinnerIcon } from "@/common/icon";
import { sendGmailMail } from "@/libs/Apis";
import { ShowToastFunction } from "@/common/types";
import { TOAST_TYPE_ENUM } from "@/common/enums";
import { getApiErrorMessage, isValidTextContent } from "@/common/helper";

interface SendMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId?: string;
  leadName: string;
  leadEmail: string;
  onSuccess?: () => void;
  showToast?: ShowToastFunction;
}

export const SendMailModal: React.FC<SendMailModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
  leadEmail,
  onSuccess,
  showToast,
}) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // reset form state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubject("");
      setBody("");
      setErrors({});
      setSubmitting(false);
    }
  }, [isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject.trim() || !isValidTextContent(subject)) {
      errs.subject = "Subject is required";
    }
    if (!body.trim() || !isValidTextContent(body)) {
      errs.body = "Email message content cannot be empty";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || submitting) return;

    setSubmitting(true);
    try {
      const res = await sendGmailMail({
        to: leadEmail,
        subject: subject.trim(),
        body: body.trim(),
        leadId,
      });

      const msg = res?.data?.message || `Email sent successfully to ${leadEmail}`;
      showToast?.(msg, TOAST_TYPE_ENUM.SUCCESS);
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMessage = getApiErrorMessage(err, "Failed to send email");
      showToast?.(errMessage, TOAST_TYPE_ENUM.ERROR);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title="Send Email via Gmail"
      icon={<MailIcon className="w-5 h-5 text-blue-600" />}
    >
      <form onSubmit={handleSend} className="p-5 sm:p-6 space-y-4">
        {/* Recipient */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Recipient
          </label>
          <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-700">
            <span className="font-semibold text-slate-900">{leadName}</span>
            <span className="text-slate-400">&lt;{leadEmail}&gt;</span>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              if (errors.subject) setErrors((prev) => ({ ...prev, subject: "" }));
            }}
            placeholder="e.g. Following up on your inquiry"
            disabled={submitting}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none ${
              errors.subject
                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            }`}
          />
          {errors.subject && (
            <p className="text-xs text-rose-600 mt-1">{errors.subject}</p>
          )}
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Message
          </label>
          <textarea
            rows={5}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              if (errors.body) setErrors((prev) => ({ ...prev, body: "" }));
            }}
            placeholder="Type your message here..."
            disabled={submitting}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 transition-colors focus:outline-none resize-y ${
              errors.body
                ? "border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            }`}
          />
          {errors.body && (
            <p className="text-xs text-rose-600 mt-1">{errors.body}</p>
          )}
        </div>

        {/* Info hint */}
        <div className="flex items-center gap-2 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-700">
          <MailIcon className="w-4 h-4 shrink-0 text-blue-500" />
          <span>This email will be dispatched using your linked Gmail account.</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <SpinnerIcon className="w-4 h-4" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4" />
                <span>Send Email</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
