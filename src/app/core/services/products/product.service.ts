import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import {Product} from '../../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/products';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    console.log('🌐 Appel API Products:', `${this.baseUrl}${this.endpoint}`);
    return this.http.get<Product[]>(
      `${this.baseUrl}${this.endpoint}`
    ).pipe(
      tap(data => console.log('📦 Produits récupérés:', data))
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  create(data: Product): Observable<Product> {
    return this.http.post<Product>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  update(id: number, data: Product): Observable<Product> {
    return this.http.put<Product>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }
}

