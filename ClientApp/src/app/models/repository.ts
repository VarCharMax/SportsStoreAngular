import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Product } from './product.model';
import { Filter } from './configClasses.repository';
import { Supplier } from './supplier.model';

const productsUrl = 'api/products';
const suppliersUrl = 'api/suppliers';

@Injectable({
  providedIn: 'root'
}
)
export class Repository {
  private products: Product[] = [];
  private suppliers: Supplier[] = [];
  private product: Product = new Product();
  private supplier: Supplier = new Supplier();

  /*
  * productsChanged - called when list is added to or subtracted from.
  * productChanged - called when product changes state.
  * productChanged does not get called when product is created.
  * No method should call both events, as this this will lead to edit-warring over product.
  */

  productChanged: Subject<Product> = new Subject<Product>();
  productsChanged: Subject<Product[]> = new Subject<Product[]>();
  productRetrieved: Subject<Product> = new Subject<Product>();
  supplierChanged: Subject<Supplier> = new Subject<Supplier>();
  suppliersChanged: Subject<Supplier[]> = new Subject<Supplier[]>();
  errorsChanged: Subject<{ [label: string]: Array<string> }> = new Subject<{
    [label: string]: Array<string>;
  }>();
  filter: Filter = new Filter();

  constructor(private http: HttpClient) {
    // this.filter.category = "soccer";
    this.filter.related = true;
    //this.getProducts(true);
    this.getSuppliers();
  }

  getProductLocal(id: number): Product | undefined {
    return this.products.find((p) => p.productId == id);
  }

  getSupplierLocal(id: number): Supplier | undefined {
    return this.suppliers.find((s) => s.supplierId == id);
  }

  /*
  * Get collections
  */
  getProducts(related = false): void {

    let url = `${productsUrl}?related=${this.filter.related}`;

    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }

    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }

    this.http.get<Product[]>(url).subscribe({
      next: (p) => {

        this.products = [];

        p.forEach(prod => {
          let newProduct: Product = new Product(
            prod.productId,
            prod.name,
            prod.category,
            prod.description,
            prod.price,
            prod.supplier,
            prod.ratings
          );

          this.products.push(newProduct);
        });

        this.productsChanged.next(this.products.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  /*
  * Get entity
  */
  getProduct(id: number): void {
    this.http.get<Product>(`${productsUrl}/${id}`).subscribe({
      next: (prod) => {

        this.product = new Product(
          prod.productId,
          prod.name,
          prod.category,
          prod.description,
          prod.price,
          prod.supplier,
          prod.ratings
        );

        this.productRetrieved.next(this.product);
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  /*
  * Add entity
  */
  createProduct(prod: Product): void {

    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      supplierId: prod.supplier ? prod.supplier.supplierId : 0
    };

    this.http.post<number>(productsUrl, data).subscribe({
      next: (id) => {

        let supplier: Supplier | undefined = undefined;

        if (prod.supplier) {
          let index = this.suppliers.findIndex((s) => s.supplierId === prod.supplier!.supplierId);
          if (index > -1) {
            supplier = this.suppliers[index];
          }
        }

        let newProduct: Product = new Product(
          id,
          prod.name,
          prod.category,
          prod.description,
          prod.price,
          supplier,
          prod.ratings);

        //Don't call change event on new product.
        this.product = newProduct
        this.products.push(newProduct);

        this.productsChanged.next(this.products.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  /*
  * Replace Entity
  */
  replaceProduct(product: Product): void {
    this.http.put<boolean>(`${productsUrl}/${product.productId}`, product).subscribe({
      next: (result) => {
        if (result == true) {

          let index = this.products.findIndex((t) => t.productId === product.productId);

          if (index !== -1) {
            let updateProduct: Product = new Product(
              product.productId,
              product.name,
              product.category,
              product.description,
              product.price,
              product.supplier,
              product.ratings
            );

            this.products[index] = updateProduct;

            this.productChanged.next(updateProduct);
          } else {
            this.errorsChanged.next({ Error: ["Update operation encountered an error"] });
          }
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  /*
  * Update entity
  */
  updateProduct(id: number, changes: Map<string, any>): void {
    let patch: { op: string; path: string; value: any }[] = [];

    // Define the patch operations. All are 'replace' operations.
    changes.forEach((value, key) =>
      patch.push({ op: 'replace', path: key, value: value })
    );

    this.http.patch<boolean>(`${productsUrl}/${id}`, patch).subscribe({
      next: (result) => {
        if (result == true) {
          let index = this.products.findIndex((t) => t.productId === id);
          if (index !== -1) {
            let product = this.products[index];

            //Apply patch locally.
            changes.forEach((value, key) => {
              (product as any)[key] = value;
            });

            this.productChanged.next(product);
          } else {
            this.errorsChanged.next({
              Error: ['Update operation encountered an error'],
            });
          }
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  deleteProduct(id: number): void {
    this.http.delete<boolean>(`${productsUrl}/${id}`).subscribe({
      next: (result) => {
        if (result === true) {
          this.products = this.products.filter((i) => i.productId != id).slice();
          this.productsChanged.next(this.products.slice());
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  createProductAndSupplier(prod: Product, supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state
    };

    this.http.post<number>(suppliersUrl, supp).subscribe({
      next: (id) => {
        supp.supplierId = id;
        prod.supplier = supp;

        this.suppliers.push(supp);
        this.suppliersChanged.next(this.suppliers.slice());

        if (prod != null) {
          this.createProduct(prod);
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }

  getSuppliers() {
    this.http.get<Supplier[]>(suppliersUrl).subscribe({
      next: (s) => {
        this.suppliers = [];

        s.forEach((sup) => {
          let supplier = new Supplier(
            sup.supplierId,
            sup.name,
            sup.city,
            sup.state,
            sup.products
          );

          this.suppliers.push(supplier);
        });

        this.suppliersChanged.next(this.suppliers.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      }
    });
  }
}
