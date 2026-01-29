// typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../../../models/inventory.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private endpoint = '/inventories';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 READ ALL
  getAll(): Observable<Inventory[]> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('🌐 URL complète appelée:', url);
    console.log('📍 baseUrl:', this.baseUrl);
    console.log('📍 endpoint:', this.endpoint);

    return this.http.get<Inventory[]>(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).pipe(
      tap(data => {
        console.log('✅ SUCCESS - Données JSON reçues:', data);
        console.log('📊 Type:', typeof data);
        console.log('📊 Est un Array?', Array.isArray(data));
        console.log('📦 Inventaires récupérés:', data);
      })
    );
  }

  // 🔹 READ BY ID
  getById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  // 🔹 CREATE
  create(data: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  // 🔹 UPDATE
  update(id: number, data: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(
      `${this.baseUrl}${this.endpoint}/${id}`,
      data
    );
  }

  // 🔹 DELETE
  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }
}
