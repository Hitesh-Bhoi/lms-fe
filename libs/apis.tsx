import axios from "axios"

export const getAllLeadsList = async()=>{
    return await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/leads`);
};