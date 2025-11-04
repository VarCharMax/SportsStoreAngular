import { Component, inject } from '@angular/core';
import { Repository } from "../models/repository";

@Component({
  selector: "category-filter",
  templateUrl: "categoryFilter.component.html"
})
export class CategoryFilterComponent {
  public chessCategory = "chess";
  private repo: Repository = inject(Repository);

  constructor() { }

  setCategory(category: string | undefined) {
    this.repo.filter.category = category;
    this.repo.getProducts();
  }
}
