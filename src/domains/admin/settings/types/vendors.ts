export type Vendor = {
    id: number;
    vendorName: string;
    type: string;
    isActive: boolean;
    apiUrl: string;
    healthUrl: string;
    optional1: string;
    optional2: string;
    optional3: string;
    optional4: string;
    optional5: string;
    optional6: string;
    vendorEmail: string[];
};

export type VendorWithoutID = {
    id?: number;
    vendorName: string;
    type: string;
    isActive: boolean;
    apiUrl: string;
    healthUrl: string;
    optional1: string;
    optional2: string;
    optional3: string;
    optional4: string;
    optional5: string;
    optional6: string;
};

export type ApiResponseVendor = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: Vendor[];
};

export type getVendors = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: 'ASC' | 'DESC';
    type?: string;
    sortField?: string;
};

export type updateVendorStatus = {
    isActive: boolean;
    vendorId: string | number;
};
