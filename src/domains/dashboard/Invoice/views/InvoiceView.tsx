import React, { useEffect, useState } from 'react';

import { Button, Card, Col, Flex, Row, Skeleton, Typography } from 'antd';
import Input from 'antd/es/input/Input';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import InvoiceHeader from '../components/InvoiceHeader';
import UploadImage from '../components/UploadImage';
import WishList from '../components/WishList';
import BillerDetailsForm from '../forms/BillerDetailsForm';
import CustomerDetailsForm from '../forms/CustomerDetailsForm';
import InvoiceDetailsForm from '../forms/InvoiceDetailsForm';
import GetUserDetails from '../hooks/useGetUserDetailsApi';
import useInvoicesApi from '../hooks/useInvoicesApi';
import { invoiceDetailsSchema } from '../schema';

const InvoiceView: React.FC = () => {
    const { user } = useAppSelector(state => state.reducer.user);
    const { userData, loader } = GetUserDetails();

    const { recipientDetails, invoiceDetails } = useAppSelector(state => state.reducer.invoices);
    const invoicesState = useAppSelector(state => state.reducer.invoices);
    const [invoiceTitle, setInvoiceTitle] = useState<string>('Invoice');
    const mobile = Number(user?.mobileNo);
    const { handleInvoice, isLoading } = useInvoicesApi();
    const dispatch = useDispatch();

    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

    const onCustomerSelect = (customer: any) => {
        setSelectedCustomer(customer);
    };
    // const { singleData } = GetSingleCustomer(selectedCustomerId ?? 0);

    const initialValues = {
        billerName: userData?.userName,
        billerEmail: userData?.userEmail,
        billerCompanyAddress:
            userData?.addressLine1 && userData?.addressLine2
                ? `${userData.addressLine1}, ${userData.addressLine2}`
                : userData?.addressLine1 || userData?.addressLine2 || '',
        billerPhone: user?.mobileNo || userData?.mobileNo,
        billerGST: '',
        customerName: selectedCustomer?.label || recipientDetails.customerName,
        customerEmail: selectedCustomer?.email || recipientDetails.customerEmail,
        customerAddress: selectedCustomer?.address || recipientDetails.customerAddress,
        customerPhone: selectedCustomer?.mobileNo || recipientDetails.customerPhone,
        invoiceNo: invoiceDetails.invoiceNo,
        invoiceDate: invoiceDetails?.invoiceDate,
        dueDate: invoiceDetails?.dueDate,
        items: invoicesState.productDetails,
        paymentDetails: invoicesState.paymentDetails,
        comments: invoicesState.comments,
        termsConditions: invoicesState.termsConditions,
        shipping: '',
        invoiceDetails: {
            logo: user?.logo,
        },
        amountPaid: '',
        name: '',
        paymentMode: '',
    };

    useEffect(() => {
        if (selectedCustomer) {
            setSelectedCustomer(selectedCustomer);
        }
    }, [selectedCustomer]);

    return loader ? (
        <Skeleton />
    ) : (
        <Flex vertical gap={15} className="w-full">
            <Flex justify="space-between" align="center">
                <Flex vertical gap={5}>
                    <Typography.Text className="font-medium text-lg sm:text-xl">
                        Create Invoice
                    </Typography.Text>
                    {/* <Typography.Text> Enter the details to generate your invoice</Typography.Text> */}
                </Flex>
            </Flex>

            <Formik
                enableReinitialize
                initialValues={initialValues}
                validationSchema={invoiceDetailsSchema}
                onSubmit={(values, { resetForm }) => {
                    if (values.billerEmail === values.customerEmail) {
                        dispatch(
                            showToast({
                                description:
                                    'The biller and customer email addresses cannot be the same',
                                variant: 'error',
                            })
                        );
                    } else if (values.billerCompanyAddress === values.customerAddress) {
                        dispatch(
                            showToast({
                                description: 'The biller and customer addresses cannot be the same',
                                variant: 'error',
                            })
                        );
                    } else {
                        const subTotal = values.items
                            .reduce(
                                (acc, item) =>
                                    acc +
                                    (parseFloat(item.price.toString()) *
                                        parseFloat(item.quantity.toString()) || 0),
                                0
                            )
                            .toFixed(2);
                        const vat = values.items
                            .reduce(
                                (acc, item) =>
                                    acc +
                                    ((parseFloat(item.vat) *
                                        (parseFloat(item.price.toString()) *
                                            parseFloat(item.quantity.toString()) || 0)) /
                                        100 || 0),
                                0
                            )
                            .toFixed(2);
                        const discount = values.items
                            .reduce(
                                (acc, item) =>
                                    acc +
                                    ((parseFloat(item.discount) *
                                        (parseFloat(item.price.toString()) *
                                            parseFloat(item.quantity.toString()) || 0)) /
                                        100 || 0),
                                0
                            )
                            .toFixed(2);
                        const { shipping } = values;
                        const { amountPaid } = values;
                        const total = values.items
                            .reduce(
                                (acc, item) => acc + (parseFloat(item.amount) || 0),
                                0 + Number(values.shipping || 0)
                            )
                            .toFixed(2);

                        const amountDue = values.items
                            .reduce(
                                (acc, item) => acc + (parseFloat(item.amount) || 0),
                                0 + Number(values.shipping || 0) - Number(values.amountPaid || 0)
                            )
                            .toFixed(2);

                        const payload = {
                            id: 0,
                            invoiceId: 0,
                            updatedAt: '',
                            createdAt: '',
                            comments: values.comments,
                            termsConditions: values.termsConditions,
                            paymentMode: values.paymentMode,
                            paymentDetails: {
                                subTotal,
                                vat,
                                discount,
                                shipping,
                                total,
                                amountDue,
                                amountPaid,
                            },
                            productDetails: values.items,
                            invoiceDetails: {
                                invoiceNo: values.invoiceNo,
                                dueDate: values.dueDate,
                                invoiceDate: values.invoiceDate,
                                logo: invoicesState.recipientDetails.logo!.imageBase
                                    ? invoicesState.recipientDetails.logo
                                    : user?.logo,
                                invoiceName: invoiceTitle,
                            },
                            recipientDetails: {
                                billerName: values.billerName,
                                billerEmail: values.billerEmail,
                                billerCompanyAddress: values.billerCompanyAddress,
                                billerPhone: values.billerPhone,
                                billerGST: values.billerGST,
                                customerName: values.customerName,
                                customerAddress: values.customerAddress,
                                customerEmail: values.customerEmail,
                                customerPhone: values.customerPhone,
                                logo: undefined,
                            },
                        };
                        handleInvoice({ ...payload, resetForm });
                    }
                }}
            >
                {({ handleSubmit, values }) => (
                    <form onSubmit={handleSubmit}>
                        <Flex vertical className="w-full  justify-center items-center mt-5">
                            <Card size="small" className="md:max-w-5xl sm:p-5 w-full">
                                <Flex className=" w-full ">
                                    <InvoiceHeader onCustomerSelect={onCustomerSelect} />
                                </Flex>
                                <Row gutter={[50, 20]} className="mt-5">
                                    <Col span={24}>
                                        <Flex
                                            justify="space-between"
                                            align="center"
                                            className="bg-gray-100 px-6 py-4 pt-6 -mt-3 -mx-3"
                                        >
                                            <Flex vertical>
                                                <UploadImage />
                                                <Typography.Text className="font-semibold text-center xs:text-xs md:text-md">
                                                    Upload logo
                                                </Typography.Text>
                                            </Flex>

                                            <Flex className="min-w-24 sm:min-w-40 ">
                                                <Input
                                                    variant="borderless"
                                                    placeholder="Enter Invoice Title"
                                                    defaultValue="INVOICE"
                                                    className="xs:text-lg sm:text-3xl  font-medium w-auto text-end object-contain"
                                                    size="large"
                                                    onChange={e => setInvoiceTitle(e.target.value)}
                                                    minLength={5}
                                                    maxLength={20}
                                                />
                                            </Flex>
                                        </Flex>
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <BillerDetailsForm />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <CustomerDetailsForm />
                                    </Col>
                                    <Col xs={24} md={8}>
                                        <InvoiceDetailsForm startdate={values.invoiceDate ?? ''} />
                                    </Col>

                                    <Col span={24}>
                                        <WishList
                                            values={values.items}
                                            charge={values.shipping}
                                            amountPaid={values.amountPaid}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                            <Flex justify="start" className="md:max-w-5xl w-full">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    danger
                                    className="mt-5"
                                    loading={isLoading}
                                    // onClick={()=>navigate(paths.invoice.invoicedetails)}
                                >
                                    Generate
                                </Button>
                            </Flex>
                        </Flex>
                    </form>
                )}
            </Formik>
        </Flex>
    );
};

export default InvoiceView;
