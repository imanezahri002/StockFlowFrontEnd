import { Product } from '../../models/product.model';

export interface ProductsQuery {
  page: number;
  size: number;
  sort?: string;
  search?: string;
  category?: string;
  active: boolean;
}

export interface ProductsError {
  status: number;
  message: string;
  detail?: string;
  timestamp?: string;
  path?: string;
}

export interface ProductsState {
  query: ProductsQuery;
  items: Product[];
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: ProductsError | null;
}

export const initialProductsState: ProductsState = {
  query: {
    page: 0,
    size: 10,
    sort: 'name,asc',
    search: '',
    category: '',
    active: true
  },
  items: [],
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null
};

