import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../core/services/warehouses/warehouse.service';
import { Warehouse } from '../models/warehouse.model';

@Component({
  selector: 'app-warehouses',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './warehouses.component.html',
  styleUrls: ['./warehouses.component.css'],
})
export class WarehousesComponent implements OnInit {
  warehouses: Warehouse[] = [];
  loading = false;

  constructor(
    private warehouseService: WarehouseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.warehouses = [];
    this.cdr.detectChanges();

    this.warehouseService.getAll().subscribe({
      next: (data) => {
        this.warehouses = data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement entrepôts:', err);
        this.loading = false;
        this.warehouses = [];
        this.cdr.detectChanges();
      }
    });
  }
}

