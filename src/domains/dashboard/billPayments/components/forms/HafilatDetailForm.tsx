import React from 'react';

import { Button, Col, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { useHafilatApi } from '../../hooks/hafilat/useHafilatApi';
import useHafilatPayment from '../../hooks/hafilat/useHafilatPayment';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';
import { haflatSchema } from '../../schema/HafilatDarb';
import { hafilatPaymentPayload } from '../../types/haflat';

// eslint-disable-next-line arrow-body-style
const TaflatDetailForm = () => {
    const { limitData } = useFetchLimitApi('hafilat');
    const { getBalance } = useHafilatApi();
    const { handleSubmission } = useHafilatPayment();
    const navigate = useNavigate();
    const item = useAppSelector(state => state.reducer.billPayment);

    return (
        <Formik
            initialValues={{
                cardNumber: item?.beneficiary ? item?.beneficiary?.accountNo : '',
            }}
            validationSchema={haflatSchema}
            enableReinitialize
            onSubmit={async values => {
                const flexiKey = limitData?.flexiKey ?? '';
                const res = await getBalance(values.cardNumber, flexiKey);

                if (res === false) return;

                if (res.ProductDetails[0].ItemInfo === null) {
                    const postData: hafilatPaymentPayload = {
                        account: values.cardNumber,
                        amount: Number(res.dueBalanceInAed),
                        flexiKey,
                        typeKey: limitData?.typeKey ?? 0,
                        optionals: {
                            ProductCode: res.ProductDetails[0].ProductCode,
                            isTPurse:
                                res.ProductDetails[0].ProductCategory === 'tpurse' ? '1' : '0',
                            customerMobileNo: '',
                            itemCode: '',
                        },
                        transactionId: res.TransactionId,
                    };
                    handleSubmission(postData);
                }

                if (res.ProductDetails[0].ItemInfo !== null) {
                    navigate(paths.billPayments.hafilatDetails, {
                        state: {
                            res,
                            cardNumber: values.cardNumber,
                            mobileNumber: '',
                            flexiKey,
                            typeKey: limitData?.typeKey ?? 0,
                        },
                    });
                }
            }}
            validateOnMount
        >
            {({ handleSubmit, setFieldValue, isSubmitting }) => (
                <Form layout="vertical" onFinish={handleSubmit} className="mt-6">
                    <Flex wrap="wrap" className="flex-col sm:flex-row">
                        <Col className="sm:mr-5">
                            <TextInput
                                label="Card Serial Number"
                                name="cardNumber"
                                allowNumbersOnly
                                type="text"
                                isRequired
                                maxLength={30}
                                placeholder="Enter Card Serial Number"
                                classes="sm:w-[18rem]"
                            />
                        </Col>
                    </Flex>
                    <Button
                        htmlType="submit"
                        loading={isSubmitting}
                        type="primary"
                        danger
                        className="mt-4 px-5"
                    >
                        View Bill
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default TaflatDetailForm;
