import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Warehouse } from '../../../models/warehouse.model';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private endpoint = '/warehouses';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 READ ALL
  getAll(): Observable<Warehouse[]> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('🌐 Appel API Warehouses:', url);

    return this.http.get<Warehouse[]>(url).pipe(
      tap(data => {
        console.log('Entrepôts récupérés:', data);
        console.log('Nombre d\'entrepôts:', data?.length);
      })
    );
  }

  // 🔹 READ BY ID
  getById(id: number): Observable<Warehouse> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🔍 Chargement entrepôt ID:', id);
    console.log('🌐 URL GET BY ID:', url);

    return this.http.get<Warehouse>(url).pipe(
      tap(data => {
        console.log('✅ Entrepôt chargé:', data);
      })
    );
  }

  // 🔹 CREATE
  create(data: Warehouse): Observable<Warehouse> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('➕ Création entrepôt');
    console.log('🌐 URL POST:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.post<Warehouse>(url, data).pipe(
      tap(response => {
        console.log('✅ Entrepôt créé avec succès');
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 UPDATE
  update(id: number, data: Warehouse): Observable<Warehouse> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log(' Mise à jour entrepôt ID:', id);
    console.log(' URL PUT:', url);
    console.log(' Données envoyées:', data);

    return this.http.put<Warehouse>(url, data).pipe(
      tap(response => {
        console.log('Entrepôt mis à jour avec succès - ID:', id);
        console.log('Réponse:', response);
      })
    );
  }

  // 🔹 DELETE
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🗑️ Suppression entrepôt ID:', id);
    console.log('🌐 URL DELETE:', url);

    return this.http.delete(url, {
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(
      tap((response) => {
        console.log('✅ Entrepôt supprimé avec succès - ID:', id);
        console.log('📊 Status HTTP:', response.status);
      }),
      map(() => void 0)
    );
  }
}
