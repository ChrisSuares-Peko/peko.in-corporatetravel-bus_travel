export enum PackageStatus {
    Active = 'ACTIVE',
    Expired = 'EXPIRED',
    Upgraded = 'UPGRADED',
    Due = 'DUE',
}

export enum PackageType {
    Individual = 'INDIVIDUAL',
    Group = 'GROUP',
}

export enum BillingTypes {
    Monthly = 'MONTHLY',
    Annually = 'ANNUALLY',
}

export interface Package {
    id: number;
    packageName: string;
    packageType: 'INDIVIDUAL' | 'GROUP';
    description: string;
}

export interface ActiveSubscription {
    id: number;
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    billingType: string;
    subscriptionAmountPaid: string;
    status: 'ACTIVE' | 'EXPIRED' | 'UPGRADED' | 'DUE';
    package: Package;
    isCustom: boolean;
    isCancelled: boolean;
}

export type subscriptionWithCount = {
    rows: ActiveSubscription[];
    count: number;
};

export interface ResponseDataSubscriptionHistory {
    activeSubscriptions: subscriptionWithCount;
}

export interface PackageQueryParams {
    page: number;
    itemsPerPage: number;
    status?: PackageStatus;
    packageType?: PackageType;
}

export type downloadResponse = {
    pdfBuffer: {
        type: string;
        data: [];
    };
};

export interface CurrentSubscription {
    billingType: string;
    status: string;
    subscriptionAmountPaid: string;
    package: {
        id: number;
        packageName: string;
        packageType: string;
    };
}

export interface CurrentPlanResponse {
    currentSubscription: CurrentSubscription;
}

export interface SavedCardData {
    id: number;
    maskedPan: string;
    expiry: string;
    scheme: string;
    cardholderName: string;
    is_default: boolean;
}

export interface GetAllSavedCardsResponse {
    allUserCards: SavedCardData[];
    defaultCard: SavedCardData;
}
