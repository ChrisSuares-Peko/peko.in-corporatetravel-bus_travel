/* eslint-disable react/no-unescaped-entities */
import { Flex, Typography } from 'antd';
import Lottie from 'react-lottie';

import animation from '@assets/success-animation.json';
// eslint-disable-next-line import/no-cycle
import { TAB_ID } from '@src/App';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { loginSuccess } from '../../slices/loginSlice';
import { resetRegisterState } from '../../slices/registerSlice';

const { Title } = Typography;
const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
    },
};

const RegisterStepFive = () => {
    const dispatch = useAppDispatch();
    const { loginData, formData } = useAppSelector(state => state.reducer.registration);
    const authChannel = new BroadcastChannel('authChannel');

    const handleLogin = () => {
        dispatch(loginSuccess({ ...loginData, isAuthenticated: true }));
        authChannel.postMessage({ type: 'login', tabId: TAB_ID });

        dispatch(resetRegisterState());
    };

    return (
        <Flex vertical align="center" justify="center" gap={18} className="text-center h-svh">
            <Lottie options={defaultOptions} height={100} width={100} />
            <Title level={3}>Thanks for the registration</Title>
            <Typography.Text className="px-5 w-96 sm:px-0">
                Your Peko business account has been successfully created. It's time to initiate the
                revolution in your business.
            </Typography.Text>
            <Typography.Text
                onClick={() => handleLogin()}
                className="px-5 py-2 text-lg border border-red-600 cursor-pointer text-iconRed"
            >
                Go to Dashboard
            </Typography.Text>
        </Flex>
    );
};

export default RegisterStepFive;
