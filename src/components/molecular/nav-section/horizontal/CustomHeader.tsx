/* eslint-disable import/order */
import { useEffect, useState } from 'react';

import { Avatar, Badge, Divider, Flex, Image, Popover, Typography, theme } from 'antd';
import clevertap from 'clevertap-web-sdk';
import { IoIosClose } from 'react-icons/io';

// import ClubIcon from '@assets/icons/Club.svg';

import { Link, useNavigate } from 'react-router-dom';

import NotificationIcon from '@assets/icons/Notification.svg';
import LogoutIcon from '@assets/svg/Logout.svg';
import pekoConnect from '@assets/svg/pekoConnect.svg';
import ChatService from '@components/molecular/freshChat/service/ChatService';
import { UserRole } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import useNotificationApi from '@src/hooks/useNotificationApi';
import useSubUserLogout from '@src/hooks/useSubuserLogout';
import useUserInfo from '@src/hooks/useUserInfo';
import { paths } from '@src/routes/paths';
import { formatNumberWithLocalString } from '@utils/priceFormat';
import formatString from '@utils/wordFormat';

import { handleLogout } from '../../../../services/handleLogout';
import NotificationsList from '../NotificationsList';

const CustomHeader = () => {
    const { resetNotificationCount } = useNotificationApi();
    useSubUserLogout();
    useUserInfo();
    const navigate = useNavigate();
    const { user, notifications } = useAppSelector(state => state.reducer.user);
    const { roleName, role, sessionId } = useAppSelector(state => state.reducer.auth);
    const freshChatDetails = useAppSelector(state => state.reducer.freshChat);
    const [open, setOpen] = useState(false);
    const { unreadChats, pendingRequests } = useAppSelector(state => state.reducer.chat);

    const email: string | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateEmail : user?.email;
    const mobile: string | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateMobile : user?.mobileNo;
    const credentialId: number | undefined =
        roleName === 'corporate sub user' ? user?.subCorporateCredential : user?.credentialId;

    // const restoreId: string | undefined = user?.chatId;
    const restoreId: string | undefined = freshChatDetails?.chatId;
    let userRole: string | undefined;
    let companyName: string | undefined;

    if (user) {
        userRole = user.role;
        // eslint-disable-next-line prefer-destructuring
        companyName = user.companyName;
    }

    const {
        token: { colorPrimary },
    } = theme.useToken();

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };

    const handleProfileClick = () => {
        navigate(role === UserRole.CORPORATE ? paths.dashboard.profile : paths.systemUser.profile);
    };

    const formatPhoneNumber = (phoneNumber: string | undefined) => {
        if (!phoneNumber) return undefined;
        const countryCode = '+971';
        return phoneNumber.startsWith('+') ? phoneNumber : `${countryCode}${phoneNumber}`;
    };

    useEffect(() => {
        profileClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const profileClick = () => {
        if (email && mobile) {
            updateUserProfile({
                email: user?.email,
                phone: user?.mobileNo,
                name: user?.contactPersonName,
            });
        }
        // navigate(role === UserRole.CORPORATE ? paths.dashboard.profile : paths.systemUser.profile);
    };

    const updateUserProfile = (users: any) => {
        const phonenumber = formatPhoneNumber(users.phone);
        clevertap.profile.push({
            Site: {
                Email: users.email,
                Phone: phonenumber,
                name: users.name,
            },
        });
    };

    return (
        <>
            {userRole === 'CORPORATE' && (
                <ChatService
                    name={companyName}
                    email={email}
                    mobile={mobile}
                    credentialId={credentialId}
                    restoreId={restoreId}
                    role={role}
                    sessionId={sessionId}
                />
            )}
            <Flex className="hidden w-full lg:flex" align="center" justify="flex-end" gap={22}>
                {roleName !== 'corporate sub user' && (
                    <Flex vertical align="center" justify="center">
                        <Typography.Text className="text-xs">Cashback</Typography.Text>
                        <Typography.Text className="text-sm font-semibold">
                            {`AED ${formatNumberWithLocalString(user?.balance! ?? 0)}`}
                        </Typography.Text>
                    </Flex>
                )}

                <Divider type="vertical" className="h-12" />

                {role === 'corporate' && (
                    <>
                        <Link to={paths.pekoClub.index}>
                            <Flex className="py-1 border-t border-b cursor-pointer border-brandColor">
                                <Typography.Text className="font-semibold text-brandColor">
                                    Peko Club
                                </Typography.Text>
                            </Flex>
                        </Link>
                        <Divider type="vertical" className="h-12" />

                        {user?.roleName === 'corporate' && (
                            <Link to={`${paths.dashboard.moreServices}/${paths.pekoConnect.index}`}>
                                <Flex className="cursor-pointer">
                                    <Badge
                                        count={unreadChats + pendingRequests || 0}
                                        offset={[-5, 5]}
                                    >
                                        <Avatar
                                            size={32}
                                            shape="square"
                                            src={pekoConnect}
                                            className="cursor-pointer "
                                        />
                                    </Badge>
                                </Flex>
                            </Link>
                        )}

                        <Divider type="vertical" className="h-12" />

                        <Popover
                            content={
                                <div className="px-4">
                                    {NotificationsList()}
                                    <Flex className="w-full py-4" justify="end">
                                        {(notifications?.data?.length ?? 0) > 0 && (
                                            <Link to={paths.dashboard.notifications}>
                                                <Typography.Link
                                                    className="text-sm"
                                                    style={{ color: colorPrimary }}
                                                    onClick={resetNotificationCount}
                                                >
                                                    See More
                                                </Typography.Link>
                                            </Link>
                                        )}
                                    </Flex>
                                </div>
                            }
                            trigger="hover"
                            overlayInnerStyle={{ padding: 0, minWidth: 260 }}
                            open={open}
                            title={() => (
                                <Flex className="px-8 py-4 border-b" justify="space-between">
                                    <Typography.Text className="text-lg font-semibold">
                                        Notifications
                                    </Typography.Text>
                                    <IoIosClose
                                        className="text-2xl cursor-pointer text-black/45"
                                        onClick={() => setOpen(false)}
                                    />
                                </Flex>
                            )}
                            placement="bottomRight"
                            onOpenChange={handleOpenChange}
                        >
                            <Badge count={notifications?.count || 0} offset={[-5, 5]}>
                                <Avatar
                                    onClick={resetNotificationCount}
                                    shape="circle"
                                    src={NotificationIcon}
                                    className="cursor-pointer"
                                />
                            </Badge>
                        </Popover>

                        <Divider type="vertical" className="h-12" />
                    </>
                )}

                <Flex
                    gap={10}
                    align="center"
                    onClick={handleProfileClick}
                    className="cursor-pointer"
                >
                    <Avatar
                        src={user?.logo}
                        size="large"
                        draggable={false}
                        className="bg-[#ffeeee]"
                    >
                        <Typography.Text
                            style={{ color: colorPrimary }}
                            className="text-2xl font-bold"
                        >
                            {user?.companyName?.slice(0, 1)}
                        </Typography.Text>
                    </Avatar>
                    <Flex vertical>
                        <Typography.Text className="text-xs font-semibold text-black">
                            {user?.companyName}
                        </Typography.Text>
                        <Typography.Text className="text-gray-400">
                            {formatString(user?.roleName)}
                        </Typography.Text>
                    </Flex>
                </Flex>

                <Image
                    src={LogoutIcon}
                    preview={false}
                    onClick={async () => {
                        await handleLogout();
                    }}
                    className="pl-4 cursor-pointer"
                />
            </Flex>
        </>
    );
};

export default CustomHeader;
