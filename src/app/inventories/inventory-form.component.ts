import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { InventoryService } from '../core/services/inventories/inventory.service';
import { ProductService } from '../core/services/products/product.service';
import { WarehouseService } from '../core/services/warehouses/warehouse.service';
import { Inventory } from '../models/inventory.model';
import { Product } from '../models/product.model';
import { Warehouse } from '../models/warehouse.model';

@Component({
  selector: 'app-inventory-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './inventory-form.component.html',
  styleUrls: ['./inventory-form.component.css']
})
export class InventoryFormComponent implements OnInit {
  inventory: Inventory = {
    name: '',
    warehouseId: 0,
    productId: 0,
    qtyOnHand: 0,
    qtyReserved: 0
  };

  // Listes dynamiques depuis l'API
  products: Product[] = [];
  warehouses: Warehouse[] = [];
  loadingProducts = false;
  loadingWarehouses = false;

  isEditMode = false;
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private warehouseService: WarehouseService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire inventaire');

    // Charger les listes de produits et entrepôts
    this.loadProducts();
    this.loadWarehouses();

    // Charger l'inventaire si mode édition
    const id = this.route.snapshot.params['id'];
    console.log('🔍 Paramètre ID de la route:', id);

    if (id) {
      this.isEditMode = true;
      console.log('✏️ MODE ÉDITION activé pour ID:', id);
      this.loadInventory(+id); // Convertir en number avec +
    } else {
      console.log('➕ MODE CRÉATION activé');
    }
  }

  loadProducts(): void {
    this.loadingProducts = true;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.loadingProducts = false;
        console.log('✅ Produits chargés:', this.products.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement produits:', err);
        this.loadingProducts = false;
        // Ne pas bloquer le formulaire si les produits ne se chargent pas
      }
    });
  }

  loadWarehouses(): void {
    this.loadingWarehouses = true;
    this.warehouseService.getAll().subscribe({
      next: (data) => {
        this.warehouses = data || [];
        this.loadingWarehouses = false;
        console.log('✅ Entrepôts chargés:', this.warehouses.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement entrepôts:', err);
        this.loadingWarehouses = false;
        // Ne pas bloquer le formulaire si les entrepôts ne se chargent pas
      }
    });
  }

  loadInventory(id: number): void {
    console.log('📥 Chargement de l\'inventaire ID:', id);
    this.loading = true;
    this.error = null;

    this.inventoryService.getById(id).subscribe({
      next: (data) => {
        console.log('✅ Inventaire chargé:', data);
        this.inventory = data;
        this.loading = false;
        console.log('📋 Formulaire pré-rempli:', this.inventory);
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement de l\'inventaire:', err);
        this.error = 'Impossible de charger l\'inventaire';
        this.loading = false;

        // Rediriger vers la liste après 2 secondes si l'inventaire n'existe pas
        setTimeout(() => {
          this.router.navigate(['/inventories']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    console.log('📝 Soumission du formulaire');
    console.log('🔄 Mode:', this.isEditMode ? 'ÉDITION' : 'CRÉATION');
    console.log('📦 Données du formulaire:', this.inventory);

    if (!this.validateForm()) {
      console.log('❌ Validation échouée:', this.error);
      return;
    }

    console.log('✅ Validation réussie');
    this.loading = true;
    this.error = null;

    const operation = this.isEditMode
      ? this.inventoryService.update(this.inventory.id!, this.inventory)
      : this.inventoryService.create(this.inventory);

    operation.subscribe({
      next: () => {
        const action = this.isEditMode ? 'mis à jour' : 'créé';
        console.log(`✅ Inventaire ${action} avec succès`);
        this.router.navigate(['/inventories']);
      },
      error: (err) => {
        const action = this.isEditMode ? 'mise à jour' : 'sauvegarde';
        console.error(`❌ Erreur lors de la ${action}:`, err);
        this.error = `Erreur lors de la ${action} de l'inventaire`;
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.inventory.name || this.inventory.name.trim() === '') {
      this.error = 'Le nom est requis';
      return false;
    }
    if (this.inventory.warehouseId <= 0) {
      this.error = 'Veuillez sélectionner un entrepôt';
      return false;
    }
    if (this.inventory.productId <= 0) {
      this.error = 'Veuillez sélectionner un produit';
      return false;
    }
    if (this.inventory.qtyOnHand < 0) {
      this.error = 'La quantité disponible ne peut pas être négative';
      return false;
    }
    if (this.inventory.qtyReserved < 0) {
      this.error = 'La quantité réservée ne peut pas être négative';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/inventories']);
  }
}
