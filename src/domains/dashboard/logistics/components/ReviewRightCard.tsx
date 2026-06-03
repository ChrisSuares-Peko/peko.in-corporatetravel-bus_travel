import { Button, Divider, Flex, Form, Typography, theme } from 'antd';
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';

import { BoldText, GrayText } from './CustomText';
import useForm from '../hooks/useForm';
import { agreementSchema } from '../schema';
import { shippingAmount as shippingAmountType } from '../types';

const ReviewRightCard = ({ TaxAmount, TotalAmount, TotalAmountBeforeTax }: shippingAmountType) => {
    const { handleLogisticsSubmission } = useForm();
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <Flex gap={20} vertical className="justify-start h-full mt-4 sm:mt-0">
            <Flex
                justify="center"
                className="px-3 py-3 rounded-sm sm:rounded-md border-[1px] border-green-200 bg-green-50 "
            >
                <Typography.Text className="text-[.9rem] text-left font-normal text-textGreenTitle px-3">
                    Note: Book now and one of the Aramex agents will pick up the parcel/document
                    from your address
                </Typography.Text>
            </Flex>

            <Formik
                enableReinitialize
                initialValues={{
                    agreementOne: false,
                    agreementTwo: false,
                }}
                validationSchema={agreementSchema}
                onSubmit={values => {
                    handleLogisticsSubmission();
                }}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <CheckboxInput name="agreementOne" isRequired classes="">
                            <Typography.Text className="text-xs text-neutral-500">
                                {' '}
                                I have read and prepared all the documents required to export this
                                shipment from UAE
                            </Typography.Text>
                        </CheckboxInput>
                        <CheckboxInput name="agreementTwo" isRequired>
                            <Typography.Text className="text-xs text-neutral-500">
                                I accept the shipping{' '}
                                <Link
                                    className="text-gray-500"
                                    style={{
                                        color: 'gray',
                                        textDecoration: 'underline',
                                        WebkitTextUnderlinePosition: 'under',
                                    }}
                                    target="_blank"
                                    to="https://www.aramex.com/nl/en/aramex-conditions-of-carriage-terms-and-conditions"
                                >
                                    terms & conditions
                                </Link>{' '}
                                and the shield terms & conditions
                            </Typography.Text>
                        </CheckboxInput>

                        <Flex
                            gap={20}
                            vertical
                            className="h-auto px-8 py-6 border rounded-md border-stone-300 sm:rounded-xl"
                        >
                            <Typography.Text className="text-lg font-medium text-zinc-900">
                                Total Amount
                            </Typography.Text>
                            <Flex justify="space-between">
                                <GrayText text="Sub-total" />
                                <BoldText text={`AED ${TotalAmountBeforeTax}`} />
                            </Flex>
                            <Flex justify="space-between">
                                <GrayText text="VAT (5%)" />
                                <BoldText text={`AED ${TaxAmount.toFixed(2)}`} />
                            </Flex>

                            <Divider />
                            <Flex justify="space-between">
                                <BoldText text="Total" />
                                <BoldText text={`AED ${TotalAmount.toFixed(2)}`} />
                            </Flex>

                            <Button
                                style={{ backgroundColor: colorPrimary, color: 'white' }}
                                htmlType="submit"
                                type="primary"
                                className="w-full"
                            >
                                Pay Now
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default ReviewRightCard;
