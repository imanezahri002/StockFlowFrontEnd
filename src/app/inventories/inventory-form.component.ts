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
    // Charger les listes de produits et entrepôts
    this.loadProducts();
    this.loadWarehouses();

    // Charger l'inventaire si mode édition
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.loadInventory(id);
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
    this.loading = true;
    this.inventoryService.getById(id).subscribe({
      next: (data) => {
        this.inventory = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.error = 'Impossible de charger l\'inventaire';
        this.loading = false;
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
      ? this.inventoryService.update(this.inventory.id!, this.inventory)
      : this.inventoryService.create(this.inventory);

    operation.subscribe({
      next: () => {
        console.log('✅ Inventaire sauvegardé avec succès');
        this.router.navigate(['/inventories']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la sauvegarde:', err);
        this.error = 'Erreur lors de la sauvegarde de l\'inventaire';
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
