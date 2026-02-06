import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppState } from '../../store';
import * as ProductsActions from '../../store/products/products.actions';
import * as ProductsSelectors from '../../store/products/products.selectors';
import { Product } from '../../models/product.model';
import { ProductsQuery, ProductsError } from '../../store/products/products.state';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.html',
  styleUrls: ['./products-list.css']
})
export class ProductsListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  // 🔹 Observables du store
  products$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<ProductsError | null>;
  query$!: Observable<ProductsQuery>;
  totals$!: Observable<{ totalElements: number; totalPages: number }>;

  // 🔹 Variables locales pour les filtres
  searchText = '';
  selectedCategory = '';
  selectedSize = 10;
  currentPage = 0;
  currentQuery: ProductsQuery | null = null;

  // 🔹 Options
  pageSizeOptions = [10, 20, 50];
  categories = ['Ordinateurs', 'Périphériques', 'Accessoires', 'Logiciels'];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    console.log('🎬 ProductsListComponent initialisé');

    // 🔹 Initialiser les observables
    this.products$ = this.store.select(ProductsSelectors.selectProductsItems);
    this.loading$ = this.store.select(ProductsSelectors.selectProductsLoading);
    this.error$ = this.store.select(ProductsSelectors.selectProductsError);
    this.query$ = this.store.select(ProductsSelectors.selectProductsQuery);
    this.totals$ = this.store.select(ProductsSelectors.selectProductsTotals);

    // 🔹 S'abonner à la query pour synchroniser les filtres
    this.query$
      .pipe(takeUntil(this.destroy$))
      .subscribe(query => {
        this.currentQuery = query;
        this.searchText = query.search || '';
        this.selectedCategory = query.category || '';
        this.selectedSize = query.size;
        this.currentPage = query.page;
      });

    // 🔹 Gérer la recherche avec debounce
    this.searchSubject$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(search => {
        this.updateQuery({ search, page: 0 });
      });

    // 🔹 Charger les produits initialement
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 🔹 Charger les produits
  loadProducts(): void {
    if (!this.currentQuery) return;

    console.log('📦 Chargement des produits avec query:', this.currentQuery);
    this.store.dispatch(ProductsActions.loadProducts({ query: this.currentQuery }));
  }

  // 🔹 Mettre à jour la query
  updateQuery(partialQuery: Partial<ProductsQuery>): void {
    console.log('🔧 Mise à jour query:', partialQuery);
    this.store.dispatch(ProductsActions.setQuery({ partialQuery }));

    // Attendre que le state soit mis à jour puis charger
    setTimeout(() => this.loadProducts(), 50);
  }

  // 🔹 Recherche
  onSearchChange(search: string): void {
    this.searchSubject$.next(search);
  }

  // 🔹 Changement de catégorie
  onCategoryChange(category: string): void {
    this.updateQuery({ category, page: 0 });
  }

  // 🔹 Changement de taille de page
  onPageSizeChange(size: number): void {
    this.updateQuery({ size, page: 0 });
  }

  // 🔹 Navigation pagination
  goToPage(page: number): void {
    this.updateQuery({ page });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(totalPages: number): void {
    if (this.currentPage < totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // 🔹 Réinitialiser les filtres
  resetFilters(): void {
    console.log('🔄 Réinitialisation des filtres');
    this.store.dispatch(ProductsActions.resetQuery());
    setTimeout(() => this.loadProducts(), 50);
  }

  // 🔹 Effacer l'erreur
  clearError(): void {
    this.store.dispatch(ProductsActions.clearError());
  }

  // 🔹 Voir les détails d'un produit
  viewProduct(product: Product): void {
    console.log('👁️ Voir produit:', product);
    // TODO: Navigation vers la page de détail
  }

  // 🔹 Générer les numéros de page
  getPageNumbers(totalPages: number): number[] {
    const pages: number[] = [];
    const maxPages = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(0, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}

