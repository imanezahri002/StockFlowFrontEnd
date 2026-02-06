import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.getCurrentUser();
    const expectedRoles = route.data['roles'] as Array<string>;

    if (!currentUser) {
      console.log('🚫 Aucun utilisateur connecté - Redirection vers /login');
      this.router.navigate(['/login']);
      return false;
    }

    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const userRole = currentUser.user.role;
    const hasRole = expectedRoles.some(role =>
      userRole === role || userRole === `ROLE_${role}`
    );

    if (hasRole) {
      console.log('✅ Accès autorisé - Rôle:', userRole);
      return true;
    }

    console.log('🚫 Accès refusé - Rôle requis:', expectedRoles, '- Rôle actuel:', userRole);
    this.router.navigate(['/login']);
    return false;
  }
}

