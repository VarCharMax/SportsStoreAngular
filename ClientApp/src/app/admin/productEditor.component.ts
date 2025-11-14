import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormControl,
  FormControlStatus,
  FormGroup,
  FormsModule,
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
  imports: [FormsModule, ReactiveFormsModule],
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
    this.product = this.repo.getProductCached();

    if (this.product != undefined) {
      this.productForm.setValue({
        name: this.product.name ?? null,
        category: this.product.category ?? null,
        description: this.product.description ?? null,
        price:
          this.product.price == null
            ? ''
            : this.product.price.toString().replace('$', ''),
        supplier: this.product.supplier?.supplierId!.toString() ?? null,
      });
    } else {
      this.product = new Product();
    }

    /*
    this.productForm.valueChanges.subscribe((prod) => {
      this.product!.name = prod.name ?? undefined;
      this.product!.category = prod.category ?? undefined;
      this.product!.description = prod.description ?? undefined;
      this.product!.supplier!.supplierId =
        prod.supplier == '' ? 0 : parseInt(prod.supplier!);
      this.product!.price = prod.price == '' ? 0 : parseInt(prod.price!.replace('$', ''));
    });
*/

    this.productForm.statusChanges.subscribe((status: FormControlStatus) => {
      if (status === 'VALID') {
        this.product = new Product();
        this.product.name = this.productForm.controls.name.value!;
        this.product!.category = this.productForm.controls.category.value!;
        this.product!.description = this.productForm.controls.description.value!;
        this.product!.supplier!.supplierId =
          this.productForm.controls.supplier.value! == ''
            ? 0
            : parseInt(this.productForm.controls.supplier.value!);
        this.product!.price =
          this.productForm.controls.price.value == ''
            ? 0
            : parseInt(this.productForm.controls.price.value!.replace('$', ''));

        this.newProductEvent.emit(this.product);
        this.formStatus == '';
      } else if (this.formStatus == '' && status === 'INVALID') {
        this.product = undefined;
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
