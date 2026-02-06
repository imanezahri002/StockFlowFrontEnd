import { Routes } from '@angular/router';
import { Home } from './home/home';
import { LoginComponent } from './auth/login.component';
import { AdminDashboardComponent } from './dashboards/admin-dashboard/admin-dashboard.component';
import { WarehouseDashboardComponent } from './dashboards/warehouse-dashboard/warehouse-dashboard.component';
import { ClientDashboardComponent } from './dashboards/client-dashboard/client-dashboard.component';
import { InventoriesComponent } from './inventories/inventories.component';
import { InventoryFormComponent } from './inventories/inventory-form.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './products/product-form.component';
import { ProductsListComponent } from './client/products-list/products-list';
import { WarehousesComponent } from './warehouses/warehouses.component';
import { WarehouseFormComponent } from './warehouses/warehouse-form.component';
import { UsersComponent } from './users/users.component';
import { UserFormComponent } from './users/user-form.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import {TodoList} from './todo/todo-list/todo-list';


export const routes: Routes = [
  // Redirect empty path to homepage
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Homepage (public)
  { path: 'home', component: Home },
  {path:'todolist',component:TodoList },

  // Authentication (public)
  { path: 'login', component: LoginComponent },

  // Dashboards (protégés par AuthGuard)
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'warehouse-dashboard',
    component: WarehouseDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['WAREHOUSE_MANAGER'] }
  },
  {
    path: 'client-dashboard',
    component: ClientDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT'] }
  },

  // Inventories (ADMIN & WAREHOUSE_MANAGER)
  {
    path: 'inventories',
    component: InventoriesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'WAREHOUSE_MANAGER'] }
  },
  {
    path: 'inventories/new',
    component: InventoryFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'inventories/:id/edit',
    component: InventoryFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },

  // Products (ADMIN, WAREHOUSE_MANAGER, CLIENT)
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'CLIENT'] }
  },
  {
    path: 'products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'products/:id/edit',
    component: ProductFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },

  // Client Products List (avec NgRx)
  {
    path: 'client/products',
    component: ProductsListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['CLIENT', 'ADMIN', 'WAREHOUSE_MANAGER'] }
  },

  // Warehouses (ADMIN, WAREHOUSE_MANAGER, CLIENT - lecture)
  {
    path: 'warehouses',
    component: WarehousesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN', 'WAREHOUSE_MANAGER', 'CLIENT'] }
  },
  {
    path: 'warehouses/new',
    component: WarehouseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'warehouses/:id/edit',
    component: WarehouseFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },

  // Users (ADMIN uniquement)
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'users/:id/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] }
  }
];
