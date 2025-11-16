import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormControlStatus,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { currencyValidator } from '../helpers/CurrencyValidator';
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
  private formStatus: string = '';

  @Output() newProductEvent = new EventEmitter<Product>();

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    supplier: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, currencyValidator()]),
  });

  constructor() {}

  ngOnInit() {
    // Will be object for edit, undefined for new.
    this.product = this.repo.getProductCached() || new Product();

    if (this.product.isValid() == true) {
      this.productForm.setValue({
        name: this.product.name!,
        category: this.product.category!,
        description: this.product.description!,
        price: this.product.price!.toString(),
        supplier: this.product.supplier!.supplierId!.toString() ?? null,
      });
    }

    // Save will be disabled for new product.
    this.newProductEvent.emit(this.product);

    this.productForm.statusChanges.subscribe((status: FormControlStatus) => {
      this.product!.productId = this.product?.productId;
      this.product!.name = this.productForm.controls.name.value!;
      this.product!.category = this.productForm.controls.category.value!;
      this.product!.description = this.productForm.controls.description.value!;
      this.product!.supplier!.supplierId = parseInt(
        this.productForm.controls.supplier.value!,
      );
      this.product!.price = parseInt(
        this.productForm.controls.price.value!.replace('$', ''),
      );
      if (status == 'VALID') {
        this.newProductEvent.emit(this.product);
        this.formStatus = '';
      } else if (this.formStatus == '' && status === 'INVALID') {
        this.newProductEvent.emit(this.product);
        this.formStatus = status;
      }
    });
  }

  get suppliers(): Supplier[] {
    return this.repo.getSuppliersCached();
  }

  compareSuppliers(s1: Supplier, s2: Supplier) {
    return s1 && s2 && s1.name == s2.name;
  }
}
