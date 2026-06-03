export type EmployeeType = {
    id: number;
    name: string;
    email: string;
    employeeId: number;
    role: string;
    employeeType: 'Full-time' | 'Part-time';
    joinDate: string;
    status: boolean;
    phoneNumber: string;
    salary: number;
};
export type ProcessSalaryType = {
    id: number;
    name: string;
    role: string;
    employeeId: number;
    monthlySalary: string;
    bonus: string;
    incentives: string;
    overtime: string;
    deduction: string;
    netPay: string;
    totalPayable: string;
};

export const EmployeeProcessSalaryData: ProcessSalaryType[] = [
    {
        id: 12,
        totalPayable: '1200',
        name: 'Employee sawp',
        employeeId: 123456,
        monthlySalary: '1000',
        role: 'Test Engineer',
        bonus: '100',
        incentives: '100',
        overtime: '100',
        deduction: '100',
        netPay: '100',
    },
];
export type EmployeeDisplayType = {
    fullName: string;
    errors: string[];
    id: number;
    status: boolean;
    role: string;
    joinDate: string;
};

export const employeeData: EmployeeType[] = [
    {
        id: 12,
        name: 'Employee sawp',
        email: 'abc@gmail.com',
        employeeId: 123456,
        role: 'Software Engineer',
        employeeType: 'Full-time',
        joinDate: '2024-01-01',
        status: true,
        salary: 123,
        phoneNumber: '8738738',
    },
];
