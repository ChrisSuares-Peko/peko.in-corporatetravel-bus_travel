export type Category = {
    id: number;
    categoryName: string;
    categoryImage: string;
    categoryStatus: boolean;
    createdAt: string;
    updatedAt: string;
    vendorId: number;
    vendor: {
        id: number;
        vendorName: string;
    };
};

export interface Address {
    id: number;
    name: string;
    nickname: string;
    department: string | null;
    city: string | null;
    country: string | null;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    email: string | null;
    countryCode: string | null;
    zipCode: string | null;
    isReceiver: number; // Assuming this is a boolean (0 for false, 1 for true)
    default: number; // Assuming this is a boolean (0 for false, 1 for true)
    credentialId: number;
}

export interface AddressField {
    address: string;
    phoneNumber: string;
    remarks?: string;
}

export type AddressOptions = {
    label: string;
    value: string;
};

export type SavedAddressPayload = {
    userId: number;
    userType: string;
};

export type SavedAddressResponse = {
    data: Address[];
};
