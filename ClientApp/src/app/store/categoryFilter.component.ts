import { Component, inject } from "@angular/core";
// import { NavigationService } from '../models/navigation.service';
import { Repository } from "../models/repository";

@Component({
    selector: "store-categoryfilter",
    templateUrl: "categoryFilter.component.html"
})
export class CategoryFilterComponent {
    private repo: Repository = inject(Repository);

    constructor() { }
}
