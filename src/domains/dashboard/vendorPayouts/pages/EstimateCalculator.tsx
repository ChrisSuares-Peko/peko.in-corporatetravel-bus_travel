import React from 'react';

import { Col, Flex, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import estimateCalculatorSvg from '../assets/estimateCalculator.svg';
import exchangerateSvg from '../assets/exchangeRate.svg';
import EstimateForm from '../components/EstimateCalculator/EstimateForm';
import ExchangeRate from '../components/EstimateCalculator/ExchangeRate';

const EstimateCalculator = () => (
    <Row>
        <Col sm={24} md={12} className="px-3 w-full">
            <Flex vertical className="border border-gray-300 rounded-3xl p-4 ">
                <Flex className="pl-6 mt-3">
                    <Flex align="center" justify="center">
                        <ReactSVG
                            className=""
                            beforeInjection={svg => {
                                svg.setAttribute('style', 'width: 30px; height: 30px;');
                            }}
                            src={estimateCalculatorSvg}
                        />
                    </Flex>
                    <Flex vertical className="pl-5">
                        <Flex>
                            <Typography.Text className="font-bold">
                                Estimate Calculator
                            </Typography.Text>
                        </Flex>
                        <Flex>Make a quick estimation for customer</Flex>
                    </Flex>
                </Flex>
                <EstimateForm />
            </Flex>
        </Col>
        <Col sm={24} md={12} className="px-3 mt-6 md:mt-0 w-full">
            <Flex vertical className="border border-gray-300 rounded-3xl p-4 ">
                <Flex className="pl-6 mt-3">
                    <Flex align="center" justify="center">
                        <ReactSVG
                            className=""
                            beforeInjection={svg => {
                                svg.setAttribute('style', 'width: 30px; height: 30px;');
                            }}
                            src={exchangerateSvg}
                        />
                    </Flex>
                    <Flex vertical className="pl-5">
                        <Flex>
                            <Typography.Text className="font-bold">Rates</Typography.Text>
                        </Flex>
                        <Flex>
                            <Typography.Text>Checkout today is exchange rate</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
                <ExchangeRate />
            </Flex>
        </Col>
    </Row>
);

export default EstimateCalculator;
