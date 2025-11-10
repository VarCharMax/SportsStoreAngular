import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Filter, Pagination } from './configClasses.repository';
import { Order, OrderConfirmation } from './order.model';
import { Product } from './product.model';
import { Supplier } from './supplier.model';

const productsUrl = 'api/products';
const suppliersUrl = 'api/suppliers';
const sessionUrl = 'api/session';
const ordersUrl = 'api/orders';

type productsMetadata = {
  data: Product[];
  categories: string[];
};

@Injectable({
  providedIn: 'root',
})
export class Repository {
  private products: Product[] = [];
  private product: Product = new Product();
  private categories: string[] = [];
  private suppliers: Supplier[] = [];
  private supplier: Supplier = new Supplier();
  private orders: Order[] = [];

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
  ordersChanged: Subject<Order[]> = new Subject<Order[]>();
  errorsChanged: Subject<{ [label: string]: Array<string> }> = new Subject<{
    [label: string]: Array<string>;
  }>();
  filter: Filter = new Filter();
  paginationObject = new Pagination();

  constructor(private http: HttpClient) {
    this.filter.related = true;
    this.getSuppliersAsync();
  }

  storeSessionData<T>(dataType: string, data: T) {
    return this.http.post(`${sessionUrl}/${dataType}`, data).subscribe((response) => {}); // Forces HttpClient to send request.
  }

  getSessionData<T>(dataType: string): Observable<T> {
    return this.http.get<T>(`${sessionUrl}/${dataType}`);
  }

  getCategoriesCached(): string[] {
    return this.categories.slice();
  }

  getProductsCached(): Product[] {
    return this.products.slice();
  }

  getProductCached(): Product | undefined {
    return this.product;
  }

  getSuppliersCached(): Supplier[] {
    return this.suppliers.slice();
  }

  getSupplierCached(id: number): Supplier | undefined {
    return this.suppliers.find((s) => s.supplierId == id);
  }

  getOrdersCached(): Order[] {
    return this.orders;
  }

  /*
   * Get collections async.
   */

  getOrdersAsync() {
    this.http.get<Order[]>(ordersUrl).subscribe({
      next: (data) => {
        this.orders = data;
        this.ordersChanged.next(this.orders.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  createOrder(order: Order) {
    this.http
      .post<OrderConfirmation>(ordersUrl, {
        name: order.name,
        address: order.address,
        payment: order.payment,
        products: order.products,
      })
      .subscribe({
        next: (data) => {
          order.orderConfirmation = data;
          order.cart.clear();
          order.clear();
        },
        error: (e) => {
          this.errorsChanged.next(e.error?.errors || e.error);
        },
      });
  }

  shipOrder(order: Order) {
    this.http.post(`${ordersUrl}/${order.orderId}`, {}).subscribe({
      next: () => {
        this.getOrdersAsync();
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  getProductsAsync(): void {
    let url = `${productsUrl}?related=${this.filter.related}`;

    if (this.filter.category) {
      url += `&category=${this.filter.category}`;
    }

    if (this.filter.search) {
      url += `&search=${this.filter.search}`;
    }

    url += '&metadata=true';

    this.http.get<productsMetadata>(url).subscribe({
      next: (md) => {
        this.products = [];
        this.categories = [];

        md.data.forEach((prod) => {
          let newProduct: Product = new Product(
            prod.productId,
            prod.name,
            prod.category,
            prod.description,
            prod.price,
            prod.supplier,
            prod.ratings,
          );

          this.products.push(newProduct);
        });

        md.categories.forEach((cat) => {
          this.categories.push(cat);
        });

        this.productsChanged.next(this.products.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  /*
   * Get entity
   */
  getProductAsync(id: number): void {
    this.http.get<Product>(`${productsUrl}/${id}`).subscribe({
      next: (prod) => {
        this.product = new Product(
          prod.productId,
          prod.name,
          prod.category,
          prod.description,
          prod.price,
          prod.supplier,
          prod.ratings,
        );

        this.productRetrieved.next(this.product);
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  /*
   * Add entity
   */
  createProductAsync(prod: Product): void {
    let data = {
      name: prod.name,
      category: prod.category,
      description: prod.description,
      price: prod.price,
      supplierId: prod.supplier ? prod.supplier.supplierId : 0,
    };

    this.http.post<number>(productsUrl, data).subscribe({
      next: (id) => {
        let supplier: Supplier | undefined = undefined;

        if (prod.supplier) {
          let index = this.suppliers.findIndex(
            (s) => s.supplierId === prod.supplier!.supplierId,
          );
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
          prod.ratings,
        );

        //Don't call change event on new product.
        this.product = newProduct;
        this.products.push(newProduct);

        this.productsChanged.next(this.products.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  /*
   * Replace Entity
   */
  replaceProductAsync(product: Product): void {
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
              product.ratings,
            );

            this.products[index] = updateProduct;

            this.productChanged.next(updateProduct);
          } else {
            this.errorsChanged.next({ Error: ['Update operation encountered an error'] });
          }
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  /*
   * Update entity
   */
  updateProductAsync(id: number, changes: Map<string, any>): void {
    let patch: { op: string; path: string; value: any }[] = [];

    // Define the patch operations. All are 'replace' operations.
    changes.forEach((value, key) =>
      patch.push({ op: 'replace', path: key, value: value }),
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

  deleteProductAsync(id: number): void {
    this.http.delete<boolean>(`${productsUrl}/${id}`).subscribe({
      next: (result) => {
        if (result === true) {
          this.products = this.products.filter((i) => i.productId != id).slice();
          this.productsChanged.next(this.products.slice());
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  createProductAndSupplier(prod: Product, supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state,
    };

    this.http.post<number>(suppliersUrl, supp).subscribe({
      next: (id) => {
        supp.supplierId = id;
        prod.supplier = supp;

        this.suppliers.push(supp);
        this.suppliersChanged.next(this.suppliers.slice());

        if (prod != null) {
          this.createProductAsync(prod);
        }
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  getSuppliersAsync() {
    this.http.get<Supplier[]>(suppliersUrl).subscribe({
      next: (s) => {
        this.suppliers = [];

        s.forEach((sup) => {
          let supplier = new Supplier(
            sup.supplierId,
            sup.name,
            sup.city,
            sup.state,
            sup.products,
          );

          this.suppliers.push(supplier);
        });

        this.suppliersChanged.next(this.suppliers.slice());
      },
      error: (e) => {
        this.errorsChanged.next(e.error?.errors || e.error);
      },
    });
  }

  replaceSupplier(supp: Supplier) {
    let data = {
      name: supp.name,
      city: supp.city,
      state: supp.state,
    };

    this.http
      .put(`${suppliersUrl}/${supp.supplierId}`, data)
      .subscribe(() => this.getProductsAsync());
  }

  deleteSupplier(id: number) {
    this.http.delete(`${suppliersUrl}/${id}`).subscribe(() => {
      this.getProductsAsync();
      this.getSuppliersAsync();
    });
  }
}
