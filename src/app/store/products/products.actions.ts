import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product.model';
import { ProductsQuery, ProductsError } from './products.state';

// 🔹 Modifier la query
export const setQuery = createAction(
  '[Products] Set Query',
  props<{ partialQuery: Partial<ProductsQuery> }>()
);

// 🔹 Charger les produits
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ query: ProductsQuery }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{
    items: Product[];
    totalElements: number;
    totalPages: number;
  }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: ProductsError }>()
);

// 🔹 Réinitialiser la query
export const resetQuery = createAction('[Products] Reset Query');

// 🔹 Réinitialiser l'erreur
export const clearError = createAction('[Products] Clear Error');

