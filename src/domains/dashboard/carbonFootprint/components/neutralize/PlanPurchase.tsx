import React from 'react';

import { Button, Col, Flex, Input, Progress, Radio, Row, Select, Typography } from 'antd';

import { Project, projectOptions } from '../../types/dashboard';
import { ProjectCard } from '../projectCard/ProjectCard';

type Props = {
    credit?: any;
    amount?: any;
    handleCreditChange?: (e: any) => void;
    handleNeutrilizefull?: (e: any) => void;
    handleAmountChange?: (e: any) => void;
    handleSelectPackage?: (e: any) => void;
    handleSubmit?: () => void;
    loader?: boolean;
    projectData?: Project;
    selectedPackage?: any;
    exchangeRate?: any;
    changeSelectedOption?: (e: any) => void;
    selectData?: projectOptions[];
    selected?: number | undefined | string;
    calculatedRate?: any;
    co2FootPrint?: any;
    value?: any;
    percentage?: any;
};

const PlanPurchase = ({
    credit,
    amount,
    handleCreditChange,
    handleAmountChange,
    loader,
    handleSubmit,
    selectedPackage,
    handleSelectPackage,
    projectData,
    exchangeRate,
    selectData,
    selected,
    changeSelectedOption,
    handleNeutrilizefull,
    calculatedRate,
    co2FootPrint,
    percentage,
    value,
}: Props) => {
    const priceForOne = parseFloat(value).toFixed(2);
    return (
        projectData && (
            <Flex vertical gap={10} className="px-4 md:px-0 ">
                {selectData && (
                    <Flex vertical gap={20}>
                        <Typography.Text className="mt-6 text-xl font-medium text-valueText xxl:text-2xl xxl:pb-2">
                            Choose a Project
                        </Typography.Text>
                        <Select
                            value={selected}
                            defaultValue={selectData && selectData[0]?.name}
                            size="large"
                            style={{ height: '3rem' }}
                            className="w-full rounded-lg"
                            onChange={changeSelectedOption}
                        >
                            {selectData.map((option, index) => (
                                <Select.Option key={index} value={option.id}>
                                    {option.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Flex>
                )}
                <Typography.Text
                    className={`text-xl text-valueText font-medium ${selectData ? 'mt-4' : 'mt-6'} xxl:text-2xl xxl:pb-3`}
                >
                    Choose a compensation plan
                </Typography.Text>
                <Flex vertical gap={10}>
                    {calculatedRate && co2FootPrint && co2FootPrint > 0 && (
                        <Flex vertical justify="start" align="start" gap={3} className="mt-1">
                            <Typography.Text className="text-xs font-normal text-textGrey xxl:text-sm">
                                Your CO₂ footprint offset is currently at{' '}
                                {percentage > 100 ? 100 : percentage}%.
                            </Typography.Text>
                            <Progress
                                percent={percentage}
                                size="small"
                                showInfo={false}
                                strokeColor="green"
                                type="line"
                            />
                        </Flex>
                    )}
                    <Flex align="center" gap={40} className="mt-1">
                        <Flex vertical gap={10}>
                            <Typography.Text className="pt-2 text-lg font-normal text-valueText md:pt-0">
                                <Typography.Text className="pt-2 text-lg font-normal text-valueText md:pt-0 xxl:text-2xl">
                                    Custom credits
                                </Typography.Text>
                            </Typography.Text>
                            <Flex gap={10} align="center">
                                <Input
                                    type="text"
                                    value={credit}
                                    placeholder="Enter credits"
                                    className="text-xl rounded-md border-1 text-valueText w-fit"
                                    onChange={handleCreditChange}
                                    size="middle"
                                    maxLength={10}
                                />
                                {calculatedRate && co2FootPrint && co2FootPrint > 0 && (
                                    <Button
                                        size="large"
                                        type="default"
                                        className="h-full px-10 w-fit"
                                        onClick={handleNeutrilizefull}
                                        style={{ borderColor: '#05BE63' }}
                                    >
                                        <Typography.Text className="text-textGreenLight">
                                            Neutralise 100%
                                        </Typography.Text>
                                    </Button>
                                )}
                            </Flex>
                            <Typography.Text className="text-sm font-medium text-textInfoGrey me-4 ">
                                1 Credit = AED {priceForOne}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
                <Flex className="mt-3 ml-16">
                    <Typography.Text className="font-normal text-textWhitesmoke text-md">
                        OR
                    </Typography.Text>
                </Flex>
                <Flex vertical>
                    <Radio.Group
                        name="radiogroup"
                        value={selectedPackage}
                        onChange={handleSelectPackage}
                    >
                        <Row>
                            {projectData?.packages.map((item, i) => (
                                <Col key={i} xs={12} md={6}>
                                    <Flex>
                                        <ProjectCard
                                            selectedPackage={selectedPackage}
                                            key={i}
                                            id={i}
                                            img={item.logo}
                                            title={item.name}
                                            credits={new Intl.NumberFormat('en-IN').format(
                                                Number(item.credits) ?? 0
                                            )}
                                            price={(item.amount * exchangeRate).toFixed(2)}
                                        />
                                    </Flex>
                                </Col>
                            ))}
                        </Row>
                    </Radio.Group>
                </Flex>
                <Flex vertical gap={10}>
                    <Typography.Text className="mt-2 text-lg font-normal text-valueText xxl:text-2xl">
                        Amount
                    </Typography.Text>
                    <Flex align="center" gap={15}>
                        <Input
                            type="text"
                            value={amount}
                            placeholder="Enter amount in AED"
                            className="text-xl font-normal rounded-md border-1 text-valueText w-fit"
                            onChange={handleAmountChange}
                            size="middle"
                            maxLength={10}
                        />
                        <Button
                            loading={loader}
                            onClick={handleSubmit}
                            size="large"
                            danger
                            type="primary"
                            className="px-10 w-fit"
                        >
                            <Typography.Text className="text-white">Neutralise</Typography.Text>
                        </Button>
                    </Flex>
                </Flex>
                {credit > 0 && (
                    <Typography.Text className="mt-1 text-sm text-textDarkGreen xxl:mt-3">
                        You are neutralising {credit}
                        {credit < 2 ? ' ton' : ' tons'} CO₂ !
                    </Typography.Text>
                )}
                {selectedPackage !== null &&
                    projectData?.packages[selectedPackage]?.credits > 0 && (
                        <Typography.Text className="mt-1 text-sm text-textDarkGreen xxl:mt-3">
                            {`You are neutralising ${new Intl.NumberFormat('en-IN').format(
                                Number(projectData?.packages[selectedPackage]?.credits) ?? 0
                            )} ${
                                Number(projectData?.packages[selectedPackage]?.credits) < 2
                                    ? 'ton'
                                    : 'tons'
                            } CO₂ !`}
                        </Typography.Text>
                    )}
            </Flex>
        )
    );
};

export default PlanPurchase;
