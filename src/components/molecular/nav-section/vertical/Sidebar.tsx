import { Flex, Image, Menu, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@assets/mainLogo/standard';
import { paths } from '@src/routes/paths';

import { useNavData } from './SidebarData';

// Maps sidebar keys to human-readable service names for the Coming Soon screen.
const KEY_TO_SERVICE_NAME: Record<string, string> = {
    [paths.dashboard.home]: 'Dashboard',
    [paths.dashboard.billPayments]: 'Bill Payments',
    [paths.dashboard.payroll]: 'Payroll',
    [paths.dashboard.officeSupplies]: 'Office Supplies',
    [paths.dashboard.subscriptions]: 'Softwares',
    [paths.dashboard.logistics]: 'Logistics',
    [paths.dashboard.giftCards]: 'Gift Cards',
    [paths.dashboard.connect]: 'Marketplace',
    [paths.dashboard.accounting]: 'Tax & More',
    [paths.dashboard.invoicing]: 'The Collector',
    [paths.dashboard.einvoicing]: 'E-Invoicing',
    [paths.dashboard.insurance]: 'Insurance',
    [paths.dashboard.corporateCard]: 'Corporate Cards',
    [paths.dashboard.pekoCloud]: 'Peko Cloud',
    [paths.dashboard.moreServices]: 'More Services',
    [paths.dashboard.reports]: 'Reports',
    [paths.dashboard.needHelp]: 'Need Help',
    [paths.dashboard.settings]: 'Settings',
};

const transformNavData = (navData: any[]) =>
    navData?.map((item: { key: string }) => ({
        ...item,
        key: item.key || Math.random().toString(36).substring(2, 11),
        disabled: item.key === '',
    }));

const Sidebar = () => {
    const location = useLocation();
    const navData = useNavData();
    const navigate = useNavigate();
    const transformedNavData = transformNavData(navData!);

    const handleClick = ({ key }: { key: string }) => {
        if (key === '') {
            message.error('non clickable');
            return;
        }

        const isCorporateTravel = key.startsWith(paths.dashboard.corporateTravel);

        if (isCorporateTravel) {
            navigate(key);
            return;
        }

        // All other items show a Coming Soon placeholder.
        const baseKey = key.split('?')[0];
        const serviceName = KEY_TO_SERVICE_NAME[baseKey] || 'Service';
        navigate(`/coming-soon?service=${encodeURIComponent(serviceName)}`);
    };

    return (
        <div className="px-1 pb-4 overflow-x-hidden bg-white border-r border-gray-200 border-solid min-h-svh">
            <Flex className="w-full pt-2 pb-4 pl-6 ">
                <Image
                    src={logo}
                    alt="logo"
                    onClick={() => navigate('/dashboard')}
                    className="bg-transparent cursor-pointer"
                    preview={false}
                    width={120}
                />
            </Flex>
            <Menu
                mode="inline"
                items={transformedNavData}
                selectedKeys={[`/${location.pathname.split('/')[1]}`, location.pathname]}
                onClick={handleClick}
            />
        </div>
    );
};

export default Sidebar;
