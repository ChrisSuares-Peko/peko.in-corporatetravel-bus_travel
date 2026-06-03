import { Category } from './category';

export type ProductCardProps = {
    image: string;
    name: string;
    price: string;
    actualPrice: string;
    category: string;
    savePrice: string;
    id: number;
    quantity?: number;
};
export type Product = {
    id: number;
    brand: string;
    name: string;
    description: string;
    highlights: string;
    SKUCode: string;
    productImage: string;
    price: string;
    vendorPrice: string;
    VAT: string;
    vatType: string;
    quantity: number;
    warranty: string;
    status: number;
    discountType: string;
    discount: string;
    actualPrice: string;
    vendors: string[];
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    category: Category;
};
export type ProductListPayload = {
    userId: number;
    userType: string;
    offset: number;
    limit: number;
    searchText: string;
    catIds?: number | string;
    sortBy: string;
};

export type ProductListResponse = {
    count: number;
    rows: Product[];
};
export type useFilterCommon = {
    searchText: string;
    page: number;
    itemsPerPage: number;
    partnerId?: string | number;
    sort?: 'ASC' | 'DESC';
    sortField?: string;
    from?: string;
    to?: string;
    corporateId?: string | number;
    category?: string | number;
};
export type filterState = {
    type?: string;
    title?: string;
    searchText: string;
    category: string;
    sort: string;
    page: number;
    itemsPerPage: number;
    filter: string;
    from: string;
    to: string;
    sortField: string;
};
