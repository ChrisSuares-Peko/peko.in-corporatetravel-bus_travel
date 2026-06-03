export interface PackagePrices {
    monthly: number;
    annually: number;
}

export enum PlanType {
    Monthly = 'monthly',
    Annually = 'annually',
}

export enum PlanMode {
    Basic = 'WhatsApp Basic',
    Pro = 'WhatsApp Pro',
}

export type SsoResponse = {
    redirectLink: string;
    token: string;
};
