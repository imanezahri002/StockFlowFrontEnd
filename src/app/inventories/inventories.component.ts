import { Component, OnInit } from '@angular/core';
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

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    console.log('🔄 DÉBUT loadInventories()');
    console.log('🌐 URL configurée dans environment:', 'Proxy /api → http://localhost:8080/api');

    this.loading = true;
    this.error = null;

    this.inventoryService.getAll().subscribe({
      next: (data) => {
        console.log('✅ ✅ ✅ SUCCESS - Données reçues:', data);
        console.log('📊 Type:', typeof data, '| Array?', Array.isArray(data));
        console.log('🔢 Nombre d\'éléments:', Array.isArray(data) ? data.length : 'pas un array');

        this.inventories = data || [];
        this.loading = false;

        console.log('🎉 État final:', {
          loading: this.loading,
          error: this.error,
          count: this.inventories.length,
          data: this.inventories
        });
      },
      error: (err) => {
        console.error('❌ ❌ ❌ ERREUR DÉTAILLÉE:');
        console.error('Type d\'erreur:', err.constructor.name);
        console.error('Status HTTP:', err.status);
        console.error('Status Text:', err.statusText);
        console.error('Message:', err.message);
        console.error('URL demandée:', err.url);
        console.error('Erreur complète:', err);

        // Message d'erreur spécifique
        if (err.status === 0) {
          this.error = '🚫 CORS bloqué OU backend non démarré. Avez-vous redémarré npm start avec le proxy ?';
        } else if (err.status === 404) {
          this.error = '❌ Endpoint /api/inventories introuvable sur le backend';
        } else {
          this.error = `Erreur ${err.status}: ${err.message}`;
        }

        this.loading = false;

        console.log('État après erreur:', {
          loading: this.loading,
          error: this.error
        });
      }
    });
  }

  deleteInventory(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet inventaire ?')) {
      return;
    }

    this.inventoryService.delete(id).subscribe({
      next: () => {
        this.inventories = this.inventories.filter(inv => inv.id !== id);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression de l\'inventaire');
      }
    });
  }
}

