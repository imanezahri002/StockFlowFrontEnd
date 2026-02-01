import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Product } from '../../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/products';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

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

