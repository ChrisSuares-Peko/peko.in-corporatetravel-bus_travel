/* eslint-disable react/no-unescaped-entities */
import { useRef, useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import {
    Col,
    Divider,
    Flex,
    Grid,
    Input,
    List,
    Row,
    Typography,
    Skeleton,
    theme,
    Tour,
    Progress,
    Button,
} from 'antd';
import { TourProps } from 'antd/lib';
import { Link, useNavigate } from 'react-router-dom';

import document from '@domains/dashboard/Payroll/assets/icons/document.svg';
import employers from '@domains/dashboard/Payroll/assets/icons/employees.svg';
import navItemAnnouncement from '@domains/dashboard/Payroll/assets/icons/navItemAnnouncement.svg';
import benefitsIcon from '@domains/dashboard/Payroll/assets/icons/navItemBenifits.svg';
import navItemEmployees from '@domains/dashboard/Payroll/assets/icons/navItemEmployees.svg';
import navItemPayroll from '@domains/dashboard/Payroll/assets/icons/navItemPayroll.svg';
import navItemReimbursement from '@domains/dashboard/Payroll/assets/icons/navItemReimbursement.svg';
import navItemTime from '@domains/dashboard/Payroll/assets/icons/navItemTime.svg';
import prevSalaray from '@domains/dashboard/Payroll/assets/icons/next-month-salary.svg';
import totalSalary from '@domains/dashboard/Payroll/assets/icons/total-salary.svg';
import DashboardHeader from '@domains/dashboard/Payroll/components/Dashboard/DashboardHeader';
import InfoCard from '@domains/dashboard/Payroll/components/Dashboard/InfoCard';
import NavigationCards from '@domains/dashboard/Payroll/components/Dashboard/NavigationCards';
import UpcomingActivityCard from '@domains/dashboard/Payroll/components/Dashboard/UpcomingActivityCard';
import { useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';
import { useScrollToTop } from '@src/hooks/useScrollToTop';
import useGetAddonDetails from '@src/hooks/useSubscriptionAddons';
import { paths } from '@src/routes/paths';
import { accessKeys } from '@utils/accessKeys';
import { calculatePercentage } from '@utils/calculatePercentage';
import { formattedDateOnly } from '@utils/dateFormat';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import useEnableProductTour from '../../Home/hooks/useEnableProductTour';
import Chart from '../components/Dashboard/Chart';
import { useDashboardApi } from '../hooks/dashboardHooks/useDashboardApi';
import useGetEmployeeCount from '../hooks/dashboardHooks/useGetEmployeeCount';

const Dash = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const screens = Grid.useBreakpoint();
    const navigate = useNavigate();
    useScrollToTop();
    const activeEmployessRef = useRef(null);
    const totalSalaryRef = useRef(null);
    const nextMonthSpendsRef = useRef(null);
    const employeesRef = useRef(null);
    const salaryRef = useRef(null);
    const leavesRef = useRef(null);
    const announcementsRef = useRef(null);
    const reimbursementRef = useRef(null);
    const documentRef = useRef(null);
    const processSalaryRef = useRef(null);
    const addEmployeeRef = useRef(null);
    const addLeaveRef = useRef(null);
    const chartRef = useRef(null);
    const hrSettingsRef = useRef(null);
    const viewCalendarRef = useRef(null);
    const { handleUpdateTour } = useEnableProductTour();
    const { user } = useAppSelector(state => state.reducer.user);
    const [open, setOpen] = useState<boolean>(true);
    const { count, date } = useGetEmployeeCount();
    const { addonData, isLoading: addOnLoading } = useGetAddonDetails(
        accessKeys.payroll,
        packageAccessKeys.Payroll
    );
    const { md } = useScreenSize();
    const steps: TourProps['steps'] = [
        {
            title: 'Welcome to Peko’s Payroll',
            placement: 'center',
            description: (
                <Typography.Text className="font-thin text-white">
                    Manage your employee’s personal and salary details.
                </Typography.Text>
            ),
        },
        {
            title: 'Active Employees',
            description: (
                <Typography.Text className="font-thin text-white">
                    Get a quick snapshot of your employees.
                </Typography.Text>
            ),
            target: () => activeEmployessRef.current,
        },
        {
            title: 'Total Salary',
            description: (
                <Typography.Text className="font-thin text-white">
                    Gain insight into your organization's salary expenditures.
                </Typography.Text>
            ),
            target: () => totalSalaryRef.current,
        },
        {
            title: 'Next Month Salary',
            description: (
                <Typography.Text className="font-thin text-white">
                    Plan for upcoming payments.
                </Typography.Text>
            ),
            target: () => nextMonthSpendsRef.current,
        },
        {
            title: 'Employees',
            description: (
                <Typography.Text className="font-thin text-white">
                    Dive into detailed employee information.
                </Typography.Text>
            ),
            target: () => employeesRef.current,
        },
        {
            title: 'Salary',
            description: (
                <Typography.Text className="font-thin text-white">
                    View individual salary details.
                </Typography.Text>
            ),
            target: () => salaryRef.current,
        },
        {
            title: 'Leaves',
            description: (
                <Typography.Text className="font-thin text-white">
                    Manage and track employee leave requests.
                </Typography.Text>
            ),
            target: () => leavesRef.current,
        },
        {
            title: 'Announcements',
            description: (
                <Typography.Text className="font-thin text-white">
                    Create new announcements and send it to your employees.
                </Typography.Text>
            ),
            target: () => announcementsRef.current,
        },
        {
            title: 'Reimbursement',
            description: (
                <Typography.Text className="font-thin text-white">
                    Track employee reimbursement requests.
                </Typography.Text>
            ),
            target: () => reimbursementRef.current,
        },
        {
            title: 'Documents and Assets',
            description: (
                <Typography.Text className="font-thin text-white">
                    Access important employee documents.
                </Typography.Text>
            ),
            target: () => documentRef.current,
        },
        {
            title: 'Process Salary',
            description: (
                <Typography.Text className="font-thin text-white">
                    Streamline your payroll process.
                </Typography.Text>
            ),
            target: () => processSalaryRef.current,
            placement: 'top',
        },
        {
            title: 'Add Employee',
            description: (
                <Typography.Text className="font-thin text-white">
                    Easily onboard new team members.
                </Typography.Text>
            ),
            target: () => addEmployeeRef.current,
            placement: 'top',
        },
        {
            title: 'Add Leave',
            description: (
                <Typography.Text className="font-thin text-white">
                    Manage employee leave requests effectively.
                </Typography.Text>
            ),
            target: () => addLeaveRef.current,
            placement: 'top',
        },
        {
            title: 'HR Settings',
            description: (
                <Typography.Text className="font-thin text-white">
                    Manage your HR Settings here.
                </Typography.Text>
            ),
            target: () => hrSettingsRef.current,
            placement: 'top',
        },
        {
            title: 'View Calendar',
            description: (
                <Typography.Text className="font-thin text-white">
                    Stay organized with holidays and events.
                </Typography.Text>
            ),
            target: () => viewCalendarRef.current,
        },
        {
            title: 'Payroll Graph',
            description: (
                <Typography.Text className="font-thin text-white">
                    View your monthly salary expenditures here.
                </Typography.Text>
            ),
            target: () => chartRef.current,
            placement: 'top',
        },
    ];
    const { data, activities, isLoading } = useDashboardApi();
    console.log('dataaa', data?.activeEmployees);

    const navMenuDetails = [
        {
            icon: navItemEmployees,
            title: 'Employees',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.employees}`,
            ref: employeesRef,
        },

        {
            icon: navItemPayroll,
            title: 'Salary',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.employeesSalary}`,
            ref: salaryRef,
        },
        {
            icon: navItemTime,
            title: 'Leaves',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.employeeLeave}`,
            ref: leavesRef,
        },
        {
            icon: navItemAnnouncement,
            title: 'Announcements ',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.activityCalendar}/${paths.payroll.announcements}`,
            ref: announcementsRef,
        },
        {
            icon: navItemReimbursement,
            title: 'Reimbursements',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.employeeReimbursement}`,
            ref: reimbursementRef,
        },
        {
            icon: document,
            title: 'Documents and Assets',
            isActive: true,
            link: `/${paths.payroll.index}/${paths.payroll.documentsAndAssets}`,
            ref: documentRef,
        },
        {
            icon: benefitsIcon,
            title: 'Benefits',
            isActive: true,
            link: `${paths.dashboard.hike}`,
            ref: documentRef,
        },
    ];
    const dashboardDetails = [
        {
            title: 'Active Employees',
            value: data?.activeEmployees,
            isCurrency: false,
            icon: employers,
            bgColor: 'bg-[#F3FFEF]',
            ref: activeEmployessRef,
        },
        {
            title: 'Total Salary',
            value: data?.totalSalary,
            isCurrency: true,
            icon: totalSalary,
            bgColor: 'bg-[#FFF6F2]',
            ref: totalSalaryRef,
        },
        {
            title: 'Next Month Salary',
            value: data?.nextMonthSalary,
            isCurrency: true,
            icon: prevSalaray,
            bgColor: 'bg-[#FFF0FC]',
            ref: nextMonthSpendsRef,
        },
    ];

    return (
        <>
            <DashboardHeader
                addEmployee={addEmployeeRef}
                addLeave={addLeaveRef}
                hrSettings={hrSettingsRef}
                processSalary={processSalaryRef}
            />
            <Divider
                className="p-0 m-0 -ml-10 "
                style={{ width: screens.xxl ? '105.8%' : '106.6%' }}
            />
            <Input
                placeholder="Search"
                suffix={<SearchOutlined />}
                className="rounded-none xs:flex md:hidden"
            />
            <Row>
                <Col md={18} className="py-10">
                    <Row gutter={[10, 40]} className="md:pr-8">
                        {dashboardDetails.map((item, i) => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={12}
                                xl={8}
                                xxl={8}
                                key={i}
                                className="flex justify-center min-h-16"
                            >
                                <InfoCard
                                    title={item.title}
                                    value={item.value}
                                    icon={item.icon}
                                    isCurrency={item.isCurrency}
                                    key={i}
                                    bgColor={item.bgColor}
                                    reference={item.ref}
                                />
                            </Col>
                        ))}
                        <Row className="w-full md:justify-between" justify="center">
                            {navMenuDetails.map((item, i) => (
                                <Col key={i} className="flex justify-center p-1 lg:p-3">
                                    <NavigationCards
                                        icon={item.icon}
                                        title={item.title}
                                        isActive={item.isActive}
                                        link={item.link}
                                        reference={item.ref}
                                    />
                                </Col>
                            ))}
                        </Row>
                        <Col span={24}>
                            <Flex vertical className="w-full">
                                <Typography.Text
                                    className="font-medium "
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    Number of added employees: {count} employees
                                </Typography.Text>

                                <Flex
                                    align={md ? 'center' : 'self-start'}
                                    gap={10}
                                    className="flex-col w-full mt-2 align-middle md:flex-row"
                                >
                                    <Progress
                                        className="w-full mt-2 md:w-7/12"
                                        percent={calculatePercentage(count, addonData?.maxLimit)}
                                        strokeColor="#05BE63"
                                    />
                                    <Typography.Text className="flex-wrap text-xs sm:text-base">
                                        {Number(addonData?.maxLimit) - Number(count)} Left of{' '}
                                        {addonData?.maxLimit} Employees
                                    </Typography.Text>

                                    {user?.roleName !== 'corporate sub user' && (
                                        <Button
                                            danger
                                            type="default"
                                            className="px-4 ml-auto text-xs font-medium w-fit"
                                            size="small"
                                            onClick={() =>
                                                navigate(`${paths.payroll.hrSettings}?activeTab=6`)
                                            }
                                        >
                                            Upgrade
                                        </Button>
                                    )}
                                </Flex>
                                {date && (
                                    <Typography.Text
                                        className="font-medium text-gray-400"
                                        style={{ fontSize: '0.9rem' }}
                                    >
                                        Last employee added on {formattedDateOnly(new Date(date!))}
                                    </Typography.Text>
                                )}
                            </Flex>
                        </Col>
                        <Col xs={0} sm={0} md={24} lg={24} xl={24}>
                            <Chart reference={chartRef} />
                        </Col>
                    </Row>
                </Col>

                <Col className="border-1 min-h-40" md={6} xs={0}>
                    {isLoading ? (
                        <>
                            {Array.from(
                                { length: activities.length || 5 },
                                (
                                    _,
                                    i // Default to 5 if activities.length is zero or activities is undefined
                                ) => (
                                    <div key={i}>
                                        <Skeleton.Input
                                            style={{ width: 200, marginBottom: 8, marginTop: 4 }}
                                            active
                                            size="small"
                                        />
                                        <Skeleton
                                            style={{ width: 700, marginBottom: 8, marginTop: 4 }}
                                            active
                                            title={false}
                                            paragraph={{ rows: 1, width: ['50%', '100%'] }}
                                        />
                                        <Skeleton
                                            style={{ width: 700, marginBottom: 8, marginTop: 4 }}
                                            active
                                            title={false}
                                            paragraph={{ rows: 1, width: ['50%', '100%'] }}
                                        />
                                    </div>
                                )
                            )}
                        </>
                    ) : (
                        <List
                            className="md:border-l md:border-b"
                            style={{ minHeight: '133vh' }}
                            bordered={false}
                            dataSource={activities}
                            header={
                                <Flex
                                    className="pl-6 mt-4 mb-2"
                                    justify="space-between"
                                    style={{ borderBottom: 'none' }}
                                >
                                    <Typography.Text className="text-xl font-medium">
                                        Activities
                                    </Typography.Text>
                                    <Link
                                        to={`/${paths.payroll.index}/${paths.payroll.activityCalendar}`}
                                    >
                                        <Typography.Text
                                            ref={viewCalendarRef}
                                            className="text-base"
                                            style={{ color: colorPrimary }}
                                        >
                                            View Calendar
                                        </Typography.Text>
                                    </Link>
                                </Flex>
                            }
                            renderItem={(item, i) => (
                                <List.Item key={i}>
                                    <Flex className="pl-8 mt-2" vertical gap="small">
                                        <Typography.Text className="text-base font-medium">
                                            {item.title}
                                        </Typography.Text>
                                        <Typography.Paragraph>{item.body}</Typography.Paragraph>
                                        <Typography.Text className="text-end text-textGreen">
                                            {item.start.substring(0, 10)}
                                        </Typography.Text>
                                    </Flex>
                                </List.Item>
                            )}
                        />
                    )}
                </Col>
                <Flex className="xs:block md:hidden" vertical>
                    <Typography.Title className="ml-3" level={5}>
                        Activities
                    </Typography.Title>
                    <Row gutter={[40, 40]} className="mt-5">
                        {isLoading ? (
                            <Skeleton.Input
                                style={{ width: 200, marginBottom: 8, marginTop: 4 }}
                                active
                                size="small"
                            />
                        ) : (
                            activities.map((item, i) => (
                                <Col xs={24} sm={12} md={8} lg={8} xl={8} key={i}>
                                    <UpcomingActivityCard
                                        isLoading={isLoading}
                                        date={item.start}
                                        title={item.title}
                                        description={item.body}
                                        type={item.type}
                                    />
                                </Col>
                            ))
                        )}
                    </Row>
                </Flex>
                {user && user && user?.productTour?.payroll && md && (
                    <Tour
                        className="border rounded-md border-highLightBlue"
                        open={user?.productTour?.payroll && open}
                        disabledInteraction
                        onFinish={() => {
                            if (!open) {
                                setOpen(false);
                                handleUpdateTour('payroll');
                            }
                        }}
                        onClose={() => {
                            setOpen(false);
                            handleUpdateTour('payroll');
                        }}
                        steps={steps}
                        arrow
                        animated
                        type="primary"
                        placement="bottom"
                        scrollIntoViewOptions
                        indicatorsRender={(current, total) => <></>}
                    />
                )}
            </Row>
        </>
    );
};

export default Dash;
