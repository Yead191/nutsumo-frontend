export type PortfolioImageType = "before" | "after" | "work";

export interface PortfolioImage {
  url: string;
  type: PortfolioImageType;
}

export interface PortfolioCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
}

export interface PortfolioArtisan {
  _id: string;
  name: string;
  email?: string;
  image?: string;
  phone?: string;
  trade?: string;
  businessName?: string;
  location?: string;
}

export interface PortfolioItem {
  _id?: string;
  artisan?: string | PortfolioArtisan;
  title: string;
  description: string;
  category: string | PortfolioCategory;
  images: PortfolioImage[];
  completedAt?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ImageUploadItem {
  id: string;
  file?: File;
  previewUrl: string;
  type: PortfolioImageType;
  isExisting: boolean;
}

export interface PortfolioFormState {
  title: string;
  description: string;
  category: string;
  completedAt: string;
  isPublished: boolean;
}

export interface ArtisanPortfolioManagerProps {
  initialPortfolio?: PortfolioItem[];
  categories?: PortfolioCategory[];
}
