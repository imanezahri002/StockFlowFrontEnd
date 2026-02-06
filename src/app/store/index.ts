import { ActionReducerMap } from '@ngrx/store';
import { ProductsState, productsReducer } from './products';

export interface AppState {
  products: ProductsState;
}

export const reducers: ActionReducerMap<AppState> = {
  products: productsReducer
};

