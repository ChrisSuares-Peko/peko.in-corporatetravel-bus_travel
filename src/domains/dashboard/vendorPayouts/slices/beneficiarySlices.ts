import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LogoImage {
    base64: string;
    format: string;
}
interface PersonalData {
    logo?: LogoImage | null;
    fullName: string;
    email: string;
    phoneNumber: string;
    relationShip: string;
    additionalDetails: string;
}
interface AddressData {
    addressLineOne: string;
    addressLineTwo: string;
    country: undefined;
    state: string;
    city: string;
}

interface BankData {
    bankName: string;
    bankAccountNumber: string;
    bankCode: string;
    bankAccountName: string;
    bankAddress: string;
    deliveryMode: string;
}

export interface ProfileImage {
    base64: string;
    format: string;
}

interface ImageData {
    profileImage: ProfileImage | null;
}
interface KYBDetails {
    icRegNumber: string;
    companyName: string;
    tradeName: string;
    offWebsite: string;
    offEmail: string;
    contactPersonName: string;
    phoneNumber: string;
    legalStatus: string;
    natureOfBusiness: string;
    countryOfIncorporation: string;
    dateOfIncorporation: string;
    TLNumber: string;
    TLIssuingAuthority: string;
    expiryDateofTL: string;
    VATTRN: string;
    tradeLicense:
        | {
              base64: string;
              format: string;
          }
        | string;
    corporateAddress: {
        poBox: '';
        buildingName: '';
        streetName: '';
        city: '';
        country: '';
    };
}

interface OwnerDocument {
    base64: string;
    format: string;
}

interface shareHolders {
    shareholderName: string;
    nationality: string;
    id: string;
    designation: string;
    percentageShares: number;
    document: OwnerDocument;
}

interface OwnerInformation {
    shareHolders: shareHolders[];
    authorizedPersonName: string;
    authorizedPersonNationality: string;
    authorizedPersonID: string;
    hasPresenceInIranOrNorthKorea: boolean;
}
// Specify the type for the beneficiaryDocuments property
interface BeneficiaryState {
    personalDetails: PersonalData;
    addressDetails: AddressData;
    bankDetails: BankData;
    kybDetails: KYBDetails;
    ownerInformation: OwnerInformation;
}

const initialState: BeneficiaryState = {
    personalDetails: {
        fullName: '',
        email: '',
        phoneNumber: '',
        relationShip: '',
        additionalDetails: '',
    },
    addressDetails: {
        addressLineOne: '',
        addressLineTwo: '',
        country: undefined,
        state: '',
        city: '',
    },
    bankDetails: {
        bankName: '',
        bankAccountNumber: '',
        bankCode: '',
        bankAccountName: '',
        bankAddress: '',
        deliveryMode: '',
    },
    kybDetails: {
        icRegNumber: '',
        companyName: '',
        tradeName: '',
        offWebsite: '',
        offEmail: '',
        contactPersonName: '',
        phoneNumber: '',
        legalStatus: '',
        natureOfBusiness: '',
        countryOfIncorporation: '',
        dateOfIncorporation: '',
        TLNumber: '',
        TLIssuingAuthority: '',
        expiryDateofTL: '',
        VATTRN: '',
        tradeLicense: {
            base64: '',
            format: '',
        },
        corporateAddress: {
            poBox: '',
            buildingName: '',
            streetName: '',
            city: '',
            country: '',
        },
    },
    ownerInformation: {
        shareHolders: [],
        authorizedPersonName: '',
        authorizedPersonNationality: '',
        authorizedPersonID: '',
        hasPresenceInIranOrNorthKorea: false,
    },
};

const beneficiarySlices = createSlice({
    name: 'beneficiaryDetails',
    initialState,
    reducers: {
        setPersonalData: (state, action: PayloadAction<PersonalData>) => {
            state.personalDetails = { ...state.personalDetails, ...action.payload };
        },
        setAddressData: (state, action: PayloadAction<AddressData>) => {
            state.addressDetails = { ...state.addressDetails, ...action.payload };
        },
        setBankData: (state, action: PayloadAction<BankData>) => {
            state.bankDetails = { ...state.bankDetails, ...action.payload };
        },
        resetBeneficiary: state => initialState,

        setKYBDetails: (state, action: PayloadAction<KYBDetails>) => {
            state.kybDetails = { ...state.kybDetails, ...action.payload };
        },
        setOwnerInformation: (state, action: PayloadAction<OwnerInformation>) => {
            state.ownerInformation = { ...state.ownerInformation, ...action.payload };
        },
        clearKYBDetails: state => {
            state.kybDetails = initialState.kybDetails;
        },
    },
});

export const {
    setPersonalData,
    setAddressData,
    setBankData,
    setKYBDetails,
    setOwnerInformation,
    clearKYBDetails,
    resetBeneficiary,
} = beneficiarySlices.actions;

export default beneficiarySlices.reducer;
