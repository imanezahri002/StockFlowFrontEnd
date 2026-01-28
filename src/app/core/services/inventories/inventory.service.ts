// typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inventory } from '../../../models/inventory.model';
import { Observable } from 'rxjs';
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
    return this.http.get<Inventory[]>(
      `${this.baseUrl}${this.endpoint}`
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
