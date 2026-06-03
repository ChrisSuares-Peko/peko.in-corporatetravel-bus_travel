export interface EsrRecord {
    id: number;
    stageId: string;
    registrationId: string;
    stageNo: string;
    stageCreatedDate: string;
    companyName: string;
    stageTitle: string;
    fiscalYear: string;
    status: 'Pending' | 'In Progress' | 'ReSubmit' | 'Completed';
    remarks: string;
    certificate: string;
}
export type getESR = {
    page: number;
    searchText: string;
    itemsPerPage: number;
    sort: string;
    type?: string;
    sortField?: string;
};

export type updateStatus = {
    esrId?: string | number;
    status: any;
    stageId: string;
};

export type activeResponse = {
    data: string;
};

export type QuestionOption = {
    label: string;
    value: string | boolean;
};

// Type for individual questions in each step
export type QuestionAnswer = {
    questionId: string;
    placeholder: string | null;
    questionText: string;
    questionType: 'text' | 'number' | 'date' | 'radio' | 'select' | 'checkbox';
    isRequired: boolean;
    options: QuestionOption[] | null;
    answer: any;
};

// Type for each step in a stage
export type Step = {
    stepNo: number | string;
    stepTitle: string;
    questionAnswers: QuestionAnswer[];
};

// Type for each stage in the data
export type Stage = {
    stageId: number | string;
    stageTitle: string;
    steps: Step[];
    isCompleted: boolean;
};

// Type for the overall data
export type ESRProcessData = {
    stages: Stage[];
};

export type ESRModalData = {
    status: string;
    stageId: string;
    remarks: string;
    stageNo: string;
    certificate: string;
    certificateFormat?: string;
};
