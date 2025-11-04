import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Repository } from "../models/repository";

@Component({
  selector: "category-filter",
  templateUrl: "categoryFilter.component.html"
})
export class CategoryFilterComponent implements OnInit, OnDestroy {
  public chessCategory = "chess";
  private repo: Repository = inject(Repository);

  constructor() { }

  ngOnInit() {

  }

  setCategory(category: string | undefined) {
    this.repo.filter.category = category;
    this.repo.getProducts();
  }

  ngOnDestroy() {

  }

}
