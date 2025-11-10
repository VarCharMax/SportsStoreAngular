import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product.model';
import { Repository } from '../models/repository';
import { Supplier } from '../models/supplier.model';

@Component({
  selector: 'admin-product-editor',
  templateUrl: 'productEditor.component.html',
  imports: [FormsModule],
})
export class ProductEditorComponent {
  constructor(private repo: Repository) {}

  get product(): Product {
    return this.repo.getProductCached() || new Product();
  }

  get suppliers(): Supplier[] {
    return this.repo.getSuppliersCached();
  }

  compareSuppliers(s1: Supplier, s2: Supplier) {
    return s1 && s2 && s1.name == s2.name;
  }
}
