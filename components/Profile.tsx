"use client";
import { UserIcon } from "@/common/icon";

export const Profile = () => {
  return (
    <>
      <div className="min-h-[calc(100vh-4rem)] bg-slate-50/70 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="h-11 w-11 rounded-xl bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <UserIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  User Profile
                </h1>
              </div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};
