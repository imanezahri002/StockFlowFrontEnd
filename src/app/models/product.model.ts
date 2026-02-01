import {Inventory} from './inventory.model';

export interface Product {
  id?: number;
  sku: string;
  name: string;
  category?: string;
  active?: boolean;
  originalPrice?: number;
  profit?: number;

  inventories?: Inventory[];
}
