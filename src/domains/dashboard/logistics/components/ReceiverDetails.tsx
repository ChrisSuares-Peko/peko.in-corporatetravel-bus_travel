import { RefObject, useEffect, useState } from 'react';

import { Flex, Form, Select, Typography } from 'antd';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';

import { useFetchAddressApi } from '../hooks/useAddressApi';
import { useBasicDetails } from '../hooks/useBasicDetails';
import { useLogisticsCityListingApi } from '../hooks/useLogisticsCityLisitingApi';
import { useLogisticsCountryListingApi } from '../hooks/useLogisticsCountryListingApi';
import { recieverSchema } from '../schema';
import { resetLogisticsDataState, setIsComingFromDetails } from '../slice/logisticsSlice';
import { AddressField, RecieverFormValues } from '../types/address';
import { defaultCountry } from '../utils/data';

interface Props {
    recieverFormRef: RefObject<FormikProps<RecieverFormValues>>;
    shipmentType: string;
    onFormSubmit: (result: boolean) => void;
}

const ReceiverDetails: React.FC<Props> = ({
    shipmentType,
    recieverFormRef,
    onFormSubmit,
}: Props) => {
    const { handleFormRecieverSubmit } = useBasicDetails();

    const { addressOptions, isLoading } = useFetchAddressApi(true);
    const [recieverSelAddress, setRecieverSelAddress] = useState<AddressField>();
    const { destinationAddress, isComingFromDetails } = useAppSelector(
        state => state.reducer.logistics
    );
    const getInitialCountryCode = (params: any) => {
        if (shipmentType === 'DOM') {
            return 'AE';
        }
        return destinationAddress.CountryCode || 'AE';
    };
    const [selectedCountry, setSelectedCountry] = useState<string>(
        getInitialCountryCode(shipmentType)
    );
    const [countrySearch, setCountrySearch] = useState<string>('');
    const [citySearch, setCitySearch] = useState<string>('');
    const { data: countries, isLoading: countriesLoading } =
        useLogisticsCountryListingApi(countrySearch);
    const {
        data: cities,
        isLoading: citiesLoading,
        setIsLoading: handleCitiesLoading,
        setCityDetails: handleCities,
    } = useLogisticsCityListingApi(citySearch, selectedCountry);

    const handleCountryChange = (
        countryValue: string,
        setFieldValue: FormikHelpers<any>['setFieldValue']
    ) => {
        setSelectedCountry(countryValue);
        setFieldValue('recieverCity', '');
        handleCitiesLoading(true);
        handleCities([]);
    };

    const handleCountrySearch = (searchValue: string) => {
        setCountrySearch(searchValue);
    };

    const handleCitySearch = (searchValue: string) => {
        setCitySearch(searchValue);
    };
    const dispatch = useDispatch();

    useEffect(() => {
        if (recieverFormRef.current && shipmentType === 'DOM' && destinationAddress) {
            recieverFormRef.current.setFieldValue('recieverCountry', 'AE');
            setSelectedCountry('AE');
            recieverFormRef.current.setFieldValue(
                'recieverCity',
                destinationAddress.City && destinationAddress.CountryCode === 'AE'
                    ? destinationAddress.City
                    : ''
            );
        } else {
            recieverFormRef?.current?.setFieldValue('recieverCountry', '');
            setSelectedCountry('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shipmentType]);

    useEffect(() => {
        if (!isComingFromDetails) {
            dispatch(resetLogisticsDataState());
        }
        dispatch(setIsComingFromDetails(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const filteredCountries = countries.filter(
        country => country.oValue !== defaultCountry[0].oValue
    );

    return (
        <Flex gap={2} vertical className="w-full sm:w-10/12 xl:w-10/12">
            <Flex className="hidden mb-6 text-lg font-medium sm:flex">Receiver Details</Flex>

            <Typography.Text className="pb-2">Saved Address</Typography.Text>

            <Select
                loading={isLoading}
                allowClear
                placeholder="Select Address"
                optionFilterProp="children"
                onChange={value => setRecieverSelAddress(JSON.parse(value))}
                options={addressOptions}
                className="mb-2"
            />
            <Formik
                enableReinitialize
                initialValues={{
                    addressId: recieverSelAddress?.id ?? 0,
                    recieverName: recieverSelAddress?.name ?? destinationAddress.Line1,
                    recieverCountry: destinationAddress.CountryCode ?? '',
                    recieverCity: recieverSelAddress?.city ?? destinationAddress.City,
                    recieverAddress:
                        recieverSelAddress?.address?.trim() ?? destinationAddress.Line2,
                    recieverPhone: recieverSelAddress?.phoneNumber
                        ? recieverSelAddress.phoneNumber.slice(-10)
                        : destinationAddress.Line3,
                    recieverEmail: recieverSelAddress?.email ?? destinationAddress.Description,
                    recieverZipCode:
                        shipmentType === 'EXP' && recieverSelAddress?.zipCode
                            ? recieverSelAddress?.zipCode
                            : destinationAddress.PostCode,
                    recieverSaveAddress: false,
                }}
                innerRef={recieverFormRef}
                validationSchema={recieverSchema(shipmentType)}
                onSubmit={values => {
                    handleFormRecieverSubmit(values)
                        .then(() => {
                            onFormSubmit(true);
                        })
                        .catch(error => {
                            onFormSubmit(false);
                        });
                }}
            >
                {({ handleSubmit, setFieldValue }) => (
                    <Form layout="vertical" onFinish={handleSubmit} autoComplete="off">
                        <TextInput
                            label="Name"
                            name="recieverName"
                            placeholder="Enter Name"
                            type="text"
                            isRequired
                            allowAlphabetsAndSpaceOnly
                            maxLength={50}
                        />

                        <CustomSelectSearch
                            isRequired
                            loading={countriesLoading}
                            name="recieverCountry"
                            label="Country"
                            placeholder="Select a Country"
                            options={shipmentType === 'DOM' ? defaultCountry : filteredCountries}
                            onChange={value => handleCountryChange(value, setFieldValue)}
                            onSearch={handleCountrySearch}
                            defaultValue={shipmentType === 'DOM' ? defaultCountry[0].oValue : ''}
                        />

                        <CustomSelectSearch
                            isRequired
                            loading={citiesLoading}
                            name="recieverCity"
                            label="City"
                            placeholder="Select a City"
                            options={cities}
                            onSearch={handleCitySearch}
                            isDisabled={!selectedCountry && shipmentType === 'EXP'}
                        />

                        <TextInput
                            label="Building Name/Number and Street name"
                            name="recieverAddress"
                            placeholder="Enter Address"
                            type="text"
                            isRequired
                            maxLength={50}
                        />

                        <TextInput
                            label="Mobile Number"
                            name="recieverPhone"
                            placeholder="Enter Mobile Number"
                            type="text"
                            maxLength={10}
                            isRequired
                            allowNumbersOnly
                        />

                        <TextInput
                            label="Email ID"
                            name="recieverEmail"
                            placeholder="Enter Email ID"
                            isRequired
                            type="text"
                            allowLowerCaseOnly
                            maxLength={50}
                        />

                        <TextInput
                            label="Zip Code"
                            name="recieverZipCode"
                            placeholder="Enter Zip Code"
                            type="text"
                            maxLength={10}
                            isRequired={shipmentType === 'EXP'}
                            allowNumbersOnly
                        />

                        <CheckboxInput name="recieverSaveAddress"> Save this address</CheckboxInput>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default ReceiverDetails;
