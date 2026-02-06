import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { UserService, User } from '../core/services/users/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('🔄 DÉBUT loadUsers()');

    this.loading = true;
    this.error = null;
    this.users = [];
    this.cdr.detectChanges();

    this.userService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Données reçues:', data);
        this.users = data || [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Utilisateurs chargés:', this.users.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement utilisateurs:', err);
        this.loading = false;
        this.error = 'Impossible de charger les utilisateurs. Veuillez réessayer.';
        this.users = [];
        this.cdr.detectChanges();
      }
    });
  }

  deleteUser(id: number): void {
    console.log('🗑️ Tentative de suppression - ID:', id);

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('✅ Confirmation reçue, envoi de la requête DELETE...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.userService.delete(id).subscribe({
      next: () => {
        console.log('✅ Suppression réussie - ID:', id);

        const initialLength = this.users.length;
        this.users = this.users.filter(u => u.id !== id);
        console.log(`📊 Utilisateurs avant: ${initialLength}, après: ${this.users.length}`);

        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Vue mise à jour après suppression');
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        console.log('📊 Status de l\'erreur:', err.status);

        if (err.status === 200 || err.status === 204) {
          console.log('✅ Suppression réussie malgré l\'erreur de parsing');
          const initialLength = this.users.length;
          this.users = this.users.filter(u => u.id !== id);
          console.log(`📊 Utilisateurs avant: ${initialLength}, après: ${this.users.length}`);
          this.loading = false;
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          this.cdr.detectChanges();
          alert('Erreur lors de la suppression de l\'utilisateur. Veuillez réessayer.');
        }
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch(role?.toUpperCase()) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return 'badge-admin';
      case 'WAREHOUSE_MANAGER':
      case 'ROLE_WAREHOUSE_MANAGER':
        return 'badge-manager';
      case 'CLIENT':
      case 'ROLE_CLIENT':
        return 'badge-client';
      default:
        return 'badge-default';
    }
  }

  getRoleLabel(role: string): string {
    switch(role?.toUpperCase()) {
      case 'ADMIN':
      case 'ROLE_ADMIN':
        return 'Administrateur';
      case 'WAREHOUSE_MANAGER':
      case 'ROLE_WAREHOUSE_MANAGER':
        return 'Gestionnaire';
      case 'CLIENT':
      case 'ROLE_CLIENT':
        return 'Client';
      default:
        return role;
    }
  }
}

