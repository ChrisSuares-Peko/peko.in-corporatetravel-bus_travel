export interface PackagePrices {
    monthly: number;
    annually: number;
}

export enum PlanType {
    Monthly = 'monthly',
    Annually = 'annually',
}

export enum SubscriptionType {
    Current = 'CURRENT',
    Upgrade = 'UPGRADE',
    Downgrade = 'DOWNGRADE',
}

interface Discount {
    monthly: number;
    annually: number;
}

export interface ServicePackage {
    id: number;
    packageName: string;
    packagePrices: PackagePrices;
    description: string;
    discount: Discount;
    services: string[];
}

export interface PackagesData {
    packages: ServicePackage[];
    currentPackageId: number;
}

export interface PackageDetails {
    id: number;
    packageName: string;
    packagePrices: PackagePrices;
    description: string;
    discount: Discount;
}

interface DiscountDetails {
    price: number;
    message: string;
}

export interface PackageDetailsResponse {
    packageDetails: PackageDetails;
    discount: DiscountDetails;
}

export interface AddressFormValues {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    flatNO: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface PaymentRequestPayload {
    amount: number;
    packageId: number;
    billingType: string;
    accessKey?: string;
    pgAmount?: number;
    successUrl: string;
    failureUrl: string;
    billingAddress?: AddressFormValues;
    couponCode?: string;
}

export interface AddOnPaymentRequestPayload {
    isAddOns: boolean;
    pgAmount: number;
    addonsAccessKey: string;
    packageId: number;
    quantity: number;
    accessKey: string;
    successUrl: string;
    failureUrl: string;
}

export interface userPayload {
    userType: string;
    userId: number;
}

export type PaymentResponse = {
    redirectLink: string;
};

export type DynamicNumberObject = {
    [key: string]: number;
};

export interface TableData {
    groupPackages: DynamicNumberObject;
    individualPackages: DynamicNumberObject;
    groupPackageDiscounts: DynamicNumberObject;
}

export type TableDataPackages = {
    tableData: TableData;
};

export type SelectedType = 'monthly' | 'annually';

export type DiscountResult = {
    discountedAmount: number;
    discountPercentage: number;
};

export type MaxDiscountResult = {
    maxMonthlyDiscountPercentage: number;
    maxAnnualDiscountPercentage: number;
};

export interface ApplyCouponPayload {
    amount: number;
    couponCode: string;
}

export type ApplyCouponResponse = {
    originalAmount: string;
    discountAmount: number;
    finalAmount: number;
};
