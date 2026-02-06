import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ProductService, ProductsListResponse } from '../../core/services/products/product.service';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {

  constructor(
    private actions$: Actions,
    private productService: ProductService
  ) {}

  // 🔹 Effect: Charger les produits
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      tap(({ query }) => {
        console.log('🔄 Effect: Chargement produits avec query:', query);
      }),
      switchMap(({ query }) =>
        this.productService.list({
          page: query.page,
          size: query.size,
          sort: query.sort,
          search: query.search,
          category: query.category,
          active: query.active
        }).pipe(
          map((response: ProductsListResponse) => {
            console.log('✅ Effect: Succès chargement produits');
            return ProductsActions.loadProductsSuccess({
              items: response.content || [],
              totalElements: response.totalElements || 0,
              totalPages: response.totalPages || 0
            });
          }),
          catchError(error => {
            console.error('❌ Effect: Erreur chargement produits:', error);

            // Parser l'erreur
            const parsedError = {
              status: error.status || 500,
              message: error.error?.message || error.message || 'Erreur lors du chargement des produits',
              detail: error.error?.detail || error.error?.error || '',
              timestamp: error.error?.timestamp || new Date().toISOString(),
              path: error.error?.path || error.url || ''
            };

            return of(ProductsActions.loadProductsFailure({ error: parsedError }));
          })
        )
      )
    )
  );
}

