import { useState } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Row, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';

import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import DateTimePickerInput from '@components/atomic/inputs/DateTimePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import { useCalculateRateApi } from '../hooks/useCalculateRateApi';
import { useLogisticsServiceLisitingApi } from '../hooks/useServiceTypeListingApi';
import { generateLogisticsPickupDetailsSchema } from '../schema';
import { setShipmentDetails, setShippingAmount } from '../slice/logisticsSlice';
import { ShipmentDetailForm, shippingAmount } from '../types';
import { shipmentContents } from '../utils/data';

type Props = {
    setShowReviewScreen: (val: shippingAmount) => void;
};

const ShipmentDetailsForm = ({ setShowReviewScreen }: Props) => {
    const dispatch = useDispatch();
    const { shipmentDetails } = useAppSelector(state => state.reducer.logistics);
    const { handleCalculateRate, isLoading: isLoadingCalculatRate } = useCalculateRateApi();
    const [shipmentContentS, setShipmentContent] = useState(
        shipmentDetails.productGroup === 'DOM' ? 'document' : 'parcel'
    );
    const shipmentContentOptions =
        shipmentDetails.productGroup === 'DOM'
            ? shipmentContents
            : shipmentContents.filter(option => option.oValue !== 'document');

    const { data: serviceTypes, isLoading } = useLogisticsServiceLisitingApi(
        shipmentDetails.productGroup,
        shipmentContentS
    );
    const handleFormSubmit = async ({
        totalWeight,
        noOfPieces,
        serviceType,
        shipmentContent,
        pickupDate,
        customsValueAmount,
    }: ShipmentDetailForm) => {
        dispatch(
            setShipmentDetails({
                actualWeight: totalWeight,
                numberOfPieces: Number(noOfPieces),
                productGroup: shipmentDetails.productGroup,
                productType: serviceType,
                customsValueAmount: Number(customsValueAmount ?? 0),
                quantity: Number(noOfPieces),
                shipmentContent,
                date: pickupDate,
            })
        );
        handleCalculateRate({
            actualWeight: totalWeight,
            numberOfPieces: Number(noOfPieces),
            productGroup: shipmentDetails.productGroup,
            productType: serviceType,
            customsValueAmount: 0,
            quantity: Number(noOfPieces),
        }).then(({ TaxAmount, TotalAmountBeforeTax, TotalAmount, type }: any) => {
            dispatch(
                setShippingAmount({
                    TaxAmount,
                    TotalAmount,
                    TotalAmountBeforeTax,
                    type,
                })
            );
            setShowReviewScreen({
                TotalAmount: TotalAmount ?? 0,
                TotalAmountBeforeTax: TotalAmountBeforeTax ?? 0,
                TaxAmount: TaxAmount ?? 0,
                type,
            });
        });
    };

    const handleChangeShipmentContent = (value: string) => {
        setShipmentContent(value);
    };

    const currentTime = dayjs();
    const minDate = currentTime.add(1, 'day');
    const maxDate = currentTime.add(4, 'days');
    return (
        <Formik
            initialValues={{
                shipmentContent: '',
                noOfPieces: '',
                totalWeight: '',
                pickupDate: '',
                serviceType: '',
                customsValueAmount: '',
            }}
            validationSchema={generateLogisticsPickupDetailsSchema(shipmentDetails)}
            onSubmit={handleFormSubmit}
        >
            {({ handleSubmit, isSubmitting }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <Row gutter={80} className="xl:w-9/12">
                        <Col xs={24} sm={12}>
                            <CustomSelectSearch
                                label="What is your Shipment Content?"
                                name="shipmentContent"
                                loading={isLoading}
                                placeholder="Select your Shipment Content"
                                onChange={handleChangeShipmentContent}
                                options={shipmentContentOptions}
                                isRequired
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <TextInput
                                label="No. of Pieces"
                                name="noOfPieces"
                                placeholder="Enter No. of Pieces"
                                type="text"
                                maxLength={3}
                                allowNumbersOnly
                                isRequired
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <TextInput
                                label="Total Weight"
                                name="totalWeight"
                                placeholder="Enter Total Weight"
                                suffix={
                                    <Tooltip title="Please enter total weight in kg">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                                    </Tooltip>
                                }
                                maxLength={6}
                                type="text"
                                allowDecimalsOnly
                                isRequired
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <DateTimePickerInput
                                minDate={minDate}
                                maxDate={maxDate}
                                label="Schedule a Pickup for this Shipment"
                                name="pickupDate"
                                placeholder="Select Date"
                                classes="w-full"
                                showTime
                                isRequired
                                needConfirm
                                preventManualInput
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <SelectInput
                                label="Service Type"
                                name="serviceType"
                                placeholder="Select Service Type"
                                options={serviceTypes}
                                isRequired
                            />
                        </Col>
                        {shipmentDetails.productGroup === 'EXP' ? (
                            <Col xs={24} sm={12}>
                                <TextInput
                                    label="Customs Value"
                                    name="customsValueAmount"
                                    placeholder="Please enter Customs Value"
                                    suffix={
                                        <Tooltip title="The price of everything you're sending, including shipping and insurance costs, used to calculate your taxes.">
                                            <InfoCircleOutlined
                                                style={{ color: 'rgba(0,0,0,.25)' }}
                                            />
                                        </Tooltip>
                                    }
                                    type="text"
                                    allowDecimalsOnly
                                    isRequired={shipmentDetails.productGroup === 'EXP'}
                                />
                            </Col>
                        ) : (
                            ''
                        )}
                    </Row>
                    <Flex justify="space-between" className="mt-4">
                        <Button
                            danger
                            loading={isLoadingCalculatRate}
                            htmlType="submit"
                            type="default"
                            className="w-full sm:w-[8rem] "
                        >
                            Update
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default ShipmentDetailsForm;
