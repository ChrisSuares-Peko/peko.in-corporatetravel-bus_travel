import { useRef, useState } from 'react';

import { Card, Col, Flex, Grid, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import { paths } from '@src/routes/paths';

import signImage from '../../assets/icons/sign.svg';
import useGetOrderDetails from '../../hooks/useGetOrderDetails';
import AttestationTitle from '../sections/AttestationTitle';
import AttestationTitleMobileView from '../sections/AttestationTitleMobileView';
import DeliveryDetails from '../sections/DeliveryDetails';
import DocumentDetails from '../sections/DocumentDetails';

const DocumentAttestationView = () => {
    const { useBreakpoint } = Grid;
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const [searchKey, setSearchKey] = useState(0);
    const { ordersList, setReload } = useGetOrderDetails(searchKey);
    const form1Ref = useRef();
    if (ordersList) {
        if (ordersList.length !== 0)
            navigate(
                `${paths.documentAttestation.orderhistory}/${paths.documentAttestation.orderdetails}/${searchKey}`
            );
    }

    const handleSearch = (text: number) => {
        setSearchKey(text);
        setReload(true);
    };

    return (
        <Flex vertical gap={33}>
            {screens.md ? (
                <AttestationTitle setSearchKey={handleSearch} />
            ) : (
                <AttestationTitleMobileView setSearchKey={handleSearch} />
            )}

            <Row>
                <Col xs={24} lg={12}>
                    <DocumentDetails form1Ref={form1Ref} />
                    <Flex className="hidden md:flex">
                        <DeliveryDetails form1Ref={form1Ref} />
                    </Flex>
                </Col>
                <Col xs={24} lg={12} className="hidden lg:block">
                    <Card
                        size="small"
                        className="ml-10 py-10 px-10 bg-bgResultCard rounded-2xl border-0"
                    >
                        <Flex gap={30} vertical align="center">
                            <Typography.Text className="text-2xl flex text-center font-semibold">
                                Professional document attestation service at your fingertips
                            </Typography.Text>
                            <ReactSVG src={signImage} />
                            <Typography.Text className="text-lg flex text-center  font-normal ">
                                Provide all the necessary details about the document, your address,
                                contact details, email ID, and phone number. Our dedicated executive
                                will collect the document from you and deliver it after attestation.{' '}
                            </Typography.Text>
                        </Flex>
                    </Card>
                </Col>
            </Row>
        </Flex>
    );
};

export default DocumentAttestationView;
