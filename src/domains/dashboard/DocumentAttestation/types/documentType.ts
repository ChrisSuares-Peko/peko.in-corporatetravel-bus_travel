interface Credential {
    id: number;
    name: string;
}

export interface DocumentData {
    id: number;
    documentType: string;
    issuedCountry: string;
    submissionCountry: string;
    passportDoc: string;
    address: string;
    poBox?: string;
    contactPersonPhone: string;
    remarks?: string;
    amount: number;
    status: 'PICKUP' | 'ASSIGNED' | 'PROCESSING' | 'DISPATCHED' | 'COMPLETED';
    createdAt: string; // Assuming this is a valid ISO 8601 date string
    updatedAt: string; // Assuming this is a valid ISO 8601 date string
    credentialId: number;
    credential: Credential;
    transactionId: number;
    transaction: {
        corporateTxnId: number;
        status: string;
    };
}

export interface DocumentResponse {
    data: DocumentData[];
    recordsTotal: number;
}
