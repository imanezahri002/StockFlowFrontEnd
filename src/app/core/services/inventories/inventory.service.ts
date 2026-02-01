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
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🔍 Chargement inventaire ID:', id);
    console.log('🌐 URL GET BY ID:', url);

    return this.http.get<Inventory>(url).pipe(
      tap(data => {
        console.log('✅ Inventaire chargé avec succès - ID:', id);
        console.log('📦 Données:', data);
      })
    );
  }

  // 🔹 CREATE
  create(data: Inventory): Observable<Inventory> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('➕ Création inventaire');
    console.log('🌐 URL POST:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.post<Inventory>(url, data).pipe(
      tap(response => {
        console.log('✅ Inventaire créé avec succès');
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 UPDATE
  update(id: number, data: Inventory): Observable<Inventory> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('✏️ Mise à jour inventaire ID:', id);
    console.log('🌐 URL PUT:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.put<Inventory>(url, data).pipe(
      tap(response => {
        console.log('✅ Inventaire mis à jour avec succès - ID:', id);
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 DELETE
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🗑️ Suppression inventaire ID:', id);
    console.log('🌐 URL DELETE:', url);

    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('✅ Inventaire supprimé avec succès - ID:', id);
      })
    );
  }
}
