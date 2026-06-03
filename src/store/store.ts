import { combineReducers, configureStore } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-extraneous-dependencies
import configureMockStore from 'redux-mock-store';
import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import bulkUploadCommon from '@domains/admin/manage/slices/bulkUpload';
import bulkProductsReducer from '@domains/admin/officeSupplies/slices/bulkProducts';
import { forgotpasswordReducer } from '@domains/auth/slices/forgotpasswordSlice';
import loginReducer from '@domains/auth/slices/loginSlice';
import passwordPolicyReducer from '@domains/auth/slices/passwordPolicySlice';
import registrationReducer from '@domains/auth/slices/registerSlice';
import airlinesFormReducer from '@domains/dashboard/Airline/slices/airlineSlice';
import beneficiaryReducer from '@domains/dashboard/billPayments/slices/beneficiary';
import billPaymentReducer from '@domains/dashboard/billPayments/slices/billPayment';
import giftcardCheckoutReducer from '@domains/dashboard/GiftCards/slices/checkoutSlice';
import getHotelReducer from '@domains/dashboard/Hotels/slices/getHotelSlice';
import invoicesReducer from '@domains/dashboard/Invoice/slices/InvoicesSlices';
import logisticsReducer from '@domains/dashboard/logistics/slice/logisticsSlice';
import supportReducer from '@domains/dashboard/needHelp/slices/supportSlice';
import planReducer from '@domains/dashboard/OfficeAddress/slices';
import cartReducer from '@domains/dashboard/officeSupplies/slices/cartSlice';
import paymentReducer from '@domains/dashboard/payments/slices/payment';
import addressReducer from '@domains/dashboard/profile/slices/address';
import bankReducer from '@domains/dashboard/profile/slices/bank';
import basicInfoReducer from '@domains/dashboard/profile/slices/basicInfo';
import companyInfoReducer from '@domains/dashboard/profile/slices/companyInfo';
import otpReducer from '@domains/dashboard/profile/slices/otpSlice';
import securityInfoReducer from '@domains/dashboard/profile/slices/securityInfo';
import subscriptionReducer from '@domains/dashboard/Subscriptions/slice/paymentSlice';
import whatsappBusinessReducer from '@domains/dashboard/WhatsappForBusiness/slices/paymentSlice';
import accountingReducer from '@src/domains/dashboard/accounting/slices/accountingSlice';
import corporateTravelReducer from '@src/domains/dashboard/CorporateTravel/slices/corporateTravel';
import documentAttestationReducer from '@src/domains/dashboard/DocumentAttestation/slice';
import eInvoicingReducer from '@src/domains/dashboard/EInvoicing/slices/eInvoicingSlice';
import eSignDocReducer from '@src/domains/dashboard/eSign/slices/eSignDocSlice';
import esimReducer from '@src/domains/dashboard/esim/slice/esimSlice';
import hikeReducer from '@src/domains/dashboard/Hike/slices/hikeSlice';
import orderDetailsReducer from '@src/domains/dashboard/officeSupplies/slices/orderDetailsSlice';
import employeeDetailsReducer from '@src/domains/dashboard/Payroll/slices/employeeDetailsSlice';
import employeeReducer from '@src/domains/dashboard/Payroll/slices/employeeSlices';
import BulkEmployeeUploadReducer from '@src/domains/dashboard/Payroll/slices/jsonSlice';
import payrollAuthReducer from '@src/domains/dashboard/Payroll/slices/payrollAuth';
import payrollSalaryReducer from '@src/domains/dashboard/Payroll/slices/payrollSalarySlice';
import vendorBeneficiaryReducer from '@src/domains/dashboard/vendorPayouts/slices/beneficiarySlices';
import workReducer from '@src/domains/dashboard/works/slices/orderDetailsSlice';
import chatReducer from '@src/slices/chatSlice';
// eslint-disable-next-line import/no-cycle
import connectReducer from '@src/slices/connectSlice';
import loaderReducer from '@src/slices/loaderSlice';
import servicesReducer from '@src/slices/servicesSlice';
import subscriptionsReducer from '@src/slices/subscriptionSlice';
import userReducer from '@src/slices/userSlice';

import apiReducer from '../slices/apiSlice';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: [
        'auth',
        'payment',
        'cart',
        'logistics',
        'subscription',
        'giftcardCheckout',
        'payrollAuth',
        'bulkProducts',
        'hotels',
        'airline',
        'esim',
        'BulkUpload',
        'accounting',
        'invoices',
        'whatsappBusiness',
        'eSignDoc',
        'employee',
        'freshChat',
        'billPayment',
        'corporateTravel',
        'eInvoicing',
    ],
};

const rootReducer = combineReducers({
    registration: registrationReducer,
    forgotpassword: forgotpasswordReducer,
    api: apiReducer,
    auth: loginReducer,
    logistics: logisticsReducer,
    cart: cartReducer,
    address: addressReducer,
    bank: bankReducer,
    basicInfo: basicInfoReducer,
    companyInfo: companyInfoReducer,
    otp: otpReducer,
    securityInfo: securityInfoReducer,
    BulkUpload: BulkEmployeeUploadReducer,
    subscription: subscriptionReducer,
    whatsappBusiness: whatsappBusinessReducer,
    corporateTravel: corporateTravelReducer,
    support: supportReducer,
    payment: paymentReducer,
    orderDetails: orderDetailsReducer,
    giftcardCheckout: giftcardCheckoutReducer,
    beneficiary: beneficiaryReducer,
    billPayment: billPaymentReducer,
    employee: employeeReducer,
    vendorBeneficiary: vendorBeneficiaryReducer,
    employeeDetails: employeeDetailsReducer,
    invoices: invoicesReducer,
    airline: airlinesFormReducer,
    plan: planReducer,
    payrollSalary: payrollSalaryReducer,
    user: userReducer,
    hotels: getHotelReducer,
    services: servicesReducer,
    documentAttestation: documentAttestationReducer,
    eInvoicing: eInvoicingReducer,
    payrollAuth: payrollAuthReducer,
    bulkProducts: bulkProductsReducer,
    esim: esimReducer,
    bulkUploadData: bulkUploadCommon,
    accounting: accountingReducer,
    hike: hikeReducer,
    works: workReducer,
    subscriptions: subscriptionsReducer,
    passwordPolicy: passwordPolicyReducer,
    eSignDoc: eSignDocReducer,
    freshChat: chatReducer,
    loader: loaderReducer,
    chat: connectReducer,
});

const reducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: {
        reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;

// Create the mock store
const mockStore = configureMockStore();
export const createTestStore = (initialState: Partial<RootState> = {}) =>
    mockStore(initialState as RootState);
