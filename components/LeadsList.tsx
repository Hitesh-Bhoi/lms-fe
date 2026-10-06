"use client";
import { formatDate } from "@/common/helper";
import { LeadsListType } from "@/common/types";
import { getAllLeadsList } from "@/libs/apis"
import { useEffect, useState } from "react"

export const LeadsList = () => {
    const [leadsList, setLeadList] = useState<LeadsListType[]>([]);

    const getAllLeads = async () => {
        try {
            const { data } = await getAllLeadsList();
            setLeadList(data?.data);
        } catch (error) {
            console.log(error)
        }
    };
    useEffect(() => {
        getAllLeads();
    }, []);
    return (
        <>
            <div className="header-container flex justify-end items-center gap-2 pb-2">
                <div className="relative">
                    <div className="absolute inset-y-0 inset-s-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-body" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                    </div>
                    <input type="search" id="search" className="block w-full p-3 ps-9 border border-slate-300 border-default-medium text-heading text-sm rounded-xl shadow-xs placeholder:text-body" placeholder="Search" required />
                    <button type="button" className="absolute inset-e-1.5 bottom-1.5 text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded text-xs px-3 py-1.5 focus:outline-none">Search</button>
                </div>
                <button className=" text-black bg-white border border-slate-300 py-2 px-4 rounded-xl hover:bg-slate-100">Add new</button>
            </div>
            <div className="overflow-x-auto bg-neutral-primary-soft shadow-xs rounded-2xl border border-default border-gray-400">
                <table className="w-full text-sm text-left rtl:text-right text-body">
                    <thead className="text-sm text-body bg-slate-200 border-b border-default-medium border-gray-400">
                        <tr className="font-bold">
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Lead Name
                            </th>
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Lead Email
                            </th>
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Lead Status
                            </th>
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Updated At
                            </th>
                            <th scope="col" className="px-6 py-3 border-r-2 border-gray-300 hover:bg-gray-100">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            leadsList?.map((lead, i) => {
                                return (
                                    <tr className="bg-neutral-primary-soft border-b  border-default border-gray-400 hover:bg-gray-100" key={lead?._id}>
                                        <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap  border-r-2 border-gray-300">
                                            {lead?.name}
                                        </th>
                                        <td className="px-6 py-4 border-r-2 border-gray-300">
                                            {lead?.email}
                                        </td>
                                        <td className="px-6 py-4 border-r-2 border-gray-300">
                                            {lead?.status}
                                        </td>
                                        <td className="px-6 py-4 border-r-2 border-gray-300">
                                            {formatDate(lead?.created_at)}
                                        </td>
                                        <td className="px-6 py-4 border-r-2 border-gray-300">
                                            {formatDate(lead?.updated_at)}
                                        </td>
                                        <td className="px-6 py-4 flex items-center gap-2">
                                            <button className="text-white bg-blue-400 py-2 px-4 rounded-xl hover:bg-blue-300">Edit</button>
                                            <button className="text-white bg-red-400 py-2 px-4 rounded-xl hover:bg-red-300">Delete</button>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}