export interface Step1Types {
    clientName: string;
    period: string;
}

export interface Step2Types {
    tradeLicenceName: string;
    tradeLicenceNumber: string;
    tradeLicenseAuthority: string;
    ownerNameAndShares: [
        {
            ownerName: string;
            ownerShares: string;
        },
    ];
    emailAddress: string;
    contactNumber: string;
    officeRegisteredAddress: string;
    financialYearStartDate: string;
    financialYearEndDate: string;
    revenueEarnedPrevFY: string;
    authorizedPersonName: string;
    uaeEntityShareResident: string;
    uaeEntityShareForeign: string;
    connectedPartiesTradeLicenses: string;
}

export interface Step3Types {
    numberOfEmployees: string;
    outsourcedActivity: string;
    serviceProviderFee: string;
    serviceProviderLocation: string;
    minutesOfBODMeeting: string;
    numberOfBODMeetingsUAE: string;
    totalExpenditureinPrevFY: string;
    qualificationOfEmployees: string;
    numberOfBODMeetingsinPrevFY: string;
}

export interface Step4Types {
    acceptingDeposits: string;
    makingInvestments: string;
    advancingLoans: string;
    currencyExchanges: string;
    bankingLicense: string;
    takingHedgingPosition: string;
    managingCapitalAdequacy: string;
    raisingFunds: string;
    incomeFromRoyalties: string;
    franchiseIncome: string;
    incomeFromIntangibleAssets: string;
    incomeFromCapitalGains: string;
    expertCompetency: string;
    controlOverResearch: string;
    inhouseDevelopedIP: string;
    purchasedIPFromGroup: string;
    soldIPToGroup: string;
    decisionsByNonResidentDirectors: string;
    incomeFromDividends: string;
    incomeFromCapitalGainsEquity: string;
    equityInterestHolding: string;
    realEstateInterest: string;
    incomeFromBonds: string;
    reportToRegulatoryAuthorities: string;
    groupPosition: string;
    servicesToGroupMembers: string;
    seniorManagementServices: string;
    strategicPlansForGroup: string;
    anyITorHRServicesToGroupMembers: string;
    investmentFund: string;
    investmentAdvisoryServices: string;
    fundAdministrationServices: string;
    fundManagementServices: string;
    hedgingOnInvestments: string;
    reportOnInvestments: string;
    riskReservesCalculation: string;
    interestBearingLoanFacilities: string;
    hirePurchaseAgreements: string;
    assetsToBeLeased: string;
    incomeFromCapitalGainsOnLoans: string;
    termsAndDurationOfLease: string;
    interestBearingLoanFacilitiesToGroupMembers: string;
    goodsPurchasedFromForeignConnectedPersons: string;
    importsAndStorageInState: string;
    administrationToForeignConnectedPersons: string;
}

export interface Step7Types {
    contactPersonName: string;
    designation: string;
    phone: string;
    email: string;
    selfDeclaration: boolean;
}

export interface uboList {
    uboType: string;
    name: string;
    taxIdentificationNumber: string;
    address: string;
    countryOfTaxResidence: string;
}

export interface Step6Types {
    uboGeneralInfo: string;
    uboList: uboList[];
}
export interface Step5Types {
    isFiledPreviously: string;
    dualLicense: string;
    licenseeName: string;
    commercialLicensePermitNumber: string;
    licensingAuthority: string;
    mainRegulatoryAuthority: string;
    reportingRelevantActivity: string;
    tradeLiscenseNo: string;
    licensingAuthorityNoOfbranch: string;
}

export type EsrStageDataResp = {
    _id: string;
    registrationId: any;
    isCompleted: boolean;
    isPaymentCompleted: boolean;
    status: 'Pending' | 'In Progress' | 'ReSubmit' | 'Completed'; // Add more statuses if applicable
    currentStep: number;
    createdAt: string; // Consider using `Date` if you're working with Date objects
    updatedAt: string; // Consider using `Date` if you're working with Date objects
    __v: number;
    step1: Step1Types;
    step2: Step2Types;
    step3: Step3Types;
    step4: Step4Types;
    step5: Step5Types;
    step6: Step6Types;
    step7: Step7Types;
    remarks: string;
    certificate: string;
};
