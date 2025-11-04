export class Filter {
    category?: string;
    search?: string;
    related: boolean = false;

    reset() {
        this.category = this.search = undefined;
        this.related = false;
    }
}

export class Pagination {
    productsPerPage: number = 4;
    currentPage = 1;
}
