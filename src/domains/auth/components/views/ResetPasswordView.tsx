import { useSearchParams } from 'react-router-dom';

import useGetPasswordPolicies from '../../hooks/useGetPasswordPolicies';
import usePasswordPolicyValidation from '../../hooks/usePasswordPolicyValidation';
import useResetPasswordApi from '../../hooks/useResetPasswordApi';
import ResetPassword from '../sections/ResetPassword';

const ResetPasswordView = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const username = searchParams.get('username');
    const isForgot = searchParams.get('isForgot');
    const { respData } = useGetPasswordPolicies(username);

    const { validatePassword } = usePasswordPolicyValidation(respData);
    const { handleResettPassword, isLoading } = useResetPasswordApi();

    const handleSubmit = (password: string) => {
        if (token && username && isForgot) {
            const payload = {
                password,
                token,
                username,
                isForgot,
            };
            handleResettPassword(payload);
        }
    };

    return (
        <ResetPassword
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            validatePassword={validatePassword}
            isForgot={isForgot?.toLowerCase() === 'true'}
        />
    );
};
export default ResetPasswordView;
