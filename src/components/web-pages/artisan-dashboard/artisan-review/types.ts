import type { IReviewItem } from "@/helpers/next-fetch/apiActions/reviewActions";

export type FilterType =
  | "all"
  | "needs-reply"
  | "replied"
  | "5-star"
  | "4-star"
  | "3-star"
  | "2-star"
  | "1-star";

export interface ReviewStats {
  avg: number;
  total: number;
  repliedCount: number;
  needsReplyCount: number;
}

export interface RatingBreakdownItem {
  star: number;
  count: number;
  percentage: number;
  filterKey: FilterType;
}

export interface ArtisanUserProfile {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  businessName?: string;
  role?: string;
  phone?: string;
  trade?: string;
  location?: string;
  slug?: string;
}

export interface ArtisanReviewViewProps {
  initialReviews: IReviewItem[];
  profile: ArtisanUserProfile | null;
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPage?: number;
  };
}
