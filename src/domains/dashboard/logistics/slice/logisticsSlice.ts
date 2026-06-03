import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { Address, shipmentDetailsMin, shippingAmount } from '../types';

const initialState = {
    originAddress: {
        Line1: '',
        Line2: '',
        Line3: '',
        City: 'Dubai',
        PostCode: '',
        CountryCode: 'AE',
        Description: '',
    },
    destinationAddress: {
        Line1: '',
        Line2: '',
        Line3: '',
        City: '',
        CountryCode: '',
        PostCode: '',
        Longitude: 0,
        Latitude: 0,
        Description: '',
    },
    shipmentDetails: {
        actualWeight: '0',
        numberOfPieces: 1,
        productGroup: 'DOM',
        productType: '',
        customsValueAmount: 0,
        quantity: 1,
        shipmentContent: '',
    },
    shippingAmount: {
        TotalAmount: 0,
        TotalAmountBeforeTax: 0,
        TaxAmount: 0,
        type: '',
    },
    isComingFromDetails: false,
};

const logisticsSlice = createSlice({
    name: 'logistics',
    initialState,
    reducers: {
        setOriginAddress: (state, action: PayloadAction<Partial<Address>>) => {
            state.originAddress = { ...state.originAddress, ...action.payload };
        },
        setDestinationAddress: (state, action: PayloadAction<Partial<Address>>) => {
            state.destinationAddress = { ...state.destinationAddress, ...action.payload };
        },
        setShipmentDetails: (state, action: PayloadAction<Partial<shipmentDetailsMin>>) => {
            state.shipmentDetails = { ...state.shipmentDetails, ...action.payload };
        },
        setShippingAmount: (state, action: PayloadAction<Partial<shippingAmount>>) => {
            state.shippingAmount = { ...state.shippingAmount, ...action.payload };
        },
        setIsComingFromDetails: (state, action: PayloadAction<boolean>) => {
            state.isComingFromDetails = action.payload;
        },

        resetLogisticsDataState: () => initialState,
    },
});

export const {
    setOriginAddress,
    setDestinationAddress,
    setShipmentDetails,
    setShippingAmount,
    resetLogisticsDataState,
    setIsComingFromDetails,
} = logisticsSlice.actions;
export default logisticsSlice.reducer;
