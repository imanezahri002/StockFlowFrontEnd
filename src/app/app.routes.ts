import { Routes } from '@angular/router';
import { Home } from './home/home';
import { InventoriesComponent } from './inventories/inventories.component';
import { InventoryFormComponent } from './inventories/inventory-form.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './products/product-form.component';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { WarehouseFormComponent } from './warehouses/warehouse-form.component';

export const routes: Routes = [
  // Redirect empty path to homepage
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Homepage
  { path: 'home', component: Home },

  // Inventories module
  { path: 'inventories', component: InventoriesComponent },
  { path: 'inventories/new', component: InventoryFormComponent },
  { path: 'inventories/:id/edit', component: InventoryFormComponent },

  // Products module
  { path: 'products', component: ProductsComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/:id/edit', component: ProductFormComponent },

  // Warehouses module
  { path: 'warehouses', component: WarehousesComponent },
  { path: 'warehouses/new', component: WarehouseFormComponent },
  { path: 'warehouses/:id/edit', component: WarehouseFormComponent }
];
