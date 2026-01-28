import { Warehouse } from './warehouse.model';
import { Product } from './product.model';
import { InventoryMovement } from './inventory-movement.model';

export interface Inventory {
  id?: number;                 // ID généré par le backend
  name: string;
  warehouse: Warehouse;        // objet Warehouse lié
  product: Product;            // objet Product lié
  inventoryMovements?: InventoryMovement[]; // optionnel pour le frontend
  qtyOnHand: number;
  qtyReserved: number;
}
