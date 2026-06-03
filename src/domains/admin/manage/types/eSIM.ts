export type EsimPlan = {
    id?: number;
    name: string;
    country: string;
    dataMBs: string;
    periodDays: string;
    coverageId?: string;
    status: boolean;
    amount: number;
};

export type ApiResponseEsimPlans = {
    draw: number;
    recordsTotal: number;
    recordsFiltered: number;
    data: EsimPlan[];
};

export type getEsimPlans = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: 'ASC' | 'DESC';
};

export type updatePlanStatusPayload = {
    status: boolean;
    planId?: number;
};

export type ConnectID = Omit<updatePlanStatusPayload, 'status'>;

export type updateStatus = {
    id?: string | number;
    status: any;
};

export type country = {
    id: string;
    name: string;
};

export type getCountryResponse = {
    countries: country[];
};
