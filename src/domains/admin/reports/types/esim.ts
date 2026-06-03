interface Image {
    width: number;
    height: number;
    url: string;
}

interface InstallationGuides {
    [key: string]: string;
}

interface PackageDetails {
    id: number;
    code: string;
    data: string;
    type: string;
    price: number;
    net_price: number;
    package: string;
    currency: string;
    quantity: string;
    validity: number;
    esim_type: string;
    created_at: string; // Assuming this is a valid date-time string
    package_id: string;
    description: null | string;
    operatorName: string;
    isRechargable: boolean;
    operatorImage: string;
    installation_guides: InstallationGuides;
    manual_installation: string;
    qrcode_installation: string;
}

interface SimDetail {
    id: number;
    lpa: string;
    iccid: string;
    imsis: null | string;
    qrcode: string;
    apn_type: string;
    apn_value: string;
    created_at: string; // Assuming this is a valid date-time string
    is_roaming: boolean;
    qrcode_url: string;
    airalo_code: null | string;
    matching_id: string;
    confirmation_code: null | string;
}

interface Credential {
    name: string;
    username: string;
}

interface OrderResponse {
    id: number;
    code: string;
    package_id: string;
    currency: string;
    quantity: number;
    type: string;
    description: string | null;
    esim_type: string;
    validity: number;
    package: string;
    data: string;
    price: number;
    created_at: string;
    manual_installation: string;
    qrcode_installation: string;
    installation_guides: { [key: string]: string };
    text: string | null;
    voice: string | null;
    net_price: number;
    sims: {
        id: number;
        created_at: string;
        iccid: string;
        lpa: string;
        imsis: any; // You can define a type for this if needed
        matching_id: string;
        qrcode: string;
        qrcode_url: string;
        airalo_code: string | null;
        apn_type: string;
        apn_value: string | null;
        is_roaming: boolean;
        confirmation_code: string | null;
        apn: {
            ios: { apn_type: string; apn_value: string | null };
            android: { apn_type: string; apn_value: string | null };
        };
        msisdn: string | null;
    }[];
}

interface Transaction {
    corporateTxnId: string;
    status: string;
    order: {
        paymentMode: string;
        amountInAed: string; // Assuming this is a string representation of a number
    };
}

export interface OrderItem {
    credential: Credential;
    order: {
        id: number;
        corporateTxnId: string;
        amountInAed: string;
        paymentMode: string;
        status: string;
        orderResponse: string; // JSON string, can be parsed when needed
        transactionDate: string;
        providerId: string;
    };
}

export interface esimReportResponse {
    result: OrderItem[];
    totalData: number;
}

export type EsimTable = {
    id: number;
    corporateTxnId: string;
    date: string;
    plan: string;
    amount: string;
    paymentType: string;
    customerName: string;
    quantity: number;
    retailPrice: number;
    netPrice: number;
    purchaseType: string;
};
