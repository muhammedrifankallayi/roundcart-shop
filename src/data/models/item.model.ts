

export interface Item {
    _id: string;
name: string;
  description: string;
  slug: string;
  categoryId: string; // ObjectId as string
  images: string[];
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  tags: string[];
  attributes: Record<string, any>;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

