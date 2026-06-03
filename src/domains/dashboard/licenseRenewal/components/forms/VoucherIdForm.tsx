import type { FC } from 'react';

import { Button, Form } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { useGetBillApi } from '../../hooks/useGetBillApi';
import { VocherIdSchema } from '../../schema';

const VoucherIdForm: FC = () => {
    const { getBalance, isLoading } = useGetBillApi();
    return (
        <Formik
            initialValues={{ voucherId: '' }}
            onSubmit={getBalance}
            validationSchema={VocherIdSchema}
        >
            {({ handleSubmit }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-16 w-100 sm:w-96">
                    <TextInput
                        label="Voucher ID"
                        name="voucherId"
                        placeholder="Voucher ID"
                        type="text"
                        showToolTip
                        tooltipText="Enter Voucher ID"
                        isRequired
                        allowNumbersOnly
                        maxLength={20}
                    />
                    <Button
                        danger
                        htmlType="submit"
                        type="primary"
                        loading={isLoading}
                        className="mt-3"
                    >
                        Get details
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default VoucherIdForm;
