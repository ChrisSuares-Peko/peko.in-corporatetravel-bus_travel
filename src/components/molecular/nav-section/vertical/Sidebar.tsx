import { Flex, Image, Menu, message } from 'antd';
import clevertap from 'clevertap-web-sdk';
import { useLocation, useNavigate } from 'react-router-dom';

import logo from '@assets/mainLogo/standard';
// import PekoOne from '@assets/svg/pekoOne.png';
import { PekoPackages } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';

import { useNavData } from './SidebarData';

const transformNavData = (navData: any[]) =>
    navData?.map((item: { key: string }) => ({
        ...item,
        key: item.key || Math.random().toString(36).substring(2, 11), // Assign a random key if key is empty
        disabled: item.key === '', // Keep the disabled property as it is
    }));
const Sidebar = () => {
    const location = useLocation();
    const navData = useNavData();

    const navigate = useNavigate();
    const transformedNavData = transformNavData(navData!);

    const { packageName, role } = useAppSelector(state => state.reducer.auth);

    const handleClick = (key: string) => {
        const path = key.replace(/^\//, '');
        const excludedKeys = ['more-services', 'reports', 'need-help', 'settings'];
        if (excludedKeys.includes(path)) {
            // console.log(`${path} is excluded from event tracking.`);
            return;
        }

        clevertap.event.push(path, {
            Page: path,
            Action: `${path} clicked`,
            // Email: user?.email,
        });
    };

    return (
        <div className="px-1 pb-4 overflow-x-hidden bg-white border-r border-gray-200 border-solid min-h-svh">
            <Flex className="w-full pt-2 pb-4 pl-6 ">
                <Image
                    src={
                        packageName === PekoPackages.Basic || role !== 'corporate' ? logo : logo // PekoOne
                    }
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
                onClick={({ key }) => {
                    if (key !== '') {
                        handleClick(key);
                        navigate(key);
                    } else {
                        message.error('non clickable');
                    }
                }}
            />
        </div>
    );
};

export default Sidebar;
