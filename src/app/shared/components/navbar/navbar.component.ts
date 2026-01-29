import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() userRole: 'admin' | 'client' | 'warehouse_manager' = 'admin';
  @Input() userName: string = 'Utilisateur';
  @Output() toggleSidebar = new EventEmitter<void>();

  showUserMenu = false;

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
  }

  logout() {
    console.log('Logout');
    // Implémenter la logique de déconnexion
  }
}

