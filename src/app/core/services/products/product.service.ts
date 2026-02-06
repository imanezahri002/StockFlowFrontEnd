import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../models/product.model';

export interface ProductsListResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ProductsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
  search?: string;
  category?: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/products';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 LIST WITH PAGINATION AND FILTERS
  list(params: ProductsQueryParams): Observable<ProductsListResponse> {
    let httpParams = new HttpParams();

    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.size !== undefined) {
      httpParams = httpParams.set('size', params.size.toString());
    }
    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.active !== undefined) {
      httpParams = httpParams.set('active', params.active.toString());
    }

    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('🌐 Appel API Products avec params:', url, params);

    return this.http.get<ProductsListResponse>(url, { params: httpParams }).pipe(
      tap(data => {
        console.log('✅ Produits récupérés (paginés):', data);
        console.log('📊 Total éléments:', data.totalElements);
        console.log('📊 Total pages:', data.totalPages);
      })
    );
  }


  // 🔹 READ ALL
  getAll(): Observable<Product[]> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('🌐 Appel API Products:', url);

    return this.http.get<Product[]>(url).pipe(
      tap(data => {
        console.log('✅ Produits récupérés:', data);
        console.log('📊 Nombre de produits:', data?.length);
      })
    );
  }

  // 🔹 READ BY ID
  getById(id: number): Observable<Product> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🔍 Chargement produit ID:', id);
    console.log('🌐 URL GET BY ID:', url);

    return this.http.get<Product>(url).pipe(
      tap(data => {
        console.log('✅ Produit chargé:', data);
      })
    );
  }

  // 🔹 CREATE
  create(data: Product): Observable<Product> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('➕ Création produit');
    console.log('🌐 URL POST:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.post<Product>(url, data).pipe(
      tap(response => {
        console.log('✅ Produit créé avec succès');
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 UPDATE
  update(id: number, data: Product): Observable<Product> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('✏️ Mise à jour produit ID:', id);
    console.log('🌐 URL PUT:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.put<Product>(url, data).pipe(
      tap(response => {
        console.log('✅ Produit mis à jour avec succès - ID:', id);
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 DELETE
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🗑️ Suppression produit ID:', id);
    console.log('🌐 URL DELETE:', url);

    return this.http.delete(url, {
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(
      tap((response) => {
        console.log('✅ Produit supprimé avec succès - ID:', id);
        console.log('📊 Status HTTP:', response.status);
      }),
      map(() => void 0)
    );
  }
}

