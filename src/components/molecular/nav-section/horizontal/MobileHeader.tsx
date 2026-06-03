import React from 'react';

import { LeftOutlined } from '@ant-design/icons';
import { Avatar, Badge, Flex, Image, Typography, theme } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import NotificationIcon from '@assets/icons/Notification.svg';
import Support from '@assets/icons/Support.svg';
import Logo from '@assets/mainLogo/standard';
import LogoutIcon from '@assets/svg/Logout.svg';
import pekoConnectMobile from '@assets/svg/pekoConnectMobile.svg';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import useNotificationApi from '@src/hooks/useNotificationApi';
import { paths } from '@src/routes/paths';
import { handleLogout } from '@src/services/handleLogout';

const MobileHeader = () => {
    const { user, notifications } = useAppSelector(state => state.reducer.user);
    const { role } = useAppSelector(state => state.reducer.auth);
    const { unreadChats, pendingRequests } = useAppSelector(state => state.reducer.chat);
    const { resetNotificationCount } = useNotificationApi();

    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const isDash = pathSegments.includes('dashboard');
    let isSubroute =
        pathSegments[1] === 'system-user' ? pathSegments.length > 3 : pathSegments.length > 1;
    isSubroute = isDash ? false : isSubroute;

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const handleNotificationClick = () => {
        resetNotificationCount();
        navigate(paths.dashboard.notifications);
    };

    return (
        <Flex align="center" justify="space-between" className="pl-4">
            <Flex>
                {isSubroute && (
                    <LeftOutlined
                        className="cursor-pointer"
                        onClick={() => navigate(-1)}
                        style={{ marginRight: '4px', fontSize: '18px' }}
                    />
                )}
                <Image
                    src={Logo}
                    alt="logo"
                    className="bg-transparent cursor-pointer"
                    preview={false}
                    width={120}
                    onClick={() => navigate(paths.dashboard.home)}
                />
            </Flex>
            <Flex className="pr-5" gap={16} align="center">
                <Avatar
                    alt="Support icon"
                    size={28}
                    shape="square"
                    src={Support}
                    className={`cursor-pointer ${role === UserRole.SYSTEM ? 'hidden' : ''}`}
                    onClick={() => navigate(paths.dashboard.needHelp)}
                />
                {user?.roleName === 'corporate' ? (
                    <Link to={`${paths.dashboard.moreServices}/${paths.pekoConnect.index}`}>
                        <Flex className="cursor-pointer">
                            {/* <ReactSVG src={pekoConnectMobile} /> */}
                            <Badge
                                size="small"
                                count={unreadChats + pendingRequests || 0}
                                offset={[-5, 5]}
                            >
                                <Avatar
                                    alt="pekoConnect"
                                    size={28}
                                    shape="square"
                                    src={pekoConnectMobile}
                                    className="cursor-pointer "
                                />
                            </Badge>
                        </Flex>
                    </Link>
                ) : (
                    ''
                )}
                <Badge size="small" count={notifications?.count || 0} offset={[-10, 10]}>
                    <Avatar
                        shape="circle"
                        alt="NotificationIcon"
                        src={NotificationIcon}
                        className={`cursor-pointer ${role === UserRole.SYSTEM ? 'hidden' : ''}`}
                        onClick={() => handleNotificationClick()}
                    />
                </Badge>
                <Avatar
                    src={user?.logo}
                    alt="profile"
                    className="cursor-pointer bg-[#ffeeee]"
                    draggable={false}
                    onClick={() =>
                        navigate(
                            role === UserRole.CORPORATE
                                ? paths.dashboard.profile
                                : paths.systemUser.profile
                        )
                    }
                >
                    <Typography.Text
                        style={{ color: colorPrimary }}
                        className="text-2xl font-bold "
                    >
                        {user?.companyName?.slice(0, 1)}
                    </Typography.Text>
                </Avatar>
                {role === UserRole.SYSTEM && (
                    <Image
                        alt="LogoutIcon"
                        src={LogoutIcon}
                        preview={false}
                        onClick={async () => {
                            await handleLogout();
                        }}
                        className="pl-4 cursor-pointer"
                    />
                )}
            </Flex>
        </Flex>
    );
};

export default MobileHeader;
