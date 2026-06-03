export type PostData = {
    amount: number;
    packageId: string;
    quantity?: number | null;
    plan: string;
    iccid?: string;
    operatorImage?: string;
    operatorName: string;
    isRechargable?: boolean;
    topupType?: string;
    countries?: any[];
    packageType?: string;
    region?: string | null;
};
