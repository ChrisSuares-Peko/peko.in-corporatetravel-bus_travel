import { useMemo, useState } from 'react';

import { Button, Col, Divider, Flex, Row, Typography, theme, Form, message } from 'antd';
import { Formik } from 'formik';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import CheckoutForm from '../components/CheckoutForm';
import CheckoutTable from '../components/CheckoutTable';
import CheckoutTextRow from '../components/CheckoutTextRow';
import usePayment from '../hooks/usePayment';
import { giftCardSchema } from '../schema/index';
import { setAddressData } from '../slices/checkoutSlice';

const CheckoutPage = () => {
    const dispatch = useAppDispatch();
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const onFinishFailed = () => {
        message.error('Submit failed!');
    };
    const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
    const { userDetails, formDetails } = useAppSelector(state => state.reducer.giftcardCheckout);
    const initialValues = useMemo(
        () => ({
            receiverFirstName: '',
            // receiverLastName: '',
            //  gender: '',
            receiverEmail: '',
            employee: [],
            //  receiverMobile: '',
            //  postcode: '',
            message: '',
            senderName: userDetails?.userName ?? '',
            // senderEmail: userDetails?.userEmail ?? '',
        }),
        [userDetails]
    );
    interface SelectedEmployee {
        receiverFirstName: string;
        receiverEmail: string;
    }
    const totalData = useAppSelector(state => state.reducer.giftcardCheckout.formDetails.product);
    const { handleSubmission } = usePayment();
    const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);
    useHideWidgetOnDrawer(true);

    return (
        <Row className="">
            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={giftCardSchema(formDetails.orderType, selectAllChecked)}
                onSubmit={async values => {
                    // await dispatch(setAddressData(values));
                    await dispatch(setAddressData({ ...values, employee: selectedEmployees }));

                    handleSubmission({
                        ...values,
                        employee: selectedEmployees,
                        orderType: formDetails.orderType,
                    });
                }}
            >
                {({ handleSubmit }) => (
                    <Form
                        onFinish={handleSubmit}
                        onFinishFailed={onFinishFailed}
                        layout="vertical"
                        className="w-full mt-1"
                    >
                        <Row>
                            <Col xs={24} md={16}>
                                <Row align="middle">
                                    <Col span={24} className="mt-2">
                                        <CheckoutTable />
                                    </Col>
                                    <Col span={24} className="md:py-5">
                                        <CheckoutForm
                                            setSelectedEmployees={setSelectedEmployees}
                                            setSelectAllChecked={setSelectAllChecked}
                                            selectAllChecked={selectAllChecked}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={0} md={1} />
                            <Col xs={24} md={7} className="md:p-2">
                                <Flex
                                    vertical
                                    className="p-6 mt-5 border border-gray-200 rounded md:mt-0"
                                >
                                    <Typography.Title level={5}>Total Amount</Typography.Title>
                                    <Flex vertical className="mt-4 " gap={15}>
                                        <CheckoutTextRow
                                            text="Subtotal"
                                            value={formatNumberWithLocalString(totalData)}
                                        />
                                        <CheckoutTextRow text="Discount" value="0.00" />
                                        <CheckoutTextRow text="VAT " value="0.00" />

                                        <Divider className="m-0" />

                                        <CheckoutTextRow
                                            text="Total"
                                            value={formatNumberWithLocalString(totalData)}
                                            bold
                                        />
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            danger
                                            style={{
                                                backgroundColor: colorPrimary,
                                                color: 'white',
                                            }}
                                        >
                                            Buy Now
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Formik>
        </Row>
    );
};

export default CheckoutPage;
