import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GiftCardOrderTypes } from '../types/employee';
import { userDetailsResponse } from '../types/types';

interface FormData {
    amount: string;
    quantity: string;
    orderType: GiftCardOrderTypes;
}

interface QuantityUpdate {
    quantity: string;
}

interface ProductData {
    product_id?: string;
    product_image?: string;
    product_name?: string;
    id?: number;
}
interface SelectedEmployee {
    receiverFirstName: string;
    receiverEmail: string;
}
interface AddressData {
    receiverFirstName: string;
    // receiverLastName: string;
    // gender: string;
    receiverEmail: string;
    // receiverMobile: string;
    // postcode: string;
    senderName: string;
    // senderEmail: string;
    message: string;
    employee: SelectedEmployee[];
}

const initialState = {
    formDetails: {
        quantity: '',
        amount: '',
        product: '',
        orderType: GiftCardOrderTypes.BUYFOROTHER,
    },

    productDetails: {
        product_id: '',
        product_image: '',
        product_name: '',
        id: 0,
    },

    addressDetails: {
        employee: [{}],
        receiverFirstName: '',
        receiverLastName: '',
        gender: '',
        receiverEmail: '',
        receiverMobile: '',
        postcode: '',
        senderName: '',
        senderEmail: '',
        message: '',
    },
    userDetails: {
        addressId: 0,
        addressLine1: '',
        addressLine2: '',
        userName: '',
        userEmail: '',
        userCountry: '',
    },
};

const checkoutSlice = createSlice({
    name: 'giftCardCheckout',
    initialState,
    reducers: {
        setFormData: (state, action: PayloadAction<FormData>) => {
            state.formDetails = { ...state.formDetails, ...action.payload };
            const { quantity, amount } = state.formDetails;
            const product = parseInt(quantity, 10) * parseFloat(amount);
            state.formDetails.product = product.toString();
        },

        setUpdateQuantity: (state, action: PayloadAction<QuantityUpdate>) => {
            state.formDetails = { ...state.formDetails, ...action.payload };
            const { quantity, amount } = state.formDetails;
            const product = parseInt(quantity, 10) * parseFloat(amount);
            state.formDetails.product = product.toString();
        },

        setProductData: (state, action: PayloadAction<ProductData>) => {
            state.productDetails = { ...state.productDetails, ...action.payload };
        },

        setAddressData: (state, action: PayloadAction<AddressData>) => {
            state.addressDetails = { ...state.addressDetails, ...action.payload };
        },
        setUserDetails: (state, action: PayloadAction<userDetailsResponse | undefined>) => {
            state.userDetails = { ...state.userDetails, ...action.payload };
        },
    },
});

export const { setFormData, setProductData, setAddressData, setUserDetails, setUpdateQuantity } =
    checkoutSlice.actions;
export default checkoutSlice.reducer;
