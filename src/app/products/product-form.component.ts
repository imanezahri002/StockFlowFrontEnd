import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../shared/components/layout/layout.component';
import { ProductService } from '../core/services/products/product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LayoutComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product = {
    sku: '',
    name: '',
    category: '',
    active: true,
    originalPrice: 0,
    profit: 0
  } as Product;

  isEditMode = false;
  loading = false;
  error: string | null = null;
  userName = 'Admin User';
  userRole: 'admin' = 'admin';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('🚀 Initialisation du formulaire product');

    const id = this.route.snapshot.params['id'];
    console.log('🔍 Paramètre ID de la route:', id);

    if (id) {
      this.isEditMode = true;
      console.log('✏️ MODE ÉDITION activé pour ID:', id);
      this.loadProduct(+id);
    } else {
      console.log('➕ MODE CRÉATION activé');
    }
  }

  loadProduct(id: number): void {
    console.log('📥 Chargement du produit ID:', id);
    this.loading = true;
    this.error = null;

    this.cdr.detectChanges();

    this.productService.getById(id).subscribe({
      next: (data) => {
        console.log('✅ Produit chargé:', data);
        this.product = data;
        this.loading = false;

        this.cdr.detectChanges();

        console.log('📋 Formulaire pré-rempli:', this.product);
        console.log('🔓 Loading =', this.loading, '- Inputs débloqués');
      },
      error: (err) => {
        console.error('❌ Erreur lors du chargement du produit:', err);
        this.error = 'Impossible de charger le produit';
        this.loading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/products']);
        }, 2000);
      }
    });
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.loading = true;
    this.error = null;

    const operation = this.isEditMode
      ? this.productService.update(this.product.id!, this.product)
      : this.productService.create(this.product);

    operation.subscribe({
      next: () => {
        console.log('✅ Produit sauvegardé avec succès');
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la sauvegarde:', err);
        this.error = 'Erreur lors de la sauvegarde du produit';
        this.loading = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.product.name || this.product.name.trim() === '') {
      this.error = 'Le nom du produit est requis';
      return false;
    }
    if (this.product.name.trim().length < 3) {
      this.error = 'Le nom du produit doit contenir au moins 3 caractères';
      return false;
    }
    if (!this.product.sku || this.product.sku.trim() === '') {
      this.error = 'Le SKU est requis';
      return false;
    }
    if (this.product.sku.trim().length < 3) {
      this.error = 'Le SKU doit contenir au moins 3 caractères';
      return false;
    }
    return true;
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  deleteProduct(): void {
    if (!this.isEditMode || !this.product.id) {
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer le produit "${this.product.name}" ?`)) {
      console.log('❌ Suppression annulée par l\'utilisateur');
      return;
    }

    console.log('🗑️ Suppression du produit ID:', this.product.id);
    this.loading = true;
    this.error = null;

    this.productService.delete(this.product.id).subscribe({
      next: () => {
        console.log('✅ Produit supprimé avec succès');
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('❌ Erreur lors de la suppression:', err);
        console.log('📊 Status de l\'erreur:', err.status);

        if (err.status === 200 || err.status === 204) {
          console.log('✅ Suppression réussie malgré l\'erreur de parsing');
          this.loading = false;
          this.router.navigate(['/products']);
        } else {
          this.error = 'Erreur lors de la suppression du produit';
          this.loading = false;
          this.cdr.detectChanges();
        }
      }
    });
  }
}

