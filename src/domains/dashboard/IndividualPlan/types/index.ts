export interface PackagePrice {
    monthly: number;
    annually: number;
}

export interface Discount {
    monthly: number;
    annually: number;
}

export interface PackageDetails {
    id: number;
    packageName: string;
    packagePrices: PackagePrice;
    description: string;
    discount: Discount;
}

export interface SubscriptionDetailsResponse {
    packageDetails: PackageDetails[];
}

export interface ISubscriptionDetailsPayload {
    accessKey?: string;
    packageName?: string;
}

export interface featureType {
    icon: string;
    title: string;
    description: string;
}
