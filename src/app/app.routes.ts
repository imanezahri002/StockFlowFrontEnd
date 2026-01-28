import { Routes } from '@angular/router';
import {Home} from './home/home';
export const routes: Routes = [
  // Redirect empty path to homepage
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Homepage
  { path: 'home', component: Home },

];
