import React, { useEffect, useState } from 'react';

import { Flex, Grid, Tabs, TabsProps } from 'antd';
import { useLocation } from 'react-router-dom';

import AssetsTab from '../components/employeeDetails/AssetsTab';
import DocumentsTab from '../components/employeeDetails/DocumentsTab';
import EmployeeDetailsHeader from '../components/employeeDetails/EmployeeDetailsHeader';
import InformationTab from '../components/employeeDetails/tabs/BasicInformationTab';
import SalaryInformationTab from '../components/employeeDetails/tabs/SalaryInformationTab';
import GetEmployeeDocuments from '../hooks/employeeHooks/useGetDocAndAssetApi';
import GetEmployeeDetails from '../hooks/employeeHooks/useGetEmployee';

type Props = {};

const EmployeeDetails = (props: Props) => {
    const screens = Grid.useBreakpoint();
    const location = useLocation();
    const { employeeId } = location.state;

    const [refState, setRefState] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const { data, getEmployeeDetails, isLoading } = GetEmployeeDetails(employeeId ?? '');
    const { employeeDocs, setRefresh, docCount, assetCount, assetData } = GetEmployeeDocuments(
        employeeId,
        currentPage
    );

    useEffect(() => {
        getEmployeeDetails();
    }, [getEmployeeDetails, refState]);

    const items: TabsProps['items'] = [
        {
            key: '0',
            label: '',
            // @ts-ignore
            // children: <InformationTab setRefState={setRefState} employeeData={data && data} />,
        },
        {
            key: '1',
            label: 'Information',
            // @ts-ignore
            children: (
                <InformationTab
                    // @ts-ignore
                    employeeData={data && data}
                    setRefState={setRefState}
                    isLoading={isLoading}
                />
            ),
        },
        {
            key: '2',
            label: 'Salary Information',
            children: (
                <SalaryInformationTab
                    setRefState={setRefState}
                    // @ts-ignore
                    employeeData={data && data}
                    isLoading={isLoading}
                />
            ),
        },
        {
            key: '3',
            label: 'Documents',

            children: (
                <DocumentsTab
                    // @ts-ignore
                    employeeData={data && data}
                    isLoading={isLoading}
                    employeeDocs={employeeDocs}
                    setRefresh={setRefresh}
                    count={docCount}
                    setCurrentPage={setCurrentPage}
                />
            ),
            disabled: false,
        },
        {
            key: '4',
            label: 'Assets',
            children: (
                <AssetsTab
                    // @ts-ignore
                    employeeData={data && data}
                    isLoading={isLoading}
                    assetData={assetData}
                    setRefresh={setRefresh}
                    count={assetCount}
                    setCurrentPage={setCurrentPage}
                />
            ),
            disabled: false,
        },
    ];
    return (
        <Flex vertical>
            <EmployeeDetailsHeader data={data && data} setRefState={setRefState} />
            <Tabs
                defaultActiveKey="1"
                className="w-full mt-2 -ml-10"
                items={items}
                style={{ width: screens.xxl ? '105.5%' : '106.5%' }}
                // style={{ width: screens.xxl ? '105.5%' : '110.5%' }}
            />
        </Flex>
    );
};

export default EmployeeDetails;
