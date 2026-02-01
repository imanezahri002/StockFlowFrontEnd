import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { WarehouseService } from '../core/services/warehouses/warehouse.service';
import { Warehouse } from '../models/warehouse.model';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css'],
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWarehouses();
  }

  loadWarehouses(): void {
    console.log('🔄 DÉBUT loadWarehouses()');

    this.loading = true;
    this.error = null;
    this.warehouses = [];
    this.cdr.detectChanges();

    this.warehouseService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Données reçues:', data);
        this.warehouses = data || [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Entrepôts chargés:', this.warehouses.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement entrepôts:', err);
        this.loading = false;
        this.error = 'Impossible de charger les entrepôts. Veuillez réessayer.';
        this.warehouses = [];
        this.cdr.detectChanges();
      }
    });
  }

  deleteWarehouse(id: number): void {
    console.log('🗑️ Tentative de suppression - ID:', id);

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet entrepôt ?')) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('✅ Confirmation reçue, envoi de la requête DELETE...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.warehouseService.delete(id).subscribe({
      next: () => {
        console.log('✅ Suppression réussie - ID:', id);

        const initialLength = this.warehouses.length;
        this.warehouses = this.warehouses.filter(w => w.id !== id);
        console.log(`📊 Entrepôts avant: ${initialLength}, après: ${this.warehouses.length}`);

        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Vue mise à jour après suppression');
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        this.loading = false;
        this.error = 'Erreur lors de la suppression de l\'entrepôt';
        this.cdr.detectChanges();
        alert('Erreur lors de la suppression de l\'entrepôt. Veuillez réessayer.');
      }
    });
  }
}

