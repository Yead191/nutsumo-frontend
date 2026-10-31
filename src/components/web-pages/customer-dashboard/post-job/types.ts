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

export interface PostJobWizardProps {
  categories: IPostJobCategory[];
}

export interface PostJobFormData {
  title: string;
  description: string;
  category: string;
  service: string;
  customServiceName: string;
  location: string;
  postCode: string;
  budget: string;
  preferredDate: string;
  images: File[];
}
