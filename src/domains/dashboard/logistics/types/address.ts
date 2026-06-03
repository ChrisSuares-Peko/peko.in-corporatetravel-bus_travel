export type SavedAddressPayload = {
    userId: number;
    userType: string;
    isReceiver: boolean;
};

export interface Address {
    id?: number;
    name: string;
    city: string | null;
    country: string | null;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: string;
    email: string | null;
    countryCode: string | null;
    zipCode?: string;
    isReceiver: number; // Assuming this is a boolean (0 for false, 1 for true)
    default: number; // Assuming this is a boolean (0 for false, 1 for true)
}

export interface SaveAddressPayload extends Address {
    userId: number;
    userType: string;
}

export type SavedAddressResponse = {
    addresses: Address[];
};

export type AddressOptions = {
    label: string;
    value: string;
};

export interface AddressField {
    id?: number;
    address: string;
    phoneNumber: string;
    email: string | null;
    name: string;
    country: string;
    countryCode: string;
    city: string;
    zipCode: string;
}

export interface AddressFormValues {
    senderSaveAddress: boolean;
    recieverSaveAddress: boolean;
    senderEmail: string;
    recieverEmail: string;
    shipmentType: string;
    senderAddress: string;
    senderCity: string;
    senderName: string;
    senderCountry: string;
    senderPhone: string;
    senderZipCode: string;
    recieverName: string;
    recieverAddress: string;
    recieverPhone: string;
    recieverCity: string;
    recieverCountry: string;
    recieverZipCode: string;
}

export interface SenderFormValues {
    addressId?: number;
    senderEmail: string;
    senderAddress: string;
    senderCity: string;
    senderName: string;
    senderCountry: string;
    senderPhone: string;
    senderSaveAddress: boolean;
    senderZipCode: string;
}

export interface RecieverFormValues {
    addressId?: number;
    recieverName: string;
    recieverAddress: string;
    recieverPhone: string;
    recieverEmail: string;
    recieverCity: string;
    recieverCountry: string;
    recieverZipCode: string;
    recieverSaveAddress: boolean;
}

export interface typeFormValues {
    shipmentType: string;
}

export interface FormsSubmissionStatus {
    senderForm: boolean;
    receiverForm: boolean;
    typeForm: boolean;
}

export type SetFormsSubmittedType = (
    value: FormsSubmissionStatus | ((prevState: FormsSubmissionStatus) => FormsSubmissionStatus)
) => void;
