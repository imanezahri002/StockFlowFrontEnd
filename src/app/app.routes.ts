import { Routes } from '@angular/router';
import { Home } from './home/home';
import { InventoriesComponent } from './inventories/inventories.component';
import { InventoryFormComponent } from './inventories/inventory-form.component';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
  // Redirect empty path to homepage
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Homepage
  { path: 'home', component: Home },

  // Inventories module
  { path: 'inventories', component: InventoriesComponent },
  { path: 'inventories/new', component: InventoryFormComponent },
  { path: 'inventories/:id/edit', component: InventoryFormComponent },

  //products module
  { path:'products' , component:ProductsComponent}
];
