import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { WarehouseService } from '../core/services/warehouses/warehouse.service';
import { Warehouse } from '../models/warehouse.model';

@Component({
  selector: 'app-warehouse-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.css']
})
export class WarehouseFormComponent implements OnInit {
  warehouse: Warehouse = {
    name: '',
    location: '',
    active: true
  } as Warehouse;

  isEditMode = false;
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private warehouseService: WarehouseService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire warehouse');

    const id = this.route.snapshot.params['id'];
    console.log('🔍 Paramètre ID de la route:', id);

    if (id) {
      this.isEditMode = true;
      console.log('✏️ MODE ÉDITION activé pour ID:', id);
      this.loadWarehouse(+id);
    } else {
      console.log('➕ MODE CRÉATION activé');
    }
  }

  loadWarehouse(id: number): void {
    console.log('📥 Chargement de l\'entrepôt ID:', id);
    this.loading = true;
    this.error = null;

    // Force la détection pour afficher le spinner
    this.cdr.detectChanges();

    this.warehouseService.getById(id).subscribe({
      next: (data) => {
        console.log('✅ Entrepôt chargé:', data);
        this.warehouse = data;
        this.loading = false;

        // Force la détection pour débloquer les inputs immédiatement
        this.cdr.detectChanges();

        console.log('📋 Formulaire pré-rempli:', this.warehouse);
        console.log('🔓 Loading =', this.loading, '- Inputs débloqués');
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'entrepôt:', err);
        this.error = 'Impossible de charger l\'entrepôt';
        this.loading = false;

        // Force la détection même en cas d'erreur
        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/warehouses']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode
      ? this.warehouseService.update(this.warehouse.id!, this.warehouse)
      : this.warehouseService.create(this.warehouse);

    operation.subscribe({
      next: () => {
        console.log('✅ Entrepôt sauvegardé avec succès');
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la sauvegarde:', err);
        this.error = 'Erreur lors de la sauvegarde de l\'entrepôt';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.warehouse.name || this.warehouse.name.trim() === '') {
      this.error = 'Le nom de l\'entrepôt est requis';
      return false;
    }
    if (this.warehouse.name.trim().length < 3) {
      this.error = 'Le nom de l\'entrepôt doit contenir au moins 3 caractères';
      return false;
    }
    if (!this.warehouse.location || this.warehouse.location.trim() === '') {
      this.error = 'La localisation de l\'entrepôt est requise';
      return false;
    }
    if (this.warehouse.location.trim().length < 5) {
      this.error = 'La localisation doit contenir au moins 5 caractères';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/warehouses']);
  }

  deleteWarehouse(): void {
    if (!this.isEditMode || !this.warehouse.id) {
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'entrepôt "${this.warehouse.name}" ?`)) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('🗑️ Suppression de l\'entrepôt ID:', this.warehouse.id);
    this.loading = true;
    this.error = null;

    this.warehouseService.delete(this.warehouse.id).subscribe({
      next: () => {
        console.log('✅ Entrepôt supprimé avec succès');
        this.loading = false;
        this.router.navigate(['/warehouses']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        console.log('📊 Status de l\'erreur:', err.status);

        // Si le status est 200 ou 204, c'est en fait un succès
        // (problème de parsing de la réponse vide)
        if (err.status === 200 || err.status === 204) {
          console.log('✅ Suppression réussie malgré l\'erreur de parsing');
          this.loading = false;
          this.router.navigate(['/warehouses']);
        } else {
          // Vraie erreur
          this.error = 'Erreur lors de la suppression de l\'entrepôt';
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }
}

