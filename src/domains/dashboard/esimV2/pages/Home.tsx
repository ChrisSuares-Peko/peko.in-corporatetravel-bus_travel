import React, { useState } from 'react';

import { Button, Col, Flex, Image, InputNumber, Row, Select, Typography } from 'antd';
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import animation from '@assets/animation/EsimLoader.json';

import { links } from '../../CorporateTravel/utils/data';
import CalenderSVG from '../assets/icons/calendar.svg';
import DataSVG from '../assets/icons/Data.svg';
import Globe from '../assets/icons/Globe.svg';
import DefaultImage from '../assets/images/Esim.png';
import About from '../components/about/About';
import useGetCountry from '../hooks/useGetCountry';
import useGetPlans from '../hooks/useGetPlans';
import usePayment from '../hooks/usePayment';

const Home = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates, Basic (tau)');
    const [selectedData, setSelectedData] = useState('');
    const [selectedValidity, setSelectedValidity] = useState('');

    const { handleSubmission } = usePayment();
    const { isLoading, countryData } = useGetCountry();
    const { plans } = useGetPlans(selectedCountry);
    const handlePayment = () => {
        if (selectedCountry && selectedData && selectedValidity) {
            const postData = {
                country: selectedCountry,
                data: selectedData,
                validity: selectedValidity,
                quantity,
            };
            handleSubmission(postData);
        }
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value);
        setSelectedData('');
    };

    const handleDataClick = (data: string) => {
        setSelectedData(data);
        setSelectedValidity('');
    };

    const handleValidityClick = (data: string) => {
        setSelectedValidity(data);
    };

    let uniqueValidity;
    if (plans) {
        uniqueValidity = Array.from(new Set(plans.flatMap(option => option.periodDays)));
    }

    return (
        <>
            {!countryData || isLoading ? (
                <Flex justify="center" align="middle" className="w-full h-full min-h-[300px]">
                    <Lottie
                        options={defaultOptions}
                        height="100%"
                        width="100%"
                        isClickToPauseDisabled
                        style={{ maxWidth: '400px', maxHeight: '300px' }}
                    />
                </Flex>
            ) : (
                <Row gutter={[20, 20]}>
                    <Col xs={24}>
                        <Flex justify="space-between" align="center">
                            <Flex justify="">
                                <Typography.Text className="font-normal text-2xl text-thin">
                                    Save huge costs on roaming data. Get an activated eSIM instantly
                                </Typography.Text>
                            </Flex>
                            <Flex justify="end" className="pt-10 xs:hidden md:flex">
                                <Link to={links[3]}>
                                    <Button danger ghost>
                                        Order History
                                    </Button>
                                </Link>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col xs={24} sm={6} className="w-full">
                        <Image src={DefaultImage} preview={false} />
                    </Col>
                    <Col className="" xs={24} sm={18}>
                        <Flex className="h-full" justify="center" align="start" vertical>
                            <Flex vertical gap={10}>
                                <Typography.Text className="font-medium text-2xl">
                                    Float by Peko
                                </Typography.Text>
                                <table className="border-separate border-spacing-y-9 w-full">
                                    <tr className="flex flex-col md:table-row mb-8 md:mb-0">
                                        <td className="md:w-1/2 w-full mb-2 md:mb-0">
                                            <Flex>
                                                <ReactSVG src={Globe} />
                                                <Typography.Text className="text-sm ms-2 me-3">
                                                    Coverage:
                                                </Typography.Text>
                                            </Flex>
                                        </td>
                                        <td className="w-full">
                                            <Select
                                                showSearch
                                                className="w-72 rounded-lg"
                                                placeholder="Select country"
                                                optionFilterProp="label"
                                                onChange={handleCountryChange}
                                                options={countryData}
                                                defaultValue="United Arab Emirates, Basic (tau)"
                                            />
                                        </td>
                                    </tr>

                                    {/* Data Options */}
                                    <tr className="flex flex-col md:table-row mb-8 md:mb-0">
                                        <td className="md:w-1/2 w-full mb-2 md:mb-0">
                                            <Flex>
                                                <ReactSVG src={DataSVG} />
                                                <Typography.Text className="text-sm ms-2">
                                                    Data:
                                                </Typography.Text>
                                            </Flex>
                                        </td>
                                        <td className="md:w-1/2 w-full">
                                            <Flex gap={10}>
                                                {plans
                                                    ? plans.map(option => (
                                                          <Button
                                                              key={option.dataMBs}
                                                              className={`text-gray-500 ${selectedData === option.dataMBs ? 'text-red-500 border-red-500' : 'hover:bg-gray-200'}`}
                                                              onClick={() =>
                                                                  handleDataClick(option.dataMBs)
                                                              }
                                                          >
                                                              {option.dataMBs} MB
                                                          </Button>
                                                      ))
                                                    : 'N/A'}
                                            </Flex>
                                        </td>
                                    </tr>

                                    {/* Validity Options */}
                                    <tr className="flex flex-col md:table-row">
                                        <td className="md:w-1/2 w-full mb-2 md:mb-0">
                                            <Flex align="center">
                                                <ReactSVG src={CalenderSVG} />
                                                <Typography.Text className="text-sm ms-2">
                                                    Validity:
                                                </Typography.Text>
                                            </Flex>
                                        </td>
                                        <td className="md:w-1/2 w-full">
                                            <Flex gap={10}>
                                                {uniqueValidity && plans
                                                    ? uniqueValidity.map(period => (
                                                          <Button
                                                              key={period}
                                                              className={`text-gray-500 ${selectedValidity === period ? 'text-red-500 border-red-500' : ''}`}
                                                              onClick={() =>
                                                                  handleValidityClick(period)
                                                              }
                                                              disabled={
                                                                  !!(
                                                                      selectedData === null ||
                                                                      (selectedData &&
                                                                          !plans.some(
                                                                              option =>
                                                                                  option.dataMBs ===
                                                                                      selectedData &&
                                                                                  option.periodDays.includes(
                                                                                      period
                                                                                  )
                                                                          ))
                                                                  )
                                                              }
                                                          >
                                                              {period}{' '}
                                                              {Number(period) === 1
                                                                  ? 'Day'
                                                                  : 'Days'}
                                                          </Button>
                                                      ))
                                                    : 'N/A'}
                                            </Flex>
                                        </td>
                                    </tr>
                                </table>
                                <Flex className="h-1/2 ms-2" gap={10} vertical>
                                    <Typography.Text className="text-sm text-textBlack">
                                        No. of eSIMs
                                    </Typography.Text>

                                    <Flex gap={20}>
                                        <InputNumber
                                            className="rounded-sm"
                                            onChange={value =>
                                                setQuantity(value ? Math.round(value) : 1)
                                            }
                                            value={quantity}
                                            min={1}
                                            max={50}
                                            precision={0}
                                            step={1}
                                            stringMode={false}
                                        />

                                        <Button
                                            type="primary"
                                            className="px-5"
                                            danger
                                            onClick={handlePayment}
                                            disabled={
                                                !selectedData || !selectedValidity || !quantity
                                            }
                                        >
                                            Buy Now
                                        </Button>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Col>
                    <Col>
                        <About />
                    </Col>
                </Row>
            )}
        </>
    );
};

export default Home;
