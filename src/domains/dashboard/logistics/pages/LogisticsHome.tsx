import { useEffect, useRef, useState } from 'react';

import { Button, Col, Flex, Form, Grid, Image, Row, Skeleton, Tabs, Typography, theme } from 'antd';
import type { TabsProps } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import AramexLogo from '@domains/dashboard/logistics/assets/images/aramexLogo.png';
import sendParcel from '@domains/dashboard/logistics/assets/images/sendParcel.png';
import {
    Header,
    ReceiverDetails,
    SenderDetails,
    ShipmentType,
} from '@domains/dashboard/logistics/components';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import { setShipmentDetails } from '../slice/logisticsSlice';
import { RecieverFormValues, SenderFormValues, typeFormValues } from '../types/address';

const LogisticsHome = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();

    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [isSenderFormSubmitted, setIsSenderFormSubmitted] = useState(false);
    const [isRecieverFormSubmitted, setIsRecieverFormSubmitted] = useState(false);
    const handleSenderFormSubmit = (value: boolean) => setIsSenderFormSubmitted(value);
    const handleRecieverFormSubmit = (value: boolean) => setIsRecieverFormSubmitted(value);
    const [activeTabKey, setActiveTabKey] = useState('1');
    const navigate = useNavigate();
    useEffect(() => {
        if (isSenderFormSubmitted && isRecieverFormSubmitted) {
            navigate(`${paths.logistics.details}`);
        }
    }, [isSenderFormSubmitted, isRecieverFormSubmitted, navigate]);

    const senderFormRef = useRef<FormikProps<SenderFormValues>>(null);
    const recieverFormRef = useRef<FormikProps<RecieverFormValues>>(null);
    const typeRef = useRef<FormikProps<typeFormValues>>(null);
    const dispatch = useDispatch();

    const { shipmentDetails } = useAppSelector(state => state.reducer.logistics);
    const [selectedValue, setSelectedValue] = useState<string>(
        shipmentDetails.productGroup ? shipmentDetails.productGroup : 'DOM'
    );

    const handleTabChange = (key: string) => {
        setActiveTabKey(key);
    };

    useHideWidgetOnDrawer(true);

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Sender Details',
            children: (
                <SenderDetails
                    onFormSubmit={handleSenderFormSubmit}
                    senderFormRef={senderFormRef}
                    shipmentType={selectedValue}
                />
            ),
        },
        {
            key: '2',
            label: ' Receiver Details',
            children: (
                <ReceiverDetails
                    recieverFormRef={recieverFormRef}
                    shipmentType={selectedValue}
                    onFormSubmit={handleRecieverFormSubmit}
                />
            ),
        },
    ];

    const getContent = () => {
        if (Object.keys(screens).length === 0) {
            return <Skeleton />;
        }
        if (screens.xs)
            return (
                <>
                    <Tabs
                        className="mt-8 sm:hidden"
                        onChange={handleTabChange}
                        defaultActiveKey="1"
                        items={items}
                    />
                    <Row className="sm:hidden" justify="space-between">
                        <Col xs={0} sm={4} md={2} />
                        <Col span={7} className="flex justify-start md:pl-5 xs:pl-1">
                            <Button
                                style={{ backgroundColor: colorPrimary, color: 'white' }}
                                // htmlType="submit"
                                onClick={async () => {
                                    const senderFormValues = senderFormRef.current?.values;
                                    const receiverFormValues = recieverFormRef.current?.values;

                                    if (
                                        senderFormValues?.senderAddress !== '' &&
                                        senderFormValues?.senderAddress.replace(/\n|\s/g, '') ===
                                            receiverFormValues?.recieverAddress.replace(
                                                /\n|\s/g,
                                                ''
                                            )
                                    ) {
                                        dispatch(
                                            showToast({
                                                description:
                                                    'The sender and receiver addresses cannot be the same',
                                                variant: 'error',
                                            })
                                        );
                                    } else if (
                                        senderFormValues?.senderEmail !== '' &&
                                        senderFormValues?.senderEmail ===
                                            receiverFormValues?.recieverEmail
                                    ) {
                                        dispatch(
                                            showToast({
                                                description:
                                                    'The sender and receiver email addresses cannot be the same',
                                                variant: 'error',
                                            })
                                        );
                                    } else {
                                        senderFormRef.current?.handleSubmit();
                                        recieverFormRef.current?.handleSubmit();
                                        typeRef?.current?.handleSubmit();
                                    }
                                    // recieverFormRef.current?.resetForm()
                                }}
                                type="primary"
                                className="md:w-32 xs:w-36"
                            >
                                Next
                            </Button>
                        </Col>
                        <Col xs={0} sm={4} />
                        {/* <Col className="w-2/6 bg-slate-400" /> */}
                        <Col span={7} className="flex justify-end">
                            <Typography.Text className="hidden sm:block text-neutral-900 text-[.6rem] font-normal ">
                                Powered by
                            </Typography.Text>
                            <Image width={128} alt="Aramex" src={AramexLogo} />
                        </Col>
                        <Col xs={0} sm={3} />
                    </Row>
                </>
            );

        return (
            <Flex vertical justify="center" className="" style={{ width: '100%' }}>
                <Flex justify="center" className="hidden mt-2 sm:flex" style={{ width: '100%' }}>
                    <Flex align="center" vertical className="w-2/6">
                        <SenderDetails
                            onFormSubmit={handleSenderFormSubmit}
                            senderFormRef={senderFormRef}
                            shipmentType={selectedValue}
                        />
                        <Flex className="sm:w-10/12 xl:w-10/12">
                            <Button
                                danger
                                onClick={async () => {
                                    const senderFormValues = senderFormRef.current?.values;
                                    const receiverFormValues = recieverFormRef.current?.values;

                                    if (
                                        senderFormValues?.senderAddress !== '' &&
                                        senderFormValues?.senderAddress.replace(/\n|\s/g, '') ===
                                            receiverFormValues?.recieverAddress.replace(
                                                /\n|\s/g,
                                                ''
                                            )
                                    ) {
                                        dispatch(
                                            showToast({
                                                description:
                                                    'The sender and receiver addresses cannot be the same',
                                                variant: 'error',
                                            })
                                        );
                                    } else if (
                                        senderFormValues?.senderEmail !== '' &&
                                        senderFormValues?.senderEmail ===
                                            receiverFormValues?.recieverEmail
                                    ) {
                                        dispatch(
                                            showToast({
                                                description:
                                                    'The sender and receiver email addresses cannot be the same',
                                                variant: 'error',
                                            })
                                        );
                                    } else {
                                        senderFormRef.current?.handleSubmit();
                                        recieverFormRef.current?.handleSubmit();
                                        typeRef?.current?.handleSubmit();
                                    }
                                    // recieverFormRef.current?.resetForm()
                                }}
                                type="primary"
                                className="md:w-32 xs:w-36"
                            >
                                Next
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex align="center" className="w-1/6">
                        {' '}
                        <Image src={sendParcel} preview={false} />
                    </Flex>
                    <Flex align="center" vertical className="w-2/6">
                        <ReceiverDetails
                            recieverFormRef={recieverFormRef}
                            shipmentType={selectedValue}
                            onFormSubmit={handleRecieverFormSubmit}
                        />
                        <Flex className="justify-end sm:w-10/12 xl:w-10/12">
                            <Typography.Text className="hidden sm:block text-neutral-900 text-[.6rem] font-normal ">
                                Powered by
                            </Typography.Text>
                            <Image width={128} alt="Aramex" src={AramexLogo} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        );
    };

    return (
        <Content className="px-0 mb-8 ">
            <Header />
            <Formik
                enableReinitialize
                initialValues={{
                    shipmentType: shipmentDetails.productGroup
                        ? shipmentDetails.productGroup
                        : 'DOM',
                }}
                innerRef={typeRef}
                onSubmit={async ({ shipmentType }) => {
                    dispatch(setShipmentDetails({ productGroup: shipmentType || 'DOM' }));
                }}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <ShipmentType name="shipmentType" setSelectedValue={setSelectedValue} />
                    </Form>
                )}
            </Formik>

            {getContent()}
        </Content>
    );
};

export default LogisticsHome;
