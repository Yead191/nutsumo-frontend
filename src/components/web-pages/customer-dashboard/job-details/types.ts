import type { IJobItem } from "@/helpers/next-fetch/apiActions/jobActions";
import type { IQuotationItem } from "@/helpers/next-fetch/apiActions/quotationActions";

export interface JobDetailsManagerProps {
  job: IJobItem;
  quotations: IQuotationItem[];
}
