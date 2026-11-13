export interface ArtisanServiceItem {
  _id?: string;
  category: string;
  categoryName?: string;
  serviceId?: string;
  serviceName: string;
  source?: "CATALOG" | "CUSTOM";
  reviewStatus?: "APPROVED" | "PENDING_REVIEW" | "REJECTED";
  rateType: "hourly" | "daily";
  rate: number;
  description?: string;
  catalogDescription?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type AddServiceInput =
  | {
      mode: "catalog";
      selectedService: CatalogServiceItem;
      rateAmount: number;
      rateType: "hourly" | "daily";
      description: string;
    }
  | {
      mode: "custom";
      categoryId?: string;
      categoryName?: string;
      proposedCategory?: string;
      customName: string;
      rateAmount: number;
      rateType: "hourly" | "daily";
      description: string;
    };

export interface CatalogServiceItem {
  _id: string;
  name: string;
  slug: string;
  category:
    | {
        _id: string;
        name: string;
        slug: string;
      }
    | string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface ArtisanServicesManagerProps {
  initialServices?: ArtisanServiceItem[];
}
