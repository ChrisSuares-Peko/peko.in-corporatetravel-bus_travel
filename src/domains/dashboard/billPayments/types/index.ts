import React from 'react';

import { FormikProps } from 'formik';

interface SelectOption {
    value: string;
    label: string;
}

interface SelectInputComponent {
    type: 'select';
    name: string;
    label: string;
    placeholder: string;
    options: SelectOption[];
    min?: number;
    max?: number;
    supportAlphabets?: boolean;
    multipleOf?: number;
}

interface TextInputComponent {
    type: 'input';
    name: string;
    label: string;
    placeholder: string;
    options?: null;
    showMinAndMax?: boolean;
    multipleOf?: number;
    min: number;
    max: number;
    supportAlphabets?: boolean;
}

export type InputComponentsType = SelectInputComponent | TextInputComponent;

export type ServiceDetails = {
    icon: string;
    title: string;
    path: string;
    accessKey: string;
    inputComponents: InputComponentsType[];
};

export type CommonPayload = {
    userId: number;
    userType: string;
};

export type FetchLimitPayload = CommonPayload & {
    path?: string;
};

export type GetLimitResponse = {
    minDenomination: number;
    maxDenomination: number;
    flexiKey: string;
    typeKey: number;
    accessKey: string;
    serviceProvider: string;
    surcharge: string;
};

export type FetchBillApiPayload = CommonPayload & {
    accountNo: number;
    flexiKey: string;
    typeKey: number;
    type?: string;
    path?: string;
    accountPin?: string;
    amount?: string;
    optional?: string;
};

export type FetchBillApiResponse = {
    TransactionId: string;
    ProviderId: string;
    minimumAmountInAed: number;
    maximumAmountInAed: number;
    dueBalanceInAed: string;
    WalletDetails: {
        walletIdentity: string;
        customerEN: string;
    }[];
};

export type PaymentRequestPayload = Partial<CommonPayload> & {
    account: string;
    transactionId: string;
    amount: number;
    payCashback: boolean;
    flexiKey: string;
    typeKey: number;
    apiPath: string;
    providerTransactionId?: string;
    lastBalance: string;
    type: string;
    pin?: string;
};

export type GetAllBeneficiariesPayload = CommonPayload & {
    accesskey?: string;
};

export type Beneficiary = {
    key?: React.Key;
    id: number;
    name: string;
    accountNo: string;
    accessKey: string;
    optional1: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    credentialId: number;
    serviceOperator: {
        serviceProvider: string;
        serviceImage: string;
    };
};

export type AllBeneficiariesResponse = {
    data: Beneficiary[];
};

export type BeneficiaryFormValues = {
    name: string;
    accountNo: string;
    accessKey: string;
    optional1?: string;
    beneficiaryId?: number;
};

export type SendOtpPayload = CommonPayload & {
    beneficiaryActionType: string;
    accountNo?: string;
    accessKey?: string;
    beneficiaryId?: number;
};

export type addEditBeneficiaryPayload = CommonPayload & {
    id?: number;
    name?: string;
    accountNo?: string;
    accessKey?: string;
    isActive: boolean;
    credentialId: string;
    otp: string;
    scope: string;
};

export type deleteBeneficicaryPayload = CommonPayload & {
    id?: number;
    otp: string;
    scope: string;
};
export type updateBeneficiaryStatusPayload = CommonPayload & {
    id?: number;
    isActive: boolean;
};
export interface RenderFormFieldProps {
    formData: InputComponentsType;
    limitData?: GetLimitResponse;
}

export enum BeneficiaryActionType {
    ADD = 'ADD',
    EDIT = 'EDIT',
    DELETE = 'DELETE',
}

export interface BeneficiaryModalProps {
    open: boolean;
    beneficiaryActionType: BeneficiaryActionType;
    setBeneficiaryActionType: React.Dispatch<React.SetStateAction<BeneficiaryActionType>>;
    onCancel: () => void;
    closeAddModal: () => void;
    editValues?: Beneficiary | null;
    accesskeyValue?: string;
}

export interface BeneficiaryCardProps {
    beneficiary: Beneficiary;
    handleEdit?: () => void;
}

export interface BeneficiaryFormProps {
    accesskeyValue?: string;
    selectedProvider?: string;
    setSelectedProvider?: React.Dispatch<React.SetStateAction<string>>;
}

export interface UseGetBeneficiariesProps {
    accesskey?: string;
    openOtpModal?: () => void;
    closeOtpModal?: () => void;
    closeAddModal?: () => void;
    closeConfirmationModal?: () => void;
    formRefName?: React.MutableRefObject<FormikProps<any> | null>;
}

export interface BillDetailsInitialValuesType {
    [key: string]: string;
}

export interface InputComponent {
    type: 'input' | 'select';
    name: string;
    label: string;
    placeholder: string;
    min?: number;
    max?: number;
    showMinAndMax?: boolean;
    multipleOf?: number;
    supportAlphabets?: boolean;
    options?: SelectOption[];
}

export interface Vendor {
    icon: string;
    title: string;
    url: string;
    path: string;
    accessKey: string;
    inputComponents: any[]; // refer type InputComponentsType in line number 35
    btnText?: string;
}
