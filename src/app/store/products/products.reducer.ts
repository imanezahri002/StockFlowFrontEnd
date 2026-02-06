import { createReducer, on } from '@ngrx/store';
import { initialProductsState } from './products.state';
import * as ProductsActions from './products.actions';

export const productsReducer = createReducer(
  initialProductsState,

  // 🔹 Modifier la query
  on(ProductsActions.setQuery, (state, { partialQuery }) => ({
    ...state,
    query: {
      ...state.query,
      ...partialQuery
    }
  })),

  // 🔹 Charger les produits
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  // 🔹 Succès du chargement
  on(ProductsActions.loadProductsSuccess, (state, { items, totalElements, totalPages }) => ({
    ...state,
    items,
    totalElements,
    totalPages,
    loading: false,
    error: null
  })),

  // 🔹 Échec du chargement
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // 🔹 Réinitialiser la query
  on(ProductsActions.resetQuery, (state) => ({
    ...state,
    query: initialProductsState.query
  })),

  // 🔹 Effacer l'erreur
  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);

