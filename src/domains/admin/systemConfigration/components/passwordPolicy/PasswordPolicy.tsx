import React from 'react';

import { Form } from 'antd';
import { Formik } from 'formik';

import FormComponent from './FormComponent';
import useGetPasswordPolicies from '../../hooks/useGetPasswordPolicies';
import { policySchema } from '../../schema';
import { PasswordPolicy as passwordPolicie } from '../../types/PasswordPolicy';

const PasswordPolicy = () => {
    const { respData, isLoading, updatePolicies, setRefresh } = useGetPasswordPolicies();

    const initialvalues: passwordPolicie = {
        level: 1,
        minLength: 0,
        minPasswordAge: 0,
        maxPasswordAge: 0,
        minChangeChars: 0,
        prohibitPasswordReuseTimes: 0,
    };
    return (
        <Formik
            enableReinitialize
            validationSchema={policySchema}
            initialValues={respData || initialvalues}
            onSubmit={async values => {
                if (values.id || values.createdAt || values.updatedAt) {
                    delete values.createdAt;
                    delete values.updatedAt;
                }
                await updatePolicies(values);
                setRefresh(p => !p);
            }}
        >
            {({ handleSubmit, values }) => (
                <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                    <FormComponent values={values} isLoading={isLoading} id={respData?.id} />
                </Form>
            )}
        </Formik>
    );
};
export default PasswordPolicy;
