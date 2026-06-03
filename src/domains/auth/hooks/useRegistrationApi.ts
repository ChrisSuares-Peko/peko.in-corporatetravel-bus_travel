import { useState } from 'react';

import clevertap from 'clevertap-web-sdk';

import { Scope } from '@src/enums/enums';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { signUp } from '../api';
import { nextStep, setLoginData } from '../slices/registerSlice';
import { ResgistrationResponse } from '../types';

export default function useRegistrationApi() {
    const dispatch = useAppDispatch();
    const { formData } = useAppSelector(state => state.reducer.registration);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = async (otp: string) => {
        if (otp.length < 6) {
            dispatch(
                showToast({
                    description: 'Please enter a valid OTP',
                    variant: 'warning',
                })
            );
            return;
        }
        setIsLoading(true);
        const payload = {
            contactPersonName: formData.contactPersonName,
            countryCode: 971,
            mobileNo: formData.phonenumber,
            email: formData.email,
            name: formData.name,
            password: formData.password,
            phoneOtp: otp,
            scope: Scope.MOBILE,
            referralCode: formData.referralCode,
        };
        const response: ResgistrationResponse | false = await signUp(payload);

        if (response) {
            clevertap.onUserLogin.push({
                Site: {
                    Identity: formData.email,
                    // Name: formData.contactPersonName,
                },
            });

            // clevertap.event.push('loginPage', {
            //     Page: 'logiPage',
            //     Action: 'user logined',
            // });

            clevertap.event.push('userSignup', {
                Page: 'signup page',
                Action: 'user joined',
            });
            dispatch(setLoginData({ ...response }));
            dispatch(nextStep());
            setIsLoading(false);
        } else {
            setIsError(true);
            setIsLoading(false);
        }
    };

    return { handleSignup, isError, isLoading };
}
