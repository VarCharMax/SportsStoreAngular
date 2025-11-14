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
  ) {}
}
