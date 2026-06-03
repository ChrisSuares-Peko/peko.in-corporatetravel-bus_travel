export type Referral = {
    id: number;
    referralCode: string;
    contactPersonName: string;
    contactPersonPhone: string;
    status: number;
    createdAt: string;
    updatedAt: string;
};

export type ReferalResponse = {
    recordsTotal: number;
    data: Referral[];
};

export type refresh = {
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
export type updateStatus = {
    referalId?: string | number;
    status: any;
};
export type activeResponse = {
    data: string;
};
export type getData = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: string;
    type?: string;
    sortField?: string;
};

export type newReferal = {
    id?: number;
    referralCode: string;
    contactPersonName: string;
    contactPersonPhone: string;
};
