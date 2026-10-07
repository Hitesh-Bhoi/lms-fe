import { LEAD_MODE_TYPE_ENUM } from "@/common/enums";
import { ManageLead } from "@/components/ManageLead";
export default function page() {
  return <ManageLead mode={LEAD_MODE_TYPE_ENUM.ADD} />
}
