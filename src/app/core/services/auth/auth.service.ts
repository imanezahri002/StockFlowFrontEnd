import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    addressse?: string;
    tel?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private endpoint = '/auth';
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  // 🔹 LOGIN
  login(credentials: LoginRequest): Observable<AuthResponse> {
    const url = `${this.baseUrl}${this.endpoint}/login`;

    return this.http.post<AuthResponse>(url, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      tap(response => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  // 🔹 REGISTER
  register(data: RegisterRequest): Observable<AuthResponse> {
    const url = `${this.baseUrl}${this.endpoint}/register`;
    console.log('📝 Tentative d\'inscription:', data.username);
    console.log('🌐 URL POST:', url);

    return this.http.post<AuthResponse>(url, data).pipe(
      tap(response => {
        console.log('✅ Inscription réussie:', response);
        // Auto-login après inscription
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  // 🔹 LOGOUT
  logout(): void {
    console.log('🚪 Déconnexion');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // 🔹 VÉRIFIER SI L'UTILISATEUR EST CONNECTÉ
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  // 🔹 OBTENIR L'UTILISATEUR ACTUEL
  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  // 🔹 OBTENIR LE TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

