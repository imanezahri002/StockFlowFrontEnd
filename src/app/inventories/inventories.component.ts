import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { InventoryService } from '../core/services/inventories/inventory.service';
import { Inventory } from '../models/inventory.model';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css']
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    console.log('🔄 DÉBUT loadInventories()');
    console.time('API inventories');

    this.loading = true;
    this.error = null;
    this.inventories = [];

    // Force la détection initiale
    this.cdr.detectChanges();

    this.inventoryService.getAll().subscribe({
      next: (data) => {
        console.timeEnd('API inventories');
        console.log('✅ Données reçues:', data);
        console.log('📊 Longueur:', data?.length);

        this.inventories = data || [];
        this.loading = false;

        // 🔥 FORCE LA MISE À JOUR DU HTML
        this.cdr.detectChanges();

        console.log('🎯 Après detectChanges - inventories.length:', this.inventories.length);
        console.log('🎯 loading:', this.loading);
      },
      error: (err) => {
        console.timeEnd('API inventories');
        console.error('❌ Erreur:', err);

        this.loading = false;
        this.error = 'Impossible de charger les inventaires. Veuillez réessayer.';
        this.inventories = [];

        // Force la mise à jour en cas d'erreur aussi
        this.cdr.detectChanges();
      }
    });
  }


  deleteInventory(id: number): void {
    console.log('🗑️ Tentative de suppression - ID:', id);

    if (!confirm('Êtes-vous sûr de vouloir supprimer cet inventaire ?')) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('✅ Confirmation reçue, envoi de la requête DELETE...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.inventoryService.delete(id).subscribe({
      next: () => {
        console.log('✅ Suppression réussie - ID:', id);

        // Filtrer l'inventaire supprimé de la liste
        const initialLength = this.inventories.length;
        this.inventories = this.inventories.filter(inv => inv.id !== id);
        console.log(`📊 Inventaires avant: ${initialLength}, après: ${this.inventories.length}`);

        this.loading = false;

        // Force la mise à jour de la vue
        this.cdr.detectChanges();

        console.log('🎯 Vue mise à jour après suppression');
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        console.error('❌ Erreur complète:', err);

        this.loading = false;
        this.error = 'Erreur lors de la suppression de l\'inventaire';

        // Force la mise à jour pour afficher l'erreur
        this.cdr.detectChanges();

        alert('Erreur lors de la suppression de l\'inventaire. Veuillez réessayer.');
      }
    });
  }
}

