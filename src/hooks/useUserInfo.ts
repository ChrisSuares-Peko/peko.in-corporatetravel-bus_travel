/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react';

import {
    PurchasedListResponse,
    ServicesListResponse,
    UserInfoResponse,
} from '@customtypes/general';
import { loginSuccess } from '@src/domains/auth/slices/loginSlice';
// import { handleLogout } from '@src/services/handleLogout';
import { getUserInfo, getUserServices } from '@src/services/userInfo';
// import { showToast } from '@src/slices/apiSlice';
import { setServices } from '@src/slices/servicesSlice';
import { setSubscriptions } from '@src/slices/subscriptionSlice';
import { setUserInfo } from '@src/slices/userSlice';

// import socket from './socket';
import { useAppDispatch, useAppSelector } from './store';

export default function useUserInfo() {
    const dispatch = useAppDispatch();
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const { user } = useAppSelector(state => state.reducer.user);
    const { services } = useAppSelector(state => state.reducer.services);
    const [isLoading, setIsLoading] = useState(true);
    // const authChannel = new BroadcastChannel('authChannel');
    const getUserData = useCallback(async () => {
        const data: UserInfoResponse | false = await getUserInfo({
            userId: id,
            userType: role,
        });
        if (data) {
            dispatch(setUserInfo({ user: { ...data } }));
        }
    }, [id, role, dispatch]);

    const getUserServicesData = useCallback(async () => {
        const data: (ServicesListResponse & PurchasedListResponse) | false =
            await getUserServices();
        if (data) {
            dispatch(setServices({ services: { data: data.data } }));
            dispatch(
                setSubscriptions({
                    services: { userAccessibleServices: data.userAccessibleServices },
                })
            );
            dispatch(loginSuccess({ packageName: data.packageName }));
            setIsLoading(false);
        }
        setIsLoading(false);
    }, [dispatch]);

    useEffect(() => {
        if (user === null) {
            getUserData();
        }
    }, [getUserData, user]);
    // useEffect(() => {
    //     if (user) {
    //         socket.emit('join-room', user.credentialId);
    //         socket.on('block', data => {
    //             if (!data.isActive && user.credentialId === data.id) {
    //                 dispatch(
    //                     showToast({
    //                         description: data.message,
    //                         variant: 'error',
    //                     })
    //                 );
    //                 setTimeout(() => {
    //                     handleLogout();
    //                 }, 1000);
    //             }
    //         });
    //     }
    //     return () => {};
    // }, [user, id, dispatch, authChannel]);

    useEffect(() => {
        if (services === null) {
            getUserServicesData();
        } else {
            setIsLoading(false);
        }
    }, [getUserServicesData, services]);

    return { isLoading, getUserServicesData };
}
