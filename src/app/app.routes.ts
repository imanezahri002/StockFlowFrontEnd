import { Routes } from '@angular/router';
import { Home } from './home/home';
import { InventoriesComponent } from './inventories/inventories.component';

export const routes: Routes = [
  // Redirect empty path to homepage
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Homepage
  { path: 'home', component: Home },

  // Inventories module
  { path: 'inventories', component: InventoriesComponent }
];
