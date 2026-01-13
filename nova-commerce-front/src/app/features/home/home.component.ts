import { Component, OnInit, OnDestroy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PublicProductService } from '../products/services/public-product.service';
import { Product } from '../products/models/product.model';

/**
 * HomeComponent
 *
 * Página de inicio (home) de la aplicación.
 * Muestra productos públicos sin requerir autenticación.
 * Punto de entrada principal cuando el usuario accede a la raíz.
 *
 * CARACTERÍSTICAS:
 * - Accesible sin autenticación (como Mercado Libre)
 * - Carga productos del endpoint público
 * - Diseño responsivo con hero section
 * - Grilla de productos con información básica
 *
 * ETAPA 7: Agregada visualización de productos públicos
 */
@Component({
  selector: 'nc-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly publicProductService = inject(PublicProductService);
  private readonly cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  loading = true;
  error: string | null = null;

  // Carousel configuration
  currentSlide = 0;
  carouselSlides = [
    {
      title: '¡Bienvenido a NovaCommerce!',
      description: 'La mejor plataforma de e-commerce de América Latina',
      buttonText: 'Explorar Productos',
      buttonLink: '/products',
    },
    {
      title: 'Envíos Gratis',
      description: 'En compras superiores a $50.000',
      buttonText: 'Ver Ofertas',
      buttonLink: '/products',
    },
    {
      title: 'Productos Digitales',
      description: 'Descarga inmediata de tus compras',
      buttonText: 'Ver Catálogo Digital',
      buttonLink: '/products',
    },
    {
      title: 'Pago Seguro',
      description: 'Múltiples métodos de pago disponibles',
      buttonText: 'Más Información',
      buttonLink: '/products',
    },
    {
      title: 'Ofertas Especiales',
      description: 'Hasta 50% de descuento en productos seleccionados',
      buttonText: 'Ver Ofertas',
      buttonLink: '/products',
    },
  ];

  private carouselInterval: any;

  ngOnInit(): void {
    this.loadPublicProducts();
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  /**
   * Inicia el carrusel automático
   */
  private startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
      this.cdr.detectChanges();
    }, 5000); // Cambia cada 5 segundos
  }

  /**
   * Avanza al siguiente slide
   */
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselSlides.length;
  }

  /**
   * Retrocede al slide anterior
   */
  prevSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.carouselSlides.length) %
      this.carouselSlides.length;
  }

  /**
   * Va a un slide específico
   */
  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  /**
   * Maneja error de carga de imagen
   */
  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f0f0f0" width="200" height="200"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14"%3ESin imagen%3C/text%3E%3C/svg%3E';
  }

  /**
   * Carga los productos públicos del endpoint
   */
  private loadPublicProducts(): void {
    this.loading = true;
    this.error = null;
    this.cdr.markForCheck();
    // Use microtask to ensure loading is true during initial change detection in tests
    this.publicProductService.getPublicProducts().subscribe({
      next: (products) => {
        // Always update on next microtask so loading remains true during initial change detection
        Promise.resolve().then(() => {
          console.log('Productos recibidos:', products);
          this.products = products;
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        Promise.resolve().then(() => {
          console.error('Error al cargar productos públicos:', err);
          this.error = 'No se pudieron cargar los productos. Intenta más tarde.';
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
    });
  }
}
