import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

// 🔹 Sélecteur de base
export const selectProductsState = createFeatureSelector<ProductsState>('products');

// 🔹 Sélecteurs dérivés
export const selectProductsItems = createSelector(
  selectProductsState,
  (state) => state.items
);

export const selectProductsQuery = createSelector(
  selectProductsState,
  (state) => state.query
);

export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

export const selectProductsTotals = createSelector(
  selectProductsState,
  (state) => ({
    totalElements: state.totalElements,
    totalPages: state.totalPages
  })
);

export const selectProductsCurrentPage = createSelector(
  selectProductsQuery,
  (query) => query.page
);

export const selectProductsPageSize = createSelector(
  selectProductsQuery,
  (query) => query.size
);

