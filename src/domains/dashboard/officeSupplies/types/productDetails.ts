import { Product } from './products';

export type ProductImage = {
    id: number;
    productImageUrl: string;
    imageField: string;
    productId: number;
};

export type ProductDetailsPayload = {
    userId: number;
    userType: string;
    page: number;
    limit: number;
    productId: string;
};
export type ProductDetails = {
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
    status: boolean;
    discountType: string;
    discount: string;
    actualPrice: string;
    vendors: any[];
    features: any;
    createdAt: string;
    updatedAt: string;
    categoryId: number;
    category: {
        id: 36;
        categoryName: string;
        categoryImage: string;
        categoryStatus: true;
        createdAt: Date;
        updatedAt: Date;
        vendorId: Number;
    };
};

export type ProductDetailsResponse = {
    productDetails: ProductDetails;
    photos: ProductImage[];
    relatedProducts: {
        page: number;
        limit: number;
        count: number;
        products: Product[];
    };
};

export type ProductDetailsData = {
    productDetails: ProductDetails;
    images: ProductImage[];
    relatedProducts: Product[];
};
