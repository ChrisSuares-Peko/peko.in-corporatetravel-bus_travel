import React from 'react';

import { Card, Row, Col, Flex } from 'antd';

import { BeneficiaryData } from '@src/domains/dashboard/vendorPayouts/types/types';

import CardHeader from './CardHeader';
import DetailSection from './DetailSection';
import SectionTitle from './SectionTitle';

interface MiniCardProps {
    beneficiariesData: BeneficiaryData | null;
}

const MiniCard: React.FC<MiniCardProps> = ({ beneficiariesData }) => {
    if (!beneficiariesData) {
        return null; // or render some placeholder content
    }

    return (
        <Card className="md:mb-4 mb-6 md:p-0 rounded-3xl shadow-sm  w-full">
            <CardHeader value={beneficiariesData.fullName} />

            <Row gutter={[5, 5]} className="w-full">
                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <SectionTitle title="Bank Account" />
                    <Flex className="mb-2">
                        <DetailSection label="Name" value={beneficiariesData.fullName} />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection
                            label="Account Number"
                            value={beneficiariesData.bankAccountNumber}
                        />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection label="IBAN" value={beneficiariesData.bankCode} />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection label="Bank Name" value={beneficiariesData.bankName} />
                    </Flex>
                </Col>

                <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <SectionTitle title="Contact Details" />
                    <Flex className="mb-2">
                        <DetailSection label="Address" value={beneficiariesData.addressLineOne} />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection
                            label="ID Number"
                            value={beneficiariesData.bankAccountNumber}
                        />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection label="City" value={beneficiariesData.city} />
                    </Flex>
                    <Flex className="mb-2">
                        <DetailSection label="Phone Number" value={beneficiariesData.phoneNumber} />
                    </Flex>
                </Col>
            </Row>
        </Card>
    );
};

export default MiniCard;
