import React from 'react';

import { Form } from 'antd';
import { Formik } from 'formik';

import FormComponent from './FormComponent';
import useGetPasswordPolicies from '../../hooks/useGetPasswordPolicies';
import { protectionSchema } from '../../schema';
import { PasswordPolicy as passwordPolicie } from '../../types/PasswordPolicy';

const PasswordProtection = () => {
    const { isLoading, respData, updatePasswordProtection } = useGetPasswordPolicies();
    const initialvalues: passwordPolicie = {
        level: 1,
        minLength: 0,
        minPasswordAge: 0,
        maxPasswordAge: 0,
        minChangeChars: 0,
        prohibitPasswordReuseTimes: 0,
        maxInvalidLoginAttempts: 0,
        lockEffectivePeriod: 15,
        lockoutTimespan: 90,
        enableBannedPasswords: true,

        preventPersonalDataInPassword: false,
    };

    return (
        <Formik
            enableReinitialize
            validationSchema={protectionSchema}
            initialValues={respData || initialvalues}
            onSubmit={async values => {
                if (values.id || values.createdAt || values.updatedAt) {
                    delete values.createdAt;
                    delete values.updatedAt;
                    updatePasswordProtection(values);
                }
                updatePasswordProtection(values);
            }}
        >
            {({ handleSubmit, values }) => (
                <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <FormComponent values={values} isLoading={isLoading} />
                </Form>
            )}
        </Formik>
    );
};
export default PasswordProtection;
