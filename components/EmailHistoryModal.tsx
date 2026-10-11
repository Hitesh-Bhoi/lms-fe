"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@/common/modal/Modal";
import {
  HistoryIcon,
  MailIcon,
  RefreshIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@/common/icon";
import { getLeadGmailHistory, GmailMessageRecord } from "@/libs/Apis";
import { formatDate } from "@/common/helper";

interface EmailHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
  leadEmail: string;
  onOpenCompose: () => void;
}

export const EmailHistoryModal: React.FC<EmailHistoryModalProps> = ({
  isOpen,
  onClose,
  leadId,
  leadName,
  leadEmail,
  onOpenCompose,
}) => {
  const [messages, setMessages] = useState<GmailMessageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!leadId && !leadEmail) return;
    setLoading(true);
    try {
      const res = await getLeadGmailHistory(leadId, leadEmail);
      const list = res.data?.data || [];
      setMessages(list);
      if (list.length > 0) {
        setExpandedId(list[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch email history:", err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [leadId, leadEmail]);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen, fetchHistory]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      title={`Gmail History - ${leadName}`}
      icon={<HistoryIcon className="w-5 h-5 text-blue-600" />}
    >
      <div className="p-5 sm:p-6 space-y-4">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">{leadEmail}</span>
            <span>•</span>
            <span>{messages.length} message{messages.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchHistory}
              disabled={loading}
              title="Refresh emails"
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCompose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Compose</span>
            </button>
          </div>
        </div>

        {/* Message List */}
        {loading ? (
          <div className="space-y-3 py-2">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 animate-pulse space-y-2.5"
              >
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                <div className="h-10 bg-slate-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {messages.map((msg) => {
              const isExpanded = expandedId === msg.id;
              const isSent = msg.status === "sent";

              return (
                <div
                  key={msg.id}
                  className={`rounded-xl border transition-all ${
                    isExpanded
                      ? "border-blue-200 bg-blue-50/20 shadow-xs"
                      : "border-slate-200/80 bg-white hover:border-slate-300"
                  }`}
                >
                  <div
                    onClick={() => toggleExpand(msg.id)}
                    className="p-3.5 flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                            isSent
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-sky-50 text-sky-700 border border-sky-200"
                          }`}
                        >
                          {msg.status}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-800 truncate">
                          {msg.subject}
                        </h4>
                      </div>
                      <div className="text-xs text-slate-500">
                        {msg.date ? formatDate(msg.date) : "N/A"}
                      </div>
                    </div>

                    <ChevronDownIcon
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </div>

                  {isExpanded && (
                    <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100/80 space-y-2 text-xs">
                      <div className="text-slate-500 flex items-center justify-between gap-2">
                        <span>
                          From: <strong className="text-slate-700">{msg.from || "admin@lmsportal.com"}</strong>
                        </span>
                        <span>
                          To: <strong className="text-slate-700">{msg.to}</strong>
                        </span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg text-slate-700 whitespace-pre-wrap leading-relaxed font-sans border border-slate-200/60">
                        {msg.body}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <MailIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">
                No email communications found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                No Gmail messages have been recorded for this lead yet.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCompose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Send First Email</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
