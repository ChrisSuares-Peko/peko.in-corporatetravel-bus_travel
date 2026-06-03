import React, { useState } from 'react';

import { Button, Form } from 'antd';
import { Formik } from 'formik';

import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';

import TransferBreakdown from './TransferBreakdown';
import { useGetCountriesList } from '../../hooks/useGetCountriesList';
import { useGetChargeAndExchangeRate } from '../../hooks/useGetExchangeRate';
import { estimateCalculatorSchema } from '../../schema';

const EstimateForm = () => {
    const initialValues = {
        sourceCountry: 'UAE',
        destinationCountry: '',
        destinationCurrency: '',
        deliveryMode: '',
        sourceAmount: '',
    };
    const { data, generateCountriesDropdown } = useGetCountriesList('');
    const { fetchChargeAndExchangerate, isLoading } = useGetChargeAndExchangeRate();
    const [deliveryModes, setDeliveryModes] = useState<any>([]);
    const [currency, setCurrency] = useState<string>('AED');
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | undefined>(undefined);
    const [amount, setAmount] = useState<string | undefined>(undefined);
    const [charge, setCharge] = useState<number>(0);
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const handleCountryChange = async (
        eid: React.SetStateAction<string | undefined>,
        setFieldValue: any
    ) => {
        const countriesData = generateCountriesDropdown(data).find(emp => emp.value === eid);
        if (countriesData) {
            setSelectedCountryCode(eid);

            setFieldValue('exchangeRate', 0);
            setFieldValue('charge', 0);
            setFieldValue('deliveryMode', undefined);
            setFieldValue('deliveryMode', undefined);
            setAmount('');
            setCurrency('');
            setCharge(0);
            setExchangeRate(0);
            const deliveryModesData = data
                .filter(item => item.countryCode === eid)
                .map(item => ({
                    value: item.deliveryMode,
                    label: item.deliveryModeDescription,
                }));

            setDeliveryModes(deliveryModesData);
        }
    };
    const handleDeliveryModeChange = (selectedMode: string, setFieldValue: any) => {
        if (selectedCountryCode) {
            const selectedCountry = data.find(
                item =>
                    item.countryCode === selectedCountryCode &&
                    item.deliveryMode === Number(selectedMode)
            );
            if (selectedCountry) {
                setFieldValue('destinationCurrency', selectedCountry.payingCurrency);
                setCurrency(selectedCountry.payingCurrency);
            }
        }
    };
    const HandleCalculate = async (values: any) => {
        setAmount(values.sourceAmount);
        const result = await fetchChargeAndExchangerate(
            values.deliveryMode,
            values.destinationCountry,
            values.destinationCurrency,
            values.sourceAmount,
            values.destinationCurrency
        );
        if (result) {
            setCharge(result.charge.charge || 0);
            setExchangeRate(result.exchangeRate.settlementRate || 0);
        }
    };
    const getTotalAmount = () => {
        const amountNumber = parseFloat(amount ?? '0') || 0;
        const chargeNumber = charge || 0;
        return (amountNumber + chargeNumber).toFixed(2);
    };
    const getBeneficiaryReceives = () => {
        const amountNumber = parseFloat(amount ?? '0') || 0;
        const rateNumber = exchangeRate || 0;
        return (amountNumber * rateNumber).toFixed(2);
    };
    return (
        <>
            {' '}
            <Formik
                initialValues={initialValues}
                validationSchema={estimateCalculatorSchema}
                onSubmit={HandleCalculate}
            >
                {({ handleSubmit, setFieldValue }) => (
                    <Form onFinish={handleSubmit} layout="vertical" className="mt-6 w-full px-4">
                        <TextInput
                            label="Source Country"
                            name="sourceCountry"
                            placeholder="Enter destination country"
                            type="text"
                            isRequired
                            isDisabled
                        />
                        <SelectInputWithSearch
                            name="destinationCountry"
                            label="Destination Country"
                            options={generateCountriesDropdown(data) || []}
                            handleChange={eid => {
                                handleCountryChange(eid, setFieldValue);
                            }}
                            placeholder="Select country"
                            isRequired
                        />
                        <SelectInput
                            label="Delivery Mode"
                            name="deliveryMode"
                            placeholder="Select delivery mode"
                            options={deliveryModes}
                            isRequired
                            handleChange={eid => handleDeliveryModeChange(eid, setFieldValue)}
                        />
                        <TextInput
                            label="Destination Currency"
                            name="destinationCurrency"
                            type="text"
                            isRequired
                            isDisabled
                        />
                        <TextInput
                            label="Amount"
                            name="sourceAmount"
                            placeholder="Enter amount"
                            type="text"
                            isRequired
                        />

                        <Button
                            htmlType="submit"
                            danger
                            className="px-10 my-3 w-full"
                            loading={isLoading}
                        >
                            Calculate
                        </Button>
                    </Form>
                )}
            </Formik>
            <TransferBreakdown
                amount={amount}
                currency={currency}
                exchangeRate={exchangeRate}
                charge={charge}
                //  vat={exchangeRate?.vat}
                total={getTotalAmount()}
                beneficiaryReceives={getBeneficiaryReceives()}
            />
        </>
    );
};

export default EstimateForm;
