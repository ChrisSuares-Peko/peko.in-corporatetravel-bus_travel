export type ESRRecord = {
    stageCreatedDate: string;
    stageId: number;
    stageNo: string;
    stageTitle: string;
    fiscalYear: string;
    companyName: string;
    status: string;
    remarks: string;
};

export type ApiResponse = {
    data: ESRRecord[];
    count: number;
};

export type downloadStageResponse = {
    pdfData: {
        type: 'Buffer';
        data: [];
    };
};
