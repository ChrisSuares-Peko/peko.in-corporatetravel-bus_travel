export type employeeResponse = {
    employees: employeeTypes[];
};
export type employeeTypes = {
    fullName: string;
    value: string;
    label: string;
    personalEmail: string;
    id: string;
    employeeInformation: {
        employeeId: string;
    };
};

export enum GiftCardOrderTypes {
    BULKPURCHASE = 'bulkPurchase',
    BUYFOROTHER = 'buyForOther',
    BUYFOREMPLOYEE = 'buyForEmployees',
}
