import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
    ActivateCodeResponse,
    ActivationCode,
    subscriptionCodeResponse,
} from '@customtypes/general';
import { paths } from '@src/routes/paths';
import { checkCouponCode, activateCouponCode } from '@src/services/subscription';

import { useAppSelector } from './store';
import useUserInfo from './useUserInfo';

export default function useSubscriptionCodes() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [couponData, setCouponData] = useState<ActivationCode | null>(null);
    const navigate = useNavigate();
    const { getUserServicesData } = useUserInfo();
    const [initialSubmit, setInitialSubmit] = useState(true);

    const checkCouponIsValid = async (activationCode: string) => {
        setIsLoading(true);
        const data: subscriptionCodeResponse | false = await checkCouponCode({
            userId: id,
            userType: role,
            activationCode,
        });
        if (data) {
            setCouponData(data.activationCode);
            setInitialSubmit(false);
        }
        setIsLoading(false);
    };

    const activateSubscriptionCode = async (activationCode: string) => {
        setIsLoading(true);
        const data: ActivateCodeResponse | false = await activateCouponCode({
            userId: id,
            userType: role,
            activationCode,
        });
        if (data) {
            await getUserServicesData();
            navigate(`/${paths.plans.index}/${paths.plans.paymentsuccess}`, {
                state: { packageName: data.subscription.packageName },
            });
        }
        setIsLoading(false);
    };
    return { initialSubmit, isLoading, couponData, checkCouponIsValid, activateSubscriptionCode };
}
