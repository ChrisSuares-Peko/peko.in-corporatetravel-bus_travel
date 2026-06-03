// incentive listing
export type incentivePayload = {
    userId: number;
    userType: string;
    eId: string | undefined;
    page: number;
    limit: number;
    year: number;
    month: number | string;
};
interface IncentiveData {
    corporateUser: string;
    employee: string;
    incentiveDate: string;
    monthlyTarget: string;
    achievedTarget: string;
    achievedSaleInPercent: string;
    amount: number;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    id: string;
}

export type incentiveListingResponse = {
    totalCount: number;
    incentivesData: IncentiveData[];
};
export type incentiveTable = {
    dateAdded: string;
    effectiveDate?: string;
    salaryMonth: string;
    monthlyTarget: string;
    achievedTarget: string;
    percentageOfSales: string;
    incentiveAmount: number;
    status: string;
    action: any;
    id: string;
};

export type createIncentivesPayload = {
    employeeId: string | undefined;
    incentiveDate: string;
    monthlyTarget: string;
    achievedTarget: string;
    achievedSaleInPercent: string;
    amount: number;
};
export type updateIncentivesPayload = {
    id: string;
    incentiveDate: string;
    monthlyTarget: string;
    achievedTarget: string;
    achievedSaleInPercent: string;
    amount: number;
};
export type createIncentivesResponse = {
    corporateUser: string;
    employee: string;
    incentiveDate: string;
    monthlyTarget: string;
    achievedTarget: string;
    achievedSaleInPercent: string;
    amount: number;
    paymentStatus: string;
    createdAt: string;
    updatedAt: string;
    id: string;
};
export type incentiveDeletePayload = {
    userId: number;
    userType: string;
    rId: string | undefined;
};
