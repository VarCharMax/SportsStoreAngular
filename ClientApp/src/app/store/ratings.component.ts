import { Component, Input } from "@angular/core";
import { Product } from "../models/product.model";

@Component({
    selector: "store-ratings",
    templateUrl: "ratings.component.html"
})
export class RatingsComponent {
    @Input()
    product: Product | undefined = undefined;
}
