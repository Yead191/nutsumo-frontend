export interface IPostJobCategory {
  _id: string;
  name: string;
  slug?: string;
  image?: string;
  services?: {
    _id: string;
    name: string;
    slug?: string;
  }[];
}

export interface IPostJobService {
  _id: string;
  name: string;
  slug?: string;
  category?: any;
}

export interface PostJobWizardProps {
  categories: IPostJobCategory[];
  initialServices?: IPostJobService[];
}

export interface PostJobFormData {
  title: string;
  description: string;
  category: string;
  service: string;
  serviceName?: string;
  customServiceName: string;
  location: string;
  postCode: string;
  budget: string;
  preferredDate: string;
  images: File[];
}
