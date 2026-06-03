import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RecipientDetails, InvoiceDetails, ProductDetail, PaymentDetails } from '../types/index';

interface InvoicesState {
    step: number;
    recipientDetails: RecipientDetails;
    invoiceDetails: InvoiceDetails;
    productDetails: ProductDetail[];
    paymentDetails: PaymentDetails;
    comments: string;
    termsConditions: string;
    loading: boolean;
    error: string | null;
    Details: any;
    invoiceId: number;
    trackerData: any;
    paymentLink: string;
    invoiceResponse: any;
    paymentLinkForm: any;
    paymentLinkPayload: any;
    kybStatus: 'PENDING' | 'INITIATED' | 'DOCUMENT UPLOADED' | 'APPROVED' | 'REJECTED';
    kybRejectReason: string;
}

const initialRecipientDetails: RecipientDetails = {
    billerName: '',
    billerEmail: '',
    billerCompanyAddress: '',
    billerPhone: 0,
    billerGST: '',
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerPhone: '',
    logo: {
        imageBase: '',
        imageFormat: '',
    },
};

const initialInvoiceDetails: InvoiceDetails = {
    invoiceDate: null,
    invoiceNo: '',
    dueDate: null,
};

const initialProductDetails: ProductDetail[] = [
    { amount: '', discount: '', item: '', price: '', quantity: '', vat: '' },
];

const initialPaymentDetails: PaymentDetails = {
    subTotal: '',
    total: '',
    vat: '',
    discount: '',
    shipping: '',
    amountDue: '',
};

const initialState: InvoicesState = {
    step: 1,
    recipientDetails: initialRecipientDetails,
    invoiceDetails: initialInvoiceDetails,
    productDetails: initialProductDetails,
    paymentDetails: initialPaymentDetails,
    comments: '',
    termsConditions: '',
    loading: false,
    error: null,
    Details: {},
    invoiceId: 0,
    trackerData: {},
    paymentLink: '',
    invoiceResponse: {},
    paymentLinkForm: {},
    paymentLinkPayload: {},
    kybStatus: 'PENDING',
    kybRejectReason: '',
};

const invoicesSlice = createSlice({
    name: 'invoices',
    initialState,
    reducers: {
        nextStep: state => {
            state.step += 1;
        },
        previousStep: state => {
            state.step -= 1;
        },
        setRecipientDetails: (state, action: PayloadAction<RecipientDetails>) => {
            state.recipientDetails = { ...state.recipientDetails, ...action.payload };
        },
        setInvoiceDetails: (state, action: PayloadAction<InvoiceDetails>) => {
            state.invoiceDetails = { ...state.invoiceDetails, ...action.payload };
        },
        setProductDetails: (state, action: PayloadAction<ProductDetail[]>) => {
            state.productDetails = action.payload;
        },
        setPaymentDetails: (state, action: PayloadAction<PaymentDetails>) => {
            state.paymentDetails = { ...state.paymentDetails, ...action.payload };
        },
        setComments: (state, action: PayloadAction<string>) => {
            state.comments = action.payload;
        },
        setTermsConditions: (state, action: PayloadAction<string>) => {
            state.termsConditions = action.payload;
        },
        fetchInvoiceStart: state => {
            state.loading = true;
            state.error = null;
        },
        fetchInvoiceSuccess: state => {
            state.loading = false;
            state.error = null;
        },
        fetchInvoiceFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        resetState: state => {
            state.recipientDetails = initialRecipientDetails;
        },
        setDetails: (state, action: PayloadAction<any>) => {
            state.Details = action.payload;
        },
        resetDetails: state => {
            state.Details = initialState.Details;
            return state;
        },
        setInvoiceId: (state, action: PayloadAction<any>) => {
            state.invoiceId = action.payload;
        },
        setTrackerData: (state, action: PayloadAction<any>) => {
            state.trackerData = action.payload;
        },
        setPaymentLink: (state, action: PayloadAction<any>) => {
            state.paymentLink = action.payload;
        },
        setInvoiceResponse: (state, action: PayloadAction<any>) => {
            state.invoiceResponse = action.payload;
        },
        setpaymentLinkForm: (state, action: PayloadAction<any>) => {
            state.paymentLinkForm = action.payload;
        },
        setpaymentLinkPayload: (state, action: PayloadAction<any>) => {
            state.paymentLinkPayload = action.payload;
        },
        setpaymentLinkKybStatus: (state, action: PayloadAction<any>) => {
            state.kybStatus = action.payload.kybStatus;
            state.kybRejectReason = action.payload.rejectReason;
        },
    },
});

export const {
    nextStep,
    previousStep,
    setRecipientDetails,
    setInvoiceDetails,
    setProductDetails,
    setPaymentDetails,
    setComments,
    setTermsConditions,
    fetchInvoiceStart,
    fetchInvoiceSuccess,
    fetchInvoiceFailure,
    resetState,
    setDetails,
    setInvoiceId,
    setTrackerData,
    setPaymentLink,
    setInvoiceResponse,
    setpaymentLinkForm,
    resetDetails,
    setpaymentLinkPayload,
    setpaymentLinkKybStatus,
} = invoicesSlice.actions;

export default invoicesSlice.reducer;
