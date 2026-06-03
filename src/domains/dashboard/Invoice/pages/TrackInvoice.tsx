import React, { useEffect, useState } from 'react';

import { Col, Flex, List, Row, Skeleton, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { ReactSVG } from 'react-svg';

import email from '@domains/dashboard/Invoice/assets/mail.svg';
import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import EditGuideline from '../components/Guideline/EditGuideline';
import { SendEmailModal } from '../components/SendEmailModal';
import Tracker from '../components/Tracker';
import TrackerDetailsCard from '../components/TrackerDetailsCard';
import useGetAllGuidelines from '../hooks/useGetAllGuidelines';
import useGuidelines from '../hooks/useGuidelines';
import useTrackDetails from '../hooks/useTrackDetails';
import { DaysSchema } from '../schema';
import { setTrackerData } from '../slices/InvoicesSlices';
import '../assets/style.css';

const TrackInvoice = () => {
    const dispatch = useDispatch();
    const { invoiceId } = useAppSelector(store => store.reducer.invoices);
    const { trackerData, dataSource, Loading } = useTrackDetails(invoiceId);
    const { data, guidelineUpdate, isLoading } = useGuidelines(invoiceId);
    const { guideline } = useGetAllGuidelines(invoiceId);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        dispatch(setTrackerData(trackerData));
    }, [trackerData, dispatch]);

    const comments = trackerData?.comments?.replace(/"/g, '');
    const date = new Date(trackerData?.createdAt);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const paymentmode = trackerData?.paymentMode
        .split(' ')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    const statusStyles: any = {
        PAID: {
            text: 'text-green-600',
            background: 'bg-green-100',
            border: 'border-green-200',
        },
        PENDING: {
            text: 'text-yellow-700',
            background: 'bg-yellow-100',
            border: 'border-yellow-300',
        },
        EXPIRED: {
            text: 'text-[#D97B7B]',
            background: 'bg-[#FFC2C2]',
            border: 'border-[#d87e7e]',
        },
    };

    const TrackList = [
        {
            field: 'Invoice Number',
            value: trackerData?.invoiceDetails?.invoiceNo,
        },
        {
            field: 'Invoice Created Date',
            value: formattedDate,
        },
        {
            field: 'Customer Name',
            value: trackerData?.recipientDetails?.customerName,
        },
        {
            field: 'Customer Email ID',
            value: trackerData?.recipientDetails?.customerEmail,
        },
        {
            field: 'Customer Mobile Number',
            value: trackerData?.recipientDetails?.customerPhone,
        },
        {
            field: 'Payment Mode',
            value: paymentmode,
        },
        ...(paymentmode === 'Payment Link' &&
        trackerData?.paymentLink !== null &&
        trackerData?.status !== 'PAID'
            ? [
                  {
                      field: 'Payment Link',
                      value: trackerData?.paymentLink,
                      isCopyable: true,
                  },
              ]
            : []),
        {
            field: 'Amount',
            value: trackerData?.amount,
        },
        {
            field: 'Invoice Status',
            value: trackerData?.status,
        },
        {
            field: 'Notes',
            value: trackerData?.comments && JSON.parse(trackerData?.comments) ? comments : 'N/A',
        },
    ];

    const transformedData = guideline.map(row => ({
        id: row?.id,
        days: row.days,
        sms: Boolean(row.sms),
        email: Boolean(row.email),
        notification: Boolean(row.notification),
        actionDate: row.actionDate,
        templet: {
            email: {
                emailId: row.templet?.email?.emailId || '',
                subject: row.templet?.email?.subject || '',
                body: row.templet?.email?.body || '',
                index: row.templet?.email?.index || '',
            },
            sms: {
                mobileNo: row?.templet?.sms?.mobileNo || '',
                body: row?.templet?.sms?.body || '',
                index: row?.templet?.sms?.index || 0,
            },
        },
        invoiceId: row.invoiceId,
        status: row.status,
    }));

    // const validateTemplates = (values: any) => {

    //     const isInvalid = values.data.some(
    //         (item: any) =>
    //             item.templet.email &&  item.templet.sms

    //     );
    //     console.log("is invalid",isInvalid)
    //     return isInvalid;
    // };
    const validateTemplates = (values: any) => {
        const isInvalid = values.data.some(
            (item: any) =>
                !item.templet.email.emailId &&
                !item.templet.email.subject &&
                !item.templet.email.body &&
                !item.templet.sms.mobileNo &&
                !item.templet.sms.body
        );
        return isInvalid;
    };

    const isValidate = (values: any) => {
        const isvalid = values.data.some((item: any) => !item.sms && !item.email);
        return isvalid;
    };

    return (
        <Content>
            {Loading ? (
                <Skeleton />
            ) : (
                <>
                    <Typography.Text className="text-xl font-medium">
                        Invoice Details
                    </Typography.Text>

                    <Row gutter={[30, 10]} className="mt-4">
                        <Col xs={24} xl={11}>
                            {trackerData && (
                                <TrackerDetailsCard data={trackerData} dataSource={dataSource} />
                            )}
                        </Col>
                        <Col xs={24} xl={13}>
                            <Flex vertical className="w-full px-3">
                                <Flex vertical className="mt-7">
                                    <Tracker data={trackerData} />
                                </Flex>
                                <List
                                    className="mt-5"
                                    dataSource={TrackList}
                                    renderItem={(item, index) => (
                                        <Row
                                            className={`py-4 px-6 ${index % 2 === 0 ? 'bg-listBg' : 'bg-white'} ${index === TrackList.length - 1 ? '' : 'border-none'}`}
                                            key={index}
                                        >
                                            <Col span={20}>
                                                <div className="flex justify-between">
                                                    <Typography.Text className="text-gray-600">
                                                        {item.field}
                                                    </Typography.Text>

                                                    {item.field === 'Invoice Status' ? (
                                                        (() => {
                                                            const style = statusStyles[item.value];
                                                            return style ? (
                                                                <Space
                                                                    className={`px-4 justify-center items-center font-medium py-1 rounded-full ${style.background} border ${style.border}`}
                                                                >
                                                                    <Typography.Paragraph
                                                                        className={`text-xs font-normal leading-none ${style.text}`}
                                                                    >
                                                                        {item.value.charAt(0) +
                                                                            item.value
                                                                                .slice(1)
                                                                                .toLowerCase()}
                                                                    </Typography.Paragraph>
                                                                </Space>
                                                            ) : null;
                                                        })()
                                                    ) : (
                                                        <>
                                                            {item.isCopyable ? (
                                                                <Typography.Text className="text-gray-600 ">
                                                                    <Typography.Paragraph
                                                                        copyable
                                                                        ellipsis
                                                                        className="m-0 w-36 text-red-500 custom-copyable"
                                                                    >
                                                                        {item.value}
                                                                    </Typography.Paragraph>
                                                                </Typography.Text>
                                                            ) : (
                                                                <Typography.Text className="text-gray-600">
                                                                    {item.value}
                                                                </Typography.Text>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </Col>
                                        </Row>
                                    )}
                                />
                            </Flex>
                            <Flex
                                gap={12}
                                className="ml-9 mt-4 cursor-pointer"
                                onClick={() => setModalVisible(true)}
                            >
                                <Typography.Text className="font-medium mt-1">
                                    Share
                                </Typography.Text>
                                <ReactSVG src={email} />
                            </Flex>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={24}>
                            {guideline.length > 0 && trackerData?.status !== 'PAID' && (
                                <Formik
                                    initialValues={{ data: transformedData }}
                                    onSubmit={values => {
                                        const isInvalid = validateTemplates(values);
                                        const isValid = isValidate(values);
                                        if (isValid) {
                                            dispatch(
                                                showToast({
                                                    description: 'Please select sms or email.',
                                                    variant: 'error',
                                                })
                                            );
                                        } else if (!isValid && isInvalid) {
                                            dispatch(
                                                showToast({
                                                    description:
                                                        'Please fill in at least one template(SMS or Email) for each item',
                                                    variant: 'error',
                                                })
                                            );
                                        } else {
                                            guidelineUpdate(values);
                                        }
                                    }}
                                    validationSchema={DaysSchema}
                                >
                                    {({ handleSubmit, values }) => (
                                        <form onSubmit={handleSubmit}>
                                            <Row>
                                                <Col
                                                    span={24}
                                                    className="md:mt-7 mt-7 xs:mb-12 md:mb-0"
                                                >
                                                    <EditGuideline
                                                        values={values.data}
                                                        data={data}
                                                        isLoading={isLoading}
                                                    />
                                                </Col>
                                            </Row>
                                        </form>
                                    )}
                                </Formik>
                            )}
                        </Col>
                    </Row>
                </>
            )}
            <SendEmailModal
                open={modalVisible}
                handleCancel={() => setModalVisible(false)}
                invoiceId={trackerData?.id}
                invoiceOnly
            />
        </Content>
    );
};

export default TrackInvoice;
