import { Warehouse } from './warehouse.model';
import { Product } from './product.model';
import { InventoryMovement } from './inventory-movement.model';

export interface Inventory {
  id?: number;
  name: string;
  warehouseId: number;
  warehouseName?: string;  // ✅ Ajouté
  productId: number;
  productName?: string;     // ✅ Ajouté
  productSku?: string;      // ✅ Ajouté
  qtyOnHand: number;
  qtyReserved: number;
}
