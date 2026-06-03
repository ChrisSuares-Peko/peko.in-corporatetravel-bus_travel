export type CommonPayload = {
    userId: number;
    userType: string;
};
export type TotalSpentResponse = {
    totalSpendCurrentMonth: number;
    totalSpend: number;
    totalCashback: number;
};

export type Alert = {
    type: string;
    message: string;
    action: string;
    linkUrl: string;
    providerImage: string;
};

export type AllAlertsResponse = {
    alerts: Alert[];
};

export type ChartApiPayload = CommonPayload & {
    paymentMode: string;
    year: string;
    month: string;
    monthlyView: boolean;
};
export type CharDataType = {
    name: string;
    amount: number;
};

export type RecentOrdersData = {
    transactionDate: string;
    serviceCategory: string;
    amountInAed: number;
    status: string;
};

export type ChartDataResponse = {
    filteredResult: CharDataType[];
    recentTransaction?: RecentOrdersData[];
};

export type Filters = {
    handlePaymentModeFilter: (value: string) => void;
    handleYearChange: (value: string) => void;
    handleMonthChange: (value: string) => void;
    handleMonthlyView: () => void;
};

export type SelectTag = {
    value: string;
    label: String;
};

export type SelectTagResponse = {
    months: SelectTag[];
    years: SelectTag[];
    paymentMode: SelectTag[];
};

export type Banner = {
    id: number;
    bannerTitle: string;
    bannerLink: string;
    description: string;
    highlights: string;
    bannerImage: string;
    buttonText?: string;
};
export type AllBannersResponse = {
    result: Banner[];
};
export type UpdateTour = { type: 'All' } | { type: 'Single'; service: string };

export type productTourResponse = {
    result: productTour;
};

export type productTour = {
    productTour: {
        dashboard: boolean;
        payroll: boolean;
    };
};

export type BannerPosition = {
    position: string;
};
