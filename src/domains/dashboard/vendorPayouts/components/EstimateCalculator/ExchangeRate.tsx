import React, { useState } from 'react';

import { Form, Table } from 'antd';
import { Formik } from 'formik';

import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';

import { useGetAgentAndExchangeRate } from '../../hooks/useGetAgentAndExchangerate';
import { useGetCountriesList } from '../../hooks/useGetCountriesList';
import { ExchangeRateType } from '../../types/types';
import { columns } from '../../utils/data';

const ExchangeRate = () => {
    const { data, generateCountriesDropdown } = useGetCountriesList('');
    const { fetchChargeAndExchangerate, isLoading } = useGetAgentAndExchangeRate();
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | undefined>(undefined);
    const [tableData, setTableData] = useState<ExchangeRateType[]>([]);
    const [deliveryModes, setDeliveryModes] = useState<any>([]);
    const initialValues = {
        destinationCountry: '',
        deliveryMode: '',
    };

    const handleCountryChange = async (
        eid: string,
        setFieldValue: (field: string, value: any) => void
    ) => {
        setFieldValue('deliveryMode', '');
        setTableData([]);

        const countriesData = generateCountriesDropdown(data).find(emp => emp.value === eid);
        if (countriesData) {
            setSelectedCountryCode(eid);
            const deliveryModesData = data
                .filter(item => item.countryCode === eid)
                .map(item => ({
                    value: item.deliveryMode,
                    label: item.deliveryModeDescription,
                }));
            setDeliveryModes(deliveryModesData);
        }
    };

    const handleDeliveryModeChange = async (selectedMode: string) => {
        if (selectedCountryCode) {
            const selectedCountry = data.find(
                item =>
                    item.countryCode === selectedCountryCode &&
                    item.deliveryMode === Number(selectedMode)
            );
            if (selectedCountry) {
                const currency = selectedCountry.payingCurrency;
                const fetchedData = await fetchChargeAndExchangerate(
                    selectedMode,
                    selectedCountryCode,
                    currency
                );
                setTableData(fetchedData || []);
            }
        }
    };

    return (
        <>
            <Formik initialValues={initialValues} onSubmit={() => {}}>
                {({ handleSubmit, setFieldValue }) => (
                    <Form onFinish={handleSubmit} layout="vertical" className="mt-6 w-full px-4">
                        <SelectInputWithSearch
                            name="destinationCountry"
                            label="Destination Country"
                            options={generateCountriesDropdown(data) || []}
                            handleChange={eid => handleCountryChange(eid, setFieldValue)}
                            placeholder="Select country"
                            isRequired
                        />
                        <SelectInput
                            label="Delivery Mode"
                            name="deliveryMode"
                            placeholder="Select delivery mode"
                            options={deliveryModes}
                            isRequired
                            handleChange={eid => handleDeliveryModeChange(eid)}
                        />
                    </Form>
                )}
            </Formik>
            <Table
                dataSource={tableData}
                columns={columns}
                pagination={false}
                loading={isLoading}
            />
        </>
    );
};

export default ExchangeRate;
