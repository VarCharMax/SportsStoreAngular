import { Component } from "@angular/core";
import { CartSummaryComponent } from "./cartSummary.component";
import { CategoryFilterComponent } from "./categoryFilter.component";
import { ProductListComponent } from "./productList.component";
import { PaginationComponent } from "./pagination.component";

@Component({
    selector: "store-products",
    templateUrl: "productSelection.component.html",
    imports: [
        CartSummaryComponent,
        CategoryFilterComponent,
        ProductListComponent,
        PaginationComponent
    ]
})
export class ProductSelectionComponent {

}
