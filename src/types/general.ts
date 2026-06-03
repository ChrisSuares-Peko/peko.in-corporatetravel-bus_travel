export type SuccessGenericResponse<T> = {
    status: boolean;
    message: string;
    responseCode: string;
    data: T;
};

export type ErrorGenericResponse = {
    status: boolean;
    message: string;
    responseCode: string;
    data: {};
};

export interface UserPayload {
    userId: number;
    userType: string;
}
export interface userPayloadWithPage {
    userId: number;
    userType: string;
    page: number;
}
export interface projectNamePayload {
    userId: number;
    userType: string;
    name: string;
}

export type DropDown = {
    label: string;
    value: string;
}[];

export type commonSelectType = {
    oName: string;
    oValue: any;
};
export interface summaryTexts {
    key: string;
    value: string | number;
    isInput?: boolean;
}

export type SurchargeResponse = {
    surcharge: string;
    corporateCashback: string;
};

export enum SortDirection {
    ASC = 'ASC',
    DESC = 'DESC',
}
export type ProductTour = {
    dashboard: boolean;
    payroll: boolean;
};

export type UserInfoResponse = {
    balance: string;
    credentialId: number;
    role: string;
    companyName: string;
    username: string;
    roleName: string;
    logo: string;
    productTour: ProductTour;
    contactPersonName: string;
    email: string;
    mobileNo: string;
    chatId: string;
    partnerId: string;
    subCorporateCredential?: number;
    subCorporateEmail?: string;
    subCorporateMobile?: string;
};

export type notificationListResponse = {
    data: notification[];
    count: number;
    pendingRequests: number;
};

export type notification = {
    id: number;
    notificationTitle: string;
    notificationBrief: string;
    notificationCategory: string;
    notificationTo: string;
    notificationBy: string;
    scheduleDate: string | null;
    flag: boolean;
    createdAt: string;
    updatedAt: string;
};

export interface ServicesListResponse {
    data: {
        serviceCategory: string;
        hasAccess: boolean;
        services: Service[];
        label: string;
        subServices: {
            label: string;
            hasAccess: boolean;
        }[];
    }[];
}

export interface PurchasedListResponse {
    userAccessibleServices: string[];
    packageName?: string;
}

export interface Service {
    service: string;
    serviceCategory: string;
    hasAccess: boolean;
    serviceProvider: string;
    services: SubService[];
}

export interface SubService {
    serviceProvider: string;
    serviceType: string;
    service: string;
    hasAccess: boolean;
}

export enum UserRole {
    CORPORATE = 'corporate',
    SYSTEM = 'system_user',
}

export enum RoleName {
    ADMIN = 'admin',
    CORPORATE = 'corporate',
    ECOM = 'ecom_manager',
}

export enum PekoPackages {
    Basic = 'Basic',
    Standard = 'Standard',
    Premium = 'Premium',
}

export type CommonFileBuffer = {
    pdfBuffer: any;
    buffer: any;
    fileType: string;
};

export enum DownloadType {
    Excel = 'excel',
    Csv = 'csv',
    Pdf = 'pdf',
}

export type ticketChatPayload = {
    userType: string;
    userId: number;
    id: number;
};

export type createChatDataPayload = {
    userId?: number;
    userType?: string;
    body: string;
    id: number;
};

export type SubscriptionAddOnResponse = {
    unitPrice: number;
    maxLimit: number;
    packageId: number;
};

export interface SubscriptionHistory {
    subscriptionStartDate: string;
    subscriptionEndDate: string;
    subscriptionAmountPaid: number;
    status: string;
    billingType: string;
    maxLimit: number;
    package: {
        packageName: string;
    };
}

export interface subscriptionHistoryResponse {
    currentSubscription: SubscriptionHistory;
    addOns: (SubscriptionHistory & { isCustom: number }) | null;
    isGroupSubscription: boolean;
}

interface PackagePrices {
    monthly: number;
    annually: number;
}
export interface subscriptionCodeResponse {
    activationCode: ActivationCode;
}

export type ActivationCode = {
    billingType: string;
    packageId: number;
    package: {
        packageName: string;
        packagePrices: PackagePrices;
        discount: PackagePrices;
        packageType: string;
    };
};

export type ActivateCodeResponse = {
    subscription: {
        subscriptionStartDate: string;
        subscriptionEndDate: string;
        billingType: string;
        packageName: string;
    };
};

export type Message = {
    id: string;
    sender: string;
    type: string;
    content: string;
    timestamp: number;
};
export type Sender = {
    userId: string;
    displayName: string | undefined;
};
export type LastMessage = {
    id: string;
    content: {
        message: string;
        attachments: any[];
    };
    createdOn: string;
    type: string;
    metadata: {
        type: string;
    };
};
export type Chat = {
    threadId: string;
    topic: string;
    sender: Sender;
    lastMessage: LastMessage | null;
    unreadCount: number;
};

export type ChatProfile = {
    id: string;
    acs_user_id: string;
    logo: string;
    name: string;
    image: string;
    credential: {
        username: number;
    };
};

export type ChatState = {
    chats: Chat[];
    profiles: ChatProfile[];
    isLoading: boolean;
    error: any;
    unreadChats: number;
    status: 'idle' | 'call';
    notification: any;
    notifications: any[];
    acsUserId: string;
    page: string;
    mode: string;
    pendingRequests: number;
};
