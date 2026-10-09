"use client";
import React, { useEffect, useState } from "react";
import { UserIcon, MailIcon } from "@/common/icon";
import { getAdminProfile } from "@/libs/Apis";
import { FormInput } from "@/micro-components/FormInput";

// admin user profile interface
interface AdminProfileData {
  id?: string;
  email?: string;
  role?: string;
}

export const Profile = () => {
  // admin profile state
  const [profile, setProfile] = useState<AdminProfileData | null>(null);
  // profile loading state
  const [loading, setLoading] = useState<boolean>(true);

  // fetch authenticated admin profile on mount
  useEffect(() => {
    let ignore = false;
    const loadProfile = async () => {
      try {
        const res = await getAdminProfile();
        if (!ignore && res.data?.data) {
          setProfile(res.data.data);
        }
      } catch (err: unknown) {
        console.error("failed to load admin profile:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadProfile();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl space-y-6">
        {/* profile header banner */}
        <header className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                User Profile
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Administrator account details</p>
            </div>
          </div>
        </header>

        {/* loading skeleton */}
        {loading && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6 animate-pulse">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-slate-100" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="h-12 bg-slate-100 rounded-xl" />
              <div className="h-12 bg-slate-100 rounded-xl" />
            </div>
          </div>
        )}

        {/* readonly profile card */}
        {!loading && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            {/* profile user summary */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center font-bold text-xl shadow-sm shadow-blue-500/20">
                {profile?.email ? profile.email.charAt(0).toUpperCase() : "A"}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 capitalize">
                  {profile?.role || "Administrator"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">{profile?.email || "admin@example.com"}</p>
              </div>
            </div>

            {/* readonly form inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                id="profile-email"
                label="Email Address"
                type="email"
                value={profile?.email || ""}
                disabled
                icon={<MailIcon className="w-4 h-4" />}
              />

              <FormInput
                id="profile-role"
                label="Role"
                type="text"
                value={profile?.role || "admin"}
                disabled
                icon={<UserIcon className="w-4 h-4" />}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
