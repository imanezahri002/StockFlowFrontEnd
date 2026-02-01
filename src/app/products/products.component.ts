import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { ProductService } from '../core/services/products/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    console.log('🔄 DÉBUT loadProducts()');

    this.loading = true;
    this.error = null;
    this.products = [];
    this.cdr.detectChanges();

    this.productService.getAll().subscribe({
      next: (data) => {
        console.log('✅ Données reçues:', data);
        this.products = data || [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Produits chargés:', this.products.length);
      },
      error: (err) => {
        console.error('❌ Erreur chargement produits:', err);
        this.loading = false;
        this.error = 'Impossible de charger les produits. Veuillez réessayer.';
        this.products = [];
        this.cdr.detectChanges();
      }
    });
  }

  deleteProduct(id: number): void {
    console.log('🗑️ Tentative de suppression - ID:', id);

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('✅ Confirmation reçue, envoi de la requête DELETE...');
    this.loading = true;
    this.error = null;
    this.cdr.detectChanges();

    this.productService.delete(id).subscribe({
      next: () => {
        console.log('✅ Suppression réussie - ID:', id);

        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        console.log(`📊 Produits avant: ${initialLength}, après: ${this.products.length}`);

        this.loading = false;
        this.cdr.detectChanges();
        console.log('🎯 Vue mise à jour après suppression');
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        console.log('📊 Status de l\'erreur:', err.status);

        // Si status 200 ou 204, c'est un succès
        if (err.status === 200 || err.status === 204) {
          console.log('✅ Suppression réussie malgré l\'erreur de parsing');
          const initialLength = this.products.length;
          this.products = this.products.filter(p => p.id !== id);
          console.log(`📊 Produits avant: ${initialLength}, après: ${this.products.length}`);
          this.loading = false;
          this.cdr.detectChanges();
        } else {
          this.loading = false;
          this.error = 'Erreur lors de la suppression du produit';
          this.cdr.detectChanges();
          alert('Erreur lors de la suppression du produit. Veuillez réessayer.');
        }
      }
    });
  }
}
