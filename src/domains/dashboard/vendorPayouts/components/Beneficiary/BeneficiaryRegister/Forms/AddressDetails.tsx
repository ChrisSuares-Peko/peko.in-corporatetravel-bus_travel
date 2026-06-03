import { useState } from 'react';

import { Button, Col, Flex, Form, Row, Skeleton } from 'antd';
import { Formik, FormikHelpers } from 'formik';
import { useLocation } from 'react-router-dom';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import useGetCity from '@src/domains/dashboard/vendorPayouts/hooks/useGetCityApi';
import { useGetCountriesList } from '@src/domains/dashboard/vendorPayouts/hooks/useGetCountriesListApi';
import useGetCountry from '@src/domains/dashboard/vendorPayouts/hooks/useGetCountryApi';
import useGetState from '@src/domains/dashboard/vendorPayouts/hooks/useGetStateApi';
import { addressSchema } from '@src/domains/dashboard/vendorPayouts/schema/beneficiaryProfile';
import { setAddressData } from '@src/domains/dashboard/vendorPayouts/slices/beneficiarySlices';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import FormHeader from './FormHeader';

type Props = {
    changeTab: (direction: 'next' | 'prev') => void;
};

const AddressDetails = ({ changeTab }: Props) => {
    const { loading: countryLoading } = useGetCountry();
    const [selectedCountry, setSelectedCountry] = useState<string | undefined>(undefined);
    const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
    const { stateOptions, loading: stateLoading } = useGetState(selectedCountry);
    const { cityOptions, loading: cityLoading } = useGetCity(selectedCountry, selectedState);
    const dispatch = useAppDispatch();

    const { state: locationState } = useLocation();
    const selectedData = locationState?.selectedData;
    const addressDetails =
        useAppSelector(state => state.reducer.vendorBeneficiary.addressDetails) || {};

    const initialValues = selectedData ||
        addressDetails || {
            addressLineOne: '',
            addressLineTwo: '',
            country: undefined,
            state: '',
            city: '',
        };

    const { data, generateCountriesDropdown } = useGetCountriesList('');

    const handleAddressInformation = async (values: any, actions: FormikHelpers<any>) => {
        const errors = await actions.validateForm();
        if (Object.keys(errors).length === 0) {
            dispatch(setAddressData(values));
            changeTab('next');
        } else {
            console.log('Form Errors:', errors);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={addressSchema}
            onSubmit={handleAddressInformation}
            enableReinitialize
        >
            {({ handleSubmit, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <FormHeader step="1/3" title="Address Details:" />
                    {countryLoading || stateLoading || cityLoading ? (
                        <Row className="mt-6" gutter={[20, 40]}>
                            <Col xs={24} md={12}>
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                                <Skeleton active />
                            </Col>
                        </Row>
                    ) : (
                        <Row className="mt-6" gutter={[20, 40]}>
                            <Col xs={24} md={12}>
                                <InputTextArea
                                    name="addressLineOne"
                                    label="Address Line 1"
                                    placeholder="Enter Address"
                                    autoSize
                                />
                                <InputTextArea
                                    name="addressLineTwo"
                                    label="Address Line 2"
                                    placeholder="Enter Address"
                                    autoSize
                                />
                                <SelectInputWithSearch
                                    name="country"
                                    options={generateCountriesDropdown(data) || []}
                                    placeholder="Please select a country"
                                    label="Country"
                                    handleChange={value => {
                                        setSelectedCountry(value);
                                        setFieldValue('country', value);
                                    }}
                                />
                                <SelectInputWithSearch
                                    name="state"
                                    options={stateOptions}
                                    placeholder="Please select a state"
                                    label="State"
                                    handleChange={value => {
                                        setSelectedState(value);
                                        setFieldValue('state', value);
                                    }}
                                />
                                <SelectInputWithSearch
                                    name="city"
                                    options={cityOptions}
                                    placeholder="Please select a city"
                                    label="City"
                                />
                            </Col>
                        </Row>
                    )}
                    <Flex gap={10} className="mt-16">
                        <Button type="primary" danger htmlType="submit">
                            Next
                        </Button>
                        <Button htmlType="button" onClick={() => changeTab('prev')}>
                            Previous
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default AddressDetails;
