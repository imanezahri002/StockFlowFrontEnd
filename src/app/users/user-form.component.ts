import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { UserService, User } from '../core/services/users/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  user: User = {
    username: '',
    email: '',
    password: '',
    role: 'CLIENT',
    active: true
  };

  isEditMode = false;
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  roles = [
    { value: 'ADMIN', label: 'Administrateur' },
    { value: 'WAREHOUSE_MANAGER', label: 'Gestionnaire' },
    { value: 'CLIENT', label: 'Client' }
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadUser(+id);
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getById(id).subscribe({
      next: (data) => {
        this.user = { ...data, password: '' };
        this.loading = false;
      },
      error: () => {
        this.error = 'Impossible de charger l\'utilisateur';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    const operation = this.isEditMode
      ? this.userService.update(this.user.id!, this.user)
      : this.userService.create(this.user);

    operation.subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => {
        this.error = 'Erreur lors de la sauvegarde';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}

