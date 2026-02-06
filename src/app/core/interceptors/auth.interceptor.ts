import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Récupérer le token
    const token = this.authService.getToken();

    // Cloner la requête et ajouter le header Authorization si token existe
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continuer avec la requête modifiée et gérer les erreurs
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide -> déconnecter et rediriger vers login
          console.log(' Token invalide ou expiré - Déconnexion');
          this.authService.logout();
          this.router.navigate(['/login']);
        } else if (error.status === 403) {
          // Accès interdit
          console.log('Accès interdit - Permissions insuffisantes');
        }

        return throwError(() => error);
      })
    );
  }
}

