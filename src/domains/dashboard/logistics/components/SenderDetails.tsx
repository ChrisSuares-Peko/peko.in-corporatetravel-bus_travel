import { useState, RefObject } from 'react';

import { Flex, Form, Select, Typography } from 'antd';
import { Formik, FormikProps } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import { useFetchAddressApi } from '../hooks/useAddressApi';
import { useBasicDetails } from '../hooks/useBasicDetails';
import { useLogisticsCityListingApi } from '../hooks/useLogisticsCityLisitingApi';
import { senderSchema } from '../schema';
import { AddressField, SenderFormValues } from '../types/address';
import { defaultCountry } from '../utils/data';

interface Props {
    senderFormRef: RefObject<FormikProps<SenderFormValues>>;
    shipmentType: string;
    onFormSubmit: (result: boolean) => void;
}

const SenderDetails: React.FC<Props> = ({ shipmentType, senderFormRef, onFormSubmit }: Props) => {
    const { originAddress } = useAppSelector(state => state.reducer.logistics);
    const { handleFormSenderSubmit } = useBasicDetails();
    const { addressOptions, isLoading } = useFetchAddressApi(false);
    const [senderSelAddress, setSenderSelAddress] = useState<AddressField>();
    const [citySearch, setCitySearch] = useState<string>('');
    const { data: cities, isLoading: citiesLoading } = useLogisticsCityListingApi(citySearch, 'AE');

    const handleCitySearch = (searchValue: string) => {
        setCitySearch(searchValue);
    };

    return (
        <Flex gap={2} vertical className="w-full sm:w-10/12 xl:w-10/12">
            <Flex className="hidden mb-6 text-lg font-medium sm:flex">Sender Details</Flex>
            <Typography.Text className="pb-2">Saved Address</Typography.Text>

            <Select
                loading={isLoading}
                allowClear
                placeholder="Select Address"
                optionFilterProp="children"
                onChange={value => setSenderSelAddress(JSON.parse(value))}
                options={addressOptions}
                className="mb-2"
            />
            <Formik
                enableReinitialize
                initialValues={{
                    addressId: senderSelAddress?.id ?? 0,
                    senderName: senderSelAddress?.name ?? originAddress.Line1,
                    senderCountry: '',
                    senderCity: senderSelAddress?.city ?? originAddress.City,
                    senderAddress: senderSelAddress?.address?.trim() ?? originAddress.Line2,
                    senderPhone: senderSelAddress?.phoneNumber
                        ? senderSelAddress.phoneNumber.slice(-10)
                        : originAddress.Line3,
                    senderEmail: senderSelAddress?.email ?? originAddress.Description,
                    senderSaveAddress: false,
                    senderZipCode:
                        shipmentType === 'EXP' && senderSelAddress?.zipCode
                            ? senderSelAddress?.zipCode
                            : originAddress.PostCode,
                }}
                innerRef={senderFormRef}
                validationSchema={senderSchema}
                onSubmit={values => {
                    handleFormSenderSubmit(values)
                        .then(() => {
                            onFormSubmit(true);
                        })
                        .catch(error => {
                            onFormSubmit(false);
                        });
                }}
            >
                {({ handleSubmit }) => (
                    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <TextInput
                            label="Name"
                            name="senderName"
                            placeholder="Enter Name"
                            type="text"
                            isRequired
                            allowAlphabetsAndSpaceOnly
                            maxLength={50}
                        />

                        <CustomSelectSearch
                            isRequired
                            name="senderCountry"
                            label="Country"
                            placeholder="Select a Country"
                            options={defaultCountry}
                        />

                        <CustomSelectSearch
                            isRequired
                            loading={citiesLoading}
                            name="senderCity"
                            label="City"
                            placeholder="Select a City"
                            options={cities}
                            onSearch={handleCitySearch}
                        />

                        <TextInput
                            label="Building Name/Number and Street name"
                            name="senderAddress"
                            placeholder="Enter Address"
                            type="text"
                            isRequired
                            maxLength={50}
                        />

                        <TextInput
                            label="Mobile Number"
                            name="senderPhone"
                            placeholder="Enter Mobile Number"
                            maxLength={10}
                            type="text"
                            isRequired
                            allowNumbersOnly
                        />

                        <TextInput
                            label="Email ID"
                            name="senderEmail"
                            placeholder="Enter Email ID"
                            type="text"
                            allowLowerCaseOnly
                            isRequired
                            maxLength={50}
                        />

                        <TextInput
                            label="Zip Code"
                            name="senderZipCode"
                            placeholder="Enter Zip Code"
                            type="text"
                            maxLength={10}
                            minLength={5}
                            allowNumbersOnly
                        />

                        <CheckboxInput name="senderSaveAddress"> Save this address</CheckboxInput>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default SenderDetails;
