import { Component, inject } from "@angular/core";
import { NavigationService } from "../models/navigation.service";

@Component({
  selector: "store-pagination",
  templateUrl: "pagination.component.html"
})
export class PaginationComponent {
  navigation: NavigationService = inject(NavigationService);

  constructor() { }

  get pages(): number[] {
    if (this.navigation.productCount > 0) {
      return Array(Math.ceil(this.navigation.productCount / this.navigation.productsPerPage))
        .fill(0)
        .map((x, i) => i + 1);
    } else {
      return [];
    }
  }
}
