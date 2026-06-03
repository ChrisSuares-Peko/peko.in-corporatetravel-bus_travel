import React from 'react';

import { Button, Flex, Row, Typography, Grid, Col, Card } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import CertificateCard from '../components/taxRegistration/CertificateCard';

const { useBreakpoint } = Grid;

const TaxOrderDetails: React.FC = () => {
    const { taxData } = useAppSelector(state => state.reducer.accounting);
    const screens = useBreakpoint();
    const navigate = useNavigate();

    function handleDeleteDocs() {
        console.log('delete button clicked');
    }

    return (
        <Content>
            <Flex justify="center" vertical className="mt-16" gap={10}>
                <Flex justify="center" gap={8}>
                    {taxData.status === 'COMPLETED' ? (
                        <Flex vertical>
                            <Typography.Text className=" text-lg sm:text-xl  font-medium text-center">
                                Your corporate tax registration has been successfully completed.
                            </Typography.Text>
                            <Flex justify="center" className="mt-3">
                                <Typography.Text className="   text-xl font-medium text-center">
                                    Status:
                                </Typography.Text>
                                <Typography.Text className="ml-1 text-green-600 text-xl font-medium text-center">
                                    {taxData.status.charAt(0) +
                                        taxData.status.slice(1).toLowerCase()}
                                </Typography.Text>
                            </Flex>
                            <Typography.Text className=" mt-3  text-sm font-normal text-center">
                                You can download your registration certificate below.
                            </Typography.Text>
                        </Flex>
                    ) : (
                        <Flex vertical>
                            <Typography.Text className=" text-base sm:text-xl  font-normal text-center">
                                Your document submission is currently under review.
                            </Typography.Text>
                            <Flex justify="center" className="mt-3">
                                <Typography.Text className="   text-xl font-medium text-center">
                                    Status:
                                </Typography.Text>
                                <Typography.Text className=" text-yellow-600 text-xl ml-1 font-medium text-center">
                                    {taxData.status.charAt(0) +
                                        taxData.status.slice(1).toLowerCase()}
                                </Typography.Text>
                            </Flex>
                            <Typography.Text
                                className="mt-3 text-sm font-normal text-center"
                                style={{ width: '550px' }}
                            >
                                To stay updated, you can monitor the latest status right here on
                                this page. Additionally, we will keep you informed by sending
                                updates to your email address.
                            </Typography.Text>
                        </Flex>
                    )}
                </Flex>
            </Flex>

            <Card className="mt-10">
                <Row>
                    <Col xs={24}>
                        {' '}
                        <Flex>
                            <Typography.Text className="text-base font-medium">
                                Your Information{' '}
                            </Typography.Text>
                        </Flex>
                    </Col>
                </Row>
                <Row gutter={[5, 25]} className="mt-6">
                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Company Name{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {taxData.companyName}
                            </Typography.Text>
                        </Flex>
                    </Col>

                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Authorized Contact Person
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {taxData.contactPerson}
                            </Typography.Text>
                        </Flex>
                    </Col>

                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Email ID
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {taxData.email}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={12} lg={6}>
                        <Flex vertical gap={10}>
                            <Typography.Text className="text-zinc-500 text-sm font-normal">
                                Corporate Tax Period{' '}
                            </Typography.Text>
                            <Typography.Text className="text-sm font-normal">
                                {taxData.taxPeriod}
                            </Typography.Text>
                        </Flex>
                    </Col>
                </Row>
            </Card>
            {taxData.status === 'COMPLETED' ? (
                <Flex className="mt-8 " vertical gap={8}>
                    <Typography.Text className=" font-medium text-base sm:text-xl">
                        Download Documents
                    </Typography.Text>
                    <Col xs={24} md={8}>
                        <CertificateCard
                            certificateName="Tax Certificate Document"
                            link={taxData?.taxCertificateDoc}
                            highlight
                        />
                        {taxData.tradeLicenseDoc.map((item: any, index: any) => (
                            <CertificateCard
                                key={`tradeLicenseDoc_${index + 1}`}
                                certificateName={`Trade License ${index + 1}`}
                                link={Object.values(item)[0]}
                            />
                        ))}
                        <CertificateCard certificateName="Passport" link={taxData.passportDoc} />
                        <CertificateCard
                            certificateName="Emirates ID"
                            link={taxData.emiratesIDDoc}
                        />
                        <CertificateCard
                            certificateName="Memorandum of Association"
                            link={taxData.corporateGovernanceDoc}
                        />
                    </Col>
                </Flex>
            ) : (
                <></>
            )}

            <Flex vertical className="mt-8 ">
                <Typography.Text className=" text-zinc-900 text-xl font-normal">
                    Get Help
                </Typography.Text>
                <Button
                    type="default"
                    danger
                    size="middle"
                    className="w-32 mt-3"
                    onClick={() => navigate(`/${paths.needHelp.index}`)}
                >
                    Go to support
                </Button>
            </Flex>
        </Content>
    );
};

export default TaxOrderDetails;
