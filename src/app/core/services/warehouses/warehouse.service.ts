import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Warehouse } from '../../../models/warehouse.model';
@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private endpoint = '/warehouses';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Warehouse[]> {
    console.log('🌐 Appel API Warehouses:', `${this.baseUrl}${this.endpoint}`);
    return this.http.get<Warehouse[]>(
      `${this.baseUrl}${this.endpoint}`
    ).pipe(
      tap(data => console.log('🏭 Entrepôts récupérés:', data))
    );
  }

  getById(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(
      `${this.baseUrl}${this.endpoint}/${id}`
    );
  }

  create(data: Warehouse): Observable<Warehouse> {
    return this.http.post<Warehouse>(
      `${this.baseUrl}${this.endpoint}`,
      data
    );
  }

  update(id: number, data: Warehouse): Observable<Warehouse> {
    return this.http.put<Warehouse>(
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
