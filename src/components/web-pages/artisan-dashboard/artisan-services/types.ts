export interface ArtisanServiceItem {
  _id?: string;
  category: string;
  categoryName?: string;
  serviceId?: string;
  serviceName: string;
  rateType: "hourly" | "daily";
  rate: number;
  description?: string;
  catalogDescription?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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
