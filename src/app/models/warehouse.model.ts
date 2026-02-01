import { Manager } from './manager.model';

export interface Warehouse {
  id: number;
  name: string;
  location: string;
  active: boolean;
  manager?: Manager; // relation ManyToOne
}
