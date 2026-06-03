export interface GetPayrollSettingType {
    payrollSettings: {
        isEditable: boolean;
        workingHours: number;
        organizationWorkingDays: number;
        salaryCycleDay: number;
        payrollStartsFrom: string;
        salaryPaidOn: string;
        selectedWeekdaysCount: number[];
    };
    officialDocuments: {
        hrManagerName: string;
        hrManagerSignature: string;
        companyOfficialStamp: string;
        establishmentId: string;
    };
}

export interface LeaveSettingsType {
    leaveSettings: {
        annualLeave: number;
        sickLeave: number;
        parentalLeave: number;
        sabbaticalLeave: number;
        studyLeave: number;
        HajjAndUmrahLeave: number;
        maternityLeave: number;
        officialLeavesAndVacations: number;
        otherPaidLeaves: number;
        eligibilityTimePeriod: number;
    };
}

export interface PayrollSettingFormType {
    organizationWorkingDays: number | string;
    salaryCycleDay: number | string;
    payrollStartsFrom: string;
    hrManagerName: string;
    hrManagerSignature: string;
    companyOfficialStamp: string;
    signatureFormat: string;
    companyOfficialFormat: string;
    // selectedWeekdaysCount: number;
    selectedWeekdaysCount: number[];
    establishmentId: string;
}

export interface PayrollSettingType {
    payrollSettings: {
        organizationWorkingDays: number | string;
        salaryCycleDay: number | string;
        payrollStartsFrom: string;
        selectedWeekdaysCount: number[];
    };
    officialDocuments: {
        hrManagerName: string;
        hrManagerSignature:
            | string
            | {
                  base64: string;
                  format: string;
              }
            | null;
        companyOfficialStamp:
            | string
            | {
                  base64: string;
                  format: string;
              }
            | null;
    };
}

export type WpsSettings = {
    employerId: string;
    employerRoutingCode: string;
    employerReference: string;
    isFreeZoneCompany: boolean;
};
