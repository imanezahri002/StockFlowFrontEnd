import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  active?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private endpoint = '/users';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 🔹 READ ALL
  getAll(): Observable<User[]> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('🌐 Appel API Users:', url);

    return this.http.get<User[]>(url).pipe(
      tap(data => {
        console.log('✅ Utilisateurs récupérés:', data);
        console.log('📊 Nombre d\'utilisateurs:', data?.length);
      })
    );
  }

  // 🔹 READ BY ID
  getById(id: number): Observable<User> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🔍 Chargement utilisateur ID:', id);
    console.log('🌐 URL GET BY ID:', url);

    return this.http.get<User>(url).pipe(
      tap(data => {
        console.log('✅ Utilisateur chargé:', data);
      })
    );
  }

  // 🔹 CREATE
  create(data: User): Observable<User> {
    const url = `${this.baseUrl}${this.endpoint}`;
    console.log('➕ Création utilisateur');
    console.log('🌐 URL POST:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.post<User>(url, data).pipe(
      tap(response => {
        console.log('✅ Utilisateur créé avec succès');
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 UPDATE
  update(id: number, data: User): Observable<User> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('✏️ Mise à jour utilisateur ID:', id);
    console.log('🌐 URL PUT:', url);
    console.log('📦 Données envoyées:', data);

    return this.http.put<User>(url, data).pipe(
      tap(response => {
        console.log('✅ Utilisateur mis à jour avec succès - ID:', id);
        console.log('📦 Réponse:', response);
      })
    );
  }

  // 🔹 DELETE
  delete(id: number): Observable<void> {
    const url = `${this.baseUrl}${this.endpoint}/${id}`;
    console.log('🗑️ Suppression utilisateur ID:', id);
    console.log('🌐 URL DELETE:', url);

    return this.http.delete(url, {
      observe: 'response',
      responseType: 'text' as 'json'
    }).pipe(
      tap((response) => {
        console.log('✅ Utilisateur supprimé avec succès - ID:', id);
        console.log('📊 Status HTTP:', response.status);
      }),
      map(() => void 0)
    );
  }
}

