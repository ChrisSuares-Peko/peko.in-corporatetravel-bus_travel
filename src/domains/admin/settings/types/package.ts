export type Packages = {
    id: number;
    packageName: string;
    packagePrice: string;
    packagePrices: {
        monthly: string;
        annually: string;
    };
    description: string;
    partnerId: string | null;
    discount?: {
        monthly: string;
        annually: string;
    };
    discountType?: 'FLAT' | 'PERCENTAGE';
    packageType?: 'INDIVIDUAL' | 'GROUP';
    accessCode?: string;
    status: boolean | number;
    partnerName: string;
};

export type PackageWithoutID = {
    id?: number;
    packageName: string;
    packagePrice: string;
    description: string;
    status: boolean | number;
    partnerId: string | null;
};

export type ApiResponsePackage = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: Packages[];
};

export type updatePackageStatus = {
    status: boolean;
    packageId: string | number;
};

export type PackageID = Omit<updatePackageStatus, 'status'>;
