import { Warehouse } from './warehouse.model';
import { Product } from './product.model';
import { InventoryMovement } from './inventory-movement.model';

export interface Inventory {
  id?: number;
  name: string;
  warehouseId: number;
  warehouseName?: string;
  productId: number;
  productName?: string;
  productSku?: string;
  qtyOnHand: number;
  qtyReserved: number;
}
