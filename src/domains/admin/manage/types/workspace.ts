export interface Plan {
    id: number;
    name: string;
}

export interface Perks {
    data: string;
    imageUrl: string;
}

export type WorkspaceBody = {
    id: number;
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    address: string;
    latLng: string;
    logo: string;
    status: boolean;
    features: null | string[];
    perks: null | Perks[];
    plan: Plan;
};

export type WorkspaceWithoutID = {
    id?: number;
    name: string;
    monthlyPrice: string;
    yearlyPrice: string;
    address: string;
    latLng: string;
    logo: string;
    status: boolean;
    features: null | string[];
    perks: null | Perks[];
    plan: Plan;
};

export type ApiResponseWorkspace = {
    recordsTotal: number;
    data: WorkspaceBody[];
};

export type ApiResponseWorkspacePlans = {
    result: Plan[];
};

export type updateWorkspaceStatusPayload = {
    status: boolean;
    workspaceId: string | number;
};

export type WorkspaceID = Omit<updateWorkspaceStatusPayload, 'status'>;

export type getWorkspace = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: 'ASC' | 'DESC';
    sortField?: string;
};
