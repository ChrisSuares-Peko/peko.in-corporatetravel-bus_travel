export type country = {
    name: string;
    id: string;
};

export type countryList = {
    country: string;
};

type DataOption = {
    dataMBs: string;
    periodDays: Array<string>;
};

export type DataOptions = Array<DataOption>;

export type PlanData = {
    planId: string;
    amount: number;
    name: string;
};
