import { Warehouse } from './warehouse.model';
// import { PurchaseOrder } from './purchase-order.model'; // si utilisé plus tard

export interface Manager {
  id: number;

  // hérités de User (à adapter selon ton User backend)
  username?: string;
  email?: string;

  department: string;
  active: boolean;

  warehouses?: Warehouse[];
  // purchaseOrders?: PurchaseOrder[];
}
