import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { CartDetailsResponse } from '../types/cartTypes';

const initialState: CartDetailsResponse = {
    items: [],
    count: 0,
    cartId: 0,
    itemsTotalAmount: 0,
    allowCheckout: false,
    grandTotal: 0,
    totalVat: 0,
    eligibleFreeShipping: 0,
    freeDelivery: false,
    shippingCharge: 0,
};

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setData: (state, action: PayloadAction<Partial<CartDetailsResponse>>) => {
            state = { ...state, ...action.payload };
            return state;
        },
    },
});

export const { setData } = cartSlice.actions;

export default cartSlice.reducer;
