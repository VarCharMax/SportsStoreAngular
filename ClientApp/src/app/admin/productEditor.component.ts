import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { Repository } from '../models/repository';
import { Supplier } from '../models/supplier.model';

@Component({
  selector: 'admin-product-editor',
  templateUrl: 'productEditor.component.html',
  imports: [ReactiveFormsModule],
})
export class ProductEditorComponent implements OnInit {
  private repo: Repository = inject(Repository);
  private product: Product | undefined = undefined;
  private localProduct: {
    name?: string | null | undefined;
    description?: string | null;
    category?: string | null;
    supplier?: number | null;
  } = {
    name: null,
    category: null,
    description: null,
    supplier: null,
  };

  productForm = new FormGroup({
    name: new FormControl(''),
    category: new FormControl(''),
    supplier: new FormControl(''),
    description: new FormControl(''),
    price: new FormControl(''),
  });

  constructor() {}

  ngOnInit() {
    this.product = this.repo.getProductCached();

    if (this.product != undefined) {
      this.productForm.setValue({
        name: this.product.name ?? null,
        category: this.product.category ?? null,
        description: this.product.description ?? null,
        price: this.product.price == null ? '' : this.product.price.toString(),
        supplier: this.product.supplier?.supplierId!.toString() ?? null,
      });
    }

    this.productForm.valueChanges.subscribe((prod) => {
      let product: Product = new Product();
      product.name = prod.name ?? undefined;
      product.category = prod.category ?? undefined;
      product.description = prod.description ?? undefined;
      product.supplier!.supplierId = prod.supplier == null ? 0 : parseInt(prod.supplier);
      this.repo.setProductCached(product);
    });
  }

  get suppliers(): Supplier[] {
    return this.repo.getSuppliersCached();
  }

  compareSuppliers(s1: Supplier, s2: Supplier) {
    return s1 && s2 && s1.name == s2.name;
  }
}
