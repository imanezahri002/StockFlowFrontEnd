export interface InventoryMovement{
  id: number;
  inventoryId: number;
  movementType: 'IN' | 'OUT';
  quantity: number;
  movementDate: Date;
}
