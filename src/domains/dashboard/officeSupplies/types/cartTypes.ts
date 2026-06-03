export interface CartProduct {
    id: number;
    image: string;
    description: string;
    price: string;
    category: string;
    savePrice: string;
    quantity: number;
    cancellationTime?: string;
}

export type CartData = {
    items: CartItem[];
    count: number;
    cartId: number;
    itemsTotalAmount: number;
    allowCheckout: boolean;
    grandTotal: number;
    totalVat: number;
};
export type CartItem = {
    id: number;
    name: string;
    SKUCode: string;
    price: number;
    productImage: string;
    brand: string;
    VAT: string;
    vatType: string;
    productQuantity: number;
    totalPrice: number;
    totalVat: number;
    productQuantityInDB: number;
};

export type CartDetails = {
    count: number;
    cartId: number;
    itemsTotalAmount: number;
    allowCheckout: boolean;
    grandTotal: number;
    totalVat: number;
};

export type CartDetailsPayload = {
    userId: number;
    userType: string;
};

export type CartDetailsResponse = {
    items: CartItem[];
    count: number;
    cartId: number;
    itemsTotalAmount: number;
    allowCheckout: boolean;
    grandTotal: number;
    totalVat: number;
    shippingCharge: number;
    freeDelivery: boolean;
    eligibleFreeShipping: number;
};

export type AddToCartRequestPayload = {
    userId: number;
    userType: string;
    productQuantity: number;
    productId: number;
};

export type AddToCartRequestResponse = {
    status: 'added' | 'updated';
    newCartProduct: true | 'duplicate';
};

export type DeleteFromCartRequestPayload = {
    userId: number;
    userType: string;
    productId: number;
};
export type DeleteFromCartResponse = {};

export type updateCartRequestPayload = {
    userId: number;
    userType: string;
    productQuantity: number;
    productId: number;
    operation: string;
};
export type updateFromCartResponse = {
    newCartProduct: {
        newQuantity: number;
    };
};
