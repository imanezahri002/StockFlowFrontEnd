import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, LoginRequest } from '../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loading = false;
  error: string | null = null;

  // Formulaire Login
  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onLogin(): void {
    this.error = null;

    if (!this.loginData.email || !this.loginData.password) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.loading = true;

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Rediriger selon le rôle
        this.redirectAfterLogin(response.user.role);
      },
      error: (err) => {
        // Afficher le message d'erreur clair dans le navigateur
        if (err.error && err.error.message) {
          this.error = '❌ ' + err.error.message;
        } else if (err.status === 401) {
          this.error = '❌ Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
        } else if (err.status === 403) {
          this.error = '❌ Accès interdit. Vous n\'avez pas les permissions nécessaires.';
        } else if (err.status === 0) {
          this.error = '❌ Impossible de contacter le serveur. Vérifiez que le backend est démarré.';
        } else {
          this.error = '❌ Erreur de connexion. Veuillez réessayer.';
        }

        // Log temporaire pour vérifier
        console.log('🔴 Message d\'erreur défini:', this.error);
        console.log('🔴 Status HTTP:', err.status);

        // Réinitialiser le mot de passe pour sécurité
        this.loginData.password = '';

        // Arrêter le chargement
        this.loading = false;

        // Forcer la détection de changement pour afficher l'erreur
        this.cdr.detectChanges();
      }
    });
  }

  redirectAfterLogin(role: string): void {
    // Rediriger selon le rôle de l'utilisateur
    if (role === 'ADMIN' || role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin-dashboard']);
    } else if (role === 'WAREHOUSE_MANAGER' || role === 'ROLE_WAREHOUSE_MANAGER') {
      this.router.navigate(['/warehouse-dashboard']);
    } else if (role === 'CLIENT' || role === 'ROLE_CLIENT') {
      this.router.navigate(['/client-dashboard']);
    } else {
      // Rôle invalide ou inconnu : afficher erreur et déconnecter
      this.error = '❌ Rôle utilisateur invalide. Veuillez contacter l\'administrateur.';
      this.authService.logout();
      this.loading = false;
    }
  }
}

