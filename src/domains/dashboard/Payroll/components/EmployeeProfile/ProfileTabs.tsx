import type { FC } from 'react';
import { useState } from 'react';

import { Tabs, TabsProps, Grid } from 'antd';
import Lottie from 'react-lottie';

import animation from '@src/assets/animation/Employee-Loader.json';

import BankDetails from './BankDetails';
import Documents from './Documents';
import EmployeeInfo from './EmployeeInfo';
import PersonalInformation from './PersonalInformation';
import SalaryInfo from './SalaryInfo';

const { useBreakpoint } = Grid;

interface ProfileTabsProps {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileTabs: FC<ProfileTabsProps> = ({ isLoading, setIsLoading }: ProfileTabsProps) => {
    const screens = useBreakpoint();

    const [activeTab, setActiveTab] = useState<string>('1');
    const [bankDetails, setBankDetails] = useState({});

    // for switching tabs
    const nextTab = (key: string) => {
        setItems(
            items!.map(item => ({
                ...item,
                disabled: key < item.key,
            }))
        );
        setActiveTab(key);
    };
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };
    const [items, setItems] = useState<TabsProps['items']>([
        {
            key: '1',
            label: 'Personal Information',
            children: <PersonalInformation nextTab={nextTab} />,
            disabled: false,
        },
        {
            key: '2',
            label: 'Employee Information',
            children: <EmployeeInfo nextTab={nextTab} />,
            disabled: true,
        },
        {
            key: '3',
            label: 'Salary Information',
            children: <SalaryInfo nextTab={nextTab} />,

            disabled: true,
        },
        {
            key: '4',
            label: 'Documents',
            children: <Documents nextTab={nextTab} />,

            disabled: true,
        },
        {
            key: '5',
            label: 'Bank Details',
            children: (
                <BankDetails
                    nextTab={nextTab}
                    formData={bankDetails}
                    setFormData={setBankDetails}
                    setLoading={setIsLoading}
                    loading={isLoading}
                />
            ),
            disabled: true,
        },
    ]);

    return (
        <>
            {isLoading ? (
                <Lottie options={defaultOptions} height={200} width={200} />
            ) : (
                <Tabs
                    className="mt-[1rem] sm:mt-0"
                    animated={{ inkBar: true, tabPane: false }}
                    activeKey={activeTab}
                    onChange={nextTab}
                    size={screens.sm ? 'large' : 'small'}
                    items={items}
                    centered={screens.md}
                />
            )}
        </>
    );
};

export default ProfileTabs;
