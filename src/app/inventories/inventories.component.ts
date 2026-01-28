import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inventory } from '../models/inventory.model';
import { InventoryService } from '../core/services/inventories/inventory.service';

@Component({
  selector: 'app-inventories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.css']
})
export class InventoriesComponent implements OnInit {
  inventories: Inventory[] = [];
  loading = false;
  error: string | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.inventoryService.getAll().subscribe({
      next: (data) => {
        this.inventories = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Erreur lors du chargement des inventaires.';
        this.loading = false;
      }
    });
  }
}
