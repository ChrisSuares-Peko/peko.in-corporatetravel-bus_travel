import { lazy } from 'react';

import { Outlet } from 'react-router-dom';

import PayrollAuthGuard from '@src/guard/PayrollGuard';

import { paths } from '../paths';

const ActivityCalendarPage = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/ActivityCalendar')
);
const HrSettingsPage = lazy(() => import('@src/domains/dashboard/Payroll/pages/HrSettings'));

const HomePage = lazy(() => import('@src/domains/dashboard/Payroll/pages/HomePage'));
const EmployeeProfilePage = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/EmployeeProfile')
);
const SalaryProfilePage = lazy(() => import('@src/domains/dashboard/Payroll/pages/SalaryProfile'));
const EmployeesPage = lazy(() => import('@src/domains/dashboard/Payroll/pages/Employees'));
const EmployeeSalaryPage = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/EmployeeSalary')
);

const AnnouncementsPage = lazy(() => import('@src/domains/dashboard/Payroll/pages/Announcements'));
const EmployeeLeavePage = lazy(() => import('@src/domains/dashboard/Payroll/pages/EmployeeLeave'));
const EmployeeBulkUpload = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/EmployeeBulkUpload')
);
const EmployeeSuccessPage = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/EmployeeSuccess')
);
const EmployeeDocuments = lazy(() => import('@src/domains/dashboard/Payroll/pages/DocAndAssets'));

const ProcessSalaryPage = lazy(() => import('@src/domains/dashboard/Payroll/pages/ProcessSalary'));

const WpsRegistration = lazy(() => import('@src/domains/dashboard/Payroll/pages/WpsRegistration'));
const EmployeeDetails = lazy(() => import('@src/domains/dashboard/Payroll/pages/EmployeeDetails'));
const EmployeeReimbursementPage = lazy(
    () => import('@src/domains/dashboard/Payroll/pages/EmployeeReimbursement')
);

// -----------------------------------------------------------------------

export const payrollRoutes = [
    {
        path: '',
        element: (
            <PayrollAuthGuard>
                <Outlet />
            </PayrollAuthGuard>
        ),
        children: [
            { element: <EmployeeLeavePage />, path: paths.payroll.employeeLeave },
            {
                element: <SalaryProfilePage />,
                path: `${paths.payroll.employeesSalary}/${paths.payroll.salaryProfile}`,
            },
            {
                element: <ProcessSalaryPage />,
                path: `${paths.payroll.employeesSalary}/${paths.payroll.processSalary}`,
            },
            {
                element: <EmployeeSuccessPage />,
                path: `${paths.payroll.employeesSalary}/${paths.payroll.processSalary}/${paths.payroll.employeeSuccess}`,
            },
            { element: <EmployeeSalaryPage />, path: paths.payroll.employeesSalary },
            {
                element: <AnnouncementsPage />,
                path: `${paths.payroll.activityCalendar}/${paths.payroll.announcements}`,
            },
        ],
    },
    { element: <HomePage />, index: true },
    { element: <ActivityCalendarPage />, path: paths.payroll.activityCalendar },
    { element: <HrSettingsPage />, path: paths.payroll.hrSettings },
    {
        element: <EmployeeProfilePage />,
        path: `${paths.payroll.employees}/${paths.payroll.addEmployee}`,
    },
    { element: <EmployeesPage />, path: paths.payroll.employees },
    {
        element: <EmployeeBulkUpload />,
        path: `${paths.payroll.employees}/${paths.payroll.bulkUpload}`,
    },

    { element: <WpsRegistration />, path: paths.payroll.wpsRegistration },
    {
        element: <EmployeeDetails />,
        path: `${paths.payroll.employees}/${paths.payroll.employeeProfile}`,
    },
    { element: <EmployeeDocuments />, path: paths.payroll.documentsAndAssets },
    { element: <EmployeeReimbursementPage />, path: paths.payroll.employeeReimbursement },
    {
        element: <EmployeeDetails />,
        path: `${paths.payroll.employeesSalary}/${paths.payroll.employeeProfile}`,
    },
];
