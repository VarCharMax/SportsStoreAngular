import { Rating } from './rating.model';
import { Supplier } from './supplier.model';

export class Product {
  constructor(
    public productId?: number,
    public name?: string,
    public category?: string,
    public description?: string,
    public price?: number,
    public supplier?: Supplier,
    public ratings?: Rating[],
  ) {
    if (!this.supplier) {
      this.supplier = new Supplier();
    }
  }
  isValid(): boolean {
    return (
      this.name != undefined &&
      this.name.length > 0 &&
      this.category != undefined &&
      this.category.length > 0 &&
      this.description != undefined &&
      this.description.length > 0 &&
      this.price != undefined &&
      this.price > 0 &&
      this.supplier != undefined &&
      this.supplier.supplierId! > 0
    );
  }
}
