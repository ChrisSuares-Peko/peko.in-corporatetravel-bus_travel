import React from 'react';

import { Col, Typography, Flex, List, Row } from 'antd';
import { ReactSVG } from 'react-svg';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import CopySVG from '../../assets/icons/Copy.svg';
import { EsimPackageDetails, SimDetails } from '../../types/orderDetails';

type Props = {
    details: EsimPackageDetails;
    esimDetails: SimDetails;
};

const EsimDetailsAdditionalInfoList = ({ details, esimDetails }: Props) => {
    const dispatch = useAppDispatch();
    const countryTitle = details?.packageType === 'local' ? 'Country' : 'Countries';
    const countries = details?.countries;
    const additionalInfo = [
        {
            title: 'Service Operator',
            content: details.operatorName,
        },
        {
            title: 'Plan',
            content: details?.package ?? 'N/A',
        },
        {
            title: 'Plan Type',
            content: details?.esim_type ?? 'N/A',
        },
        {
            title: 'ICCID Number',
            content: esimDetails?.iccid ?? 'N/A',
        },
        {
            title: 'eKYC (IDENTITY VERIFICATION)',
            content:
                'The validity period starts when the eSIM connects to any supported network/s.',
        },
        {
            title: 'Top-up Option',
            content: details?.isRechargable ? 'Available' : 'Not Available',
        },
        {
            title: countryTitle,
            content: countries && countries.map(item => item.title).join(', '), // Join country titles into a string
        },
    ];

    const handleCopyClick = (text: string) => {
        navigator.clipboard.writeText(text);
        dispatch(
            showToast({
                description: 'ICCID copied to clipboard',
                variant: 'success',
            })
        );
    };

    return (
        <Col className="mt-8" span={24}>
            <Typography.Text className="text-textBlack font-medium text-base">
                Additional Information
            </Typography.Text>
            <Flex vertical className="w-full">
                <List
                    className="mt-6"
                    dataSource={additionalInfo}
                    renderItem={(item, index) => (
                        <Row
                            className={`py-3 px-4 
                            ${index % 2 === 0 ? 'bg-listBg' : 'bg-white'} 
                            ${index === additionalInfo.length - 1 ? '' : 'border-none'} 
                            rounded-md`}
                        >
                            <Col span={24}>
                                <Flex justify="start" className="items-center w-full">
                                    <Typography.Text className="text-gray-600 text-sm w-1/3 md:w-1/4">
                                        {item.title}
                                    </Typography.Text>
                                    <Typography.Text
                                        className={`${
                                            item.title === 'ICCID Number'
                                                ? 'text-red-500'
                                                : 'text-gray-600'
                                        } text-sm w-2/3 md:w-3/4 text-left flex items-center space-x-2`}
                                    >
                                        {item.title === 'ICCID Number' ? (
                                            <Flex align="center" className="space-x-2">
                                                <span>{item.content}</span>
                                                <ReactSVG
                                                    data-testid="copy-icon"
                                                    className="cursor-pointer"
                                                    src={CopySVG}
                                                    beforeInjection={svg => {
                                                        svg.setAttribute(
                                                            'style',
                                                            'width: 18px; height: 18px;'
                                                        );
                                                    }}
                                                    onClick={() =>
                                                        handleCopyClick(item.content!.toString())
                                                    }
                                                />
                                            </Flex>
                                        ) : (
                                            <span>{item.content}</span>
                                        )}
                                    </Typography.Text>
                                </Flex>
                            </Col>
                        </Row>
                    )}
                />
            </Flex>
        </Col>
    );
};

export default EsimDetailsAdditionalInfoList;
