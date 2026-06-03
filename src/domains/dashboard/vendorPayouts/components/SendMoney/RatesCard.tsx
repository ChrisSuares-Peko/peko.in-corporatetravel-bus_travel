import React, { useMemo, useState } from 'react';

import { Card, Typography, Button, Divider, Row, Col, Flex } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';

import RatesItem from './RatesItem';
import useGetStaticData from '../../hooks/useGetStaticDataApi';
import { constants } from '../../utils/data';

const { Text } = Typography;
const { OthersInSourceOfFund, OthersInRemittancePurpose } = constants;

interface RateCardProps {
    dataFields: any;
    InvoiceAmount: number;
}

const RatesCard: React.FC<RateCardProps> = ({ dataFields, InvoiceAmount }) => {
    const { remittancePurposeOptions, sourceOfFundsOptions } = useGetStaticData();

    // Ensure all required values exist before using them
    const chargeSlab = dataFields?.chargeSlab?.data?.[0];
    const exchangeRate = dataFields?.exchangeRate?.data?.[0];
    const charge = chargeSlab?.charge ?? 0;
    const payingCurrency = exchangeRate?.payingCurrency ?? '';
    const settlementRate = exchangeRate?.settlementRate ?? 1;

    const roundedExchangerate = parseFloat(settlementRate.toFixed(2));

    const [selectedSourceOfFund, setSelectedSourceOfFund] = useState<string>('');
    const [selectedRemittancePurpose, setSelectedRemittancePurpose] = useState<string>('');

    const receivingAmount = useMemo(
        () => InvoiceAmount * roundedExchangerate,
        [InvoiceAmount, roundedExchangerate]
    );

    const ratesDetails = useMemo(
        () => [
            { label: 'Invoice Amount:', value: `AED ${InvoiceAmount}` },
            { label: 'Transaction Fee:', value: `AED ${charge}` },
            { label: 'Total Amount:', value: `AED ${InvoiceAmount + charge}` },
            { label: 'Exchange Rate 1 AED:', value: `${payingCurrency} ${roundedExchangerate}` },
            { label: 'Receiving Amount:', value: `${payingCurrency} ${receivingAmount}` },
        ],
        [InvoiceAmount, charge, payingCurrency, roundedExchangerate, receivingAmount]
    );

    const handleSourceOfFundChange = (value: string) => {
        setSelectedSourceOfFund(value);
    };

    const handleRemittancePurposeChange = (value: string) => {
        setSelectedRemittancePurpose(value);
    };

    return (
        <Flex vertical className="w-full p-4">
            <Card className="w-full my-4 p-4 rounded-3xl shadow-sm">
                <Flex vertical className="flex-col">
                    <Text className="md:text-[14px] font-extrabold">Rates</Text>
                </Flex>

                <Flex className="w-full flex-wrap justify-between items-center md:text-[12px]">
                    {ratesDetails.map((item, index) => (
                        <Flex key={index} className="items-center w-full md:w-auto">
                            <RatesItem label={item.label} value={item.value} />
                            {index < ratesDetails.length - 1 && (
                                <Divider
                                    type="vertical"
                                    className="hidden md:flex mx-2"
                                    style={{ height: '3rem', borderLeftWidth: '2px' }}
                                />
                            )}
                        </Flex>
                    ))}
                </Flex>

                <Row gutter={[16, 16]} className="w-full md:mt-8 mt-8">
                    <Col xs={24} sm={12} md={8}>
                        <Flex vertical className="gap-2 w-full">
                            <Text>
                                <Text className="text-red-500 me-1 mb-2">*</Text>
                                Source of Fund
                            </Text>
                            <SelectInput
                                name="SourceOfFund"
                                options={sourceOfFundsOptions}
                                placeholder="Please enter source of fund"
                                isRequired
                                classes="rounded-sm w-full"
                                handleChange={handleSourceOfFundChange}
                            />
                        </Flex>
                    </Col>
                    {selectedSourceOfFund === OthersInSourceOfFund && (
                        <Col xs={24} sm={12} md={8}>
                            <Flex vertical className="gap-2 w-full">
                                <Text>
                                    <Text className="text-red-500 me-1">*</Text>
                                    Other (Source of Fund)
                                </Text>
                                <TextInput
                                    name="OtherSourceOfFund"
                                    type="text"
                                    placeholder="Other"
                                    isRequired
                                    classes="rounded-sm w-full"
                                />
                            </Flex>
                        </Col>
                    )}
                    <Col xs={24} sm={12} md={8}>
                        <Flex vertical className="gap-2 w-full">
                            <Text>
                                <Text className="text-red-500 me-1">*</Text>
                                Remittance Purpose
                            </Text>
                            <SelectInput
                                name="RemittancePurpose"
                                options={remittancePurposeOptions}
                                placeholder="Please enter Remittance Purpose"
                                isRequired
                                classes="rounded-sm w-full"
                                handleChange={handleRemittancePurposeChange}
                            />
                        </Flex>
                    </Col>
                    {selectedRemittancePurpose === OthersInRemittancePurpose && (
                        <Col xs={24} sm={12} md={8}>
                            <Flex vertical className="gap-2 w-full">
                                <Text>
                                    <Text className="text-red-500 me-1">*</Text>
                                    Other (Remittance Purpose)
                                </Text>
                                <TextInput
                                    name="OtherRemittancePurpose"
                                    type="text"
                                    placeholder="Other"
                                    isRequired
                                    classes="rounded-sm w-full"
                                />
                            </Flex>
                        </Col>
                    )}
                </Row>
            </Card>
            <Flex className="mt-4 justify-end">
                <Button key="submit" type="primary" danger className="px-5">
                    Confirm and Pay
                </Button>
            </Flex>
        </Flex>
    );
};

export default RatesCard;
