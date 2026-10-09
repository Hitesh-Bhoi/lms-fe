"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, HomeIcon } from "@/common/icon";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50/70 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full text-center space-y-2">
        {/* heading & description */}
        <h4 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          404 <br />
          Page Not Found
        </h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
          The page you are looking for doesn&apos;t exist, may
          have been deleted, or the URL might be incorrect.
        </p>

        {/* footer buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 font-medium text-sm transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm rounded-xl shadow-sm shadow-blue-500/25 transition-all hover:shadow-blue-500/35 cursor-pointer"
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
