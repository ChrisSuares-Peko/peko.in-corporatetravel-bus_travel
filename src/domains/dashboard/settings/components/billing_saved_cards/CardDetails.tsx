import React, { useState } from 'react';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Flex, Image, Radio, Row, Typography } from 'antd';

import DrawerModal from '@components/atomic/DrawerModal';

import SavedCard from './SavedCard';
import TextCard from './TextCard';
import useSavedCards from '../../hooks/subscriptions/useSavedCards';
import { getCardImage } from '../../utils';

const CardDetails = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const { allCards, defaultCard, isLoading, changeDefaultCard } = useSavedCards(setOpenDrawer);
    const handleRadioChange = (e: any) => setSelectedCardId(e.target.value);

    if (!defaultCard) return null;

    return (
        <Col
            xs={24}
            lg={9}
            className="flex flex-col justify-between gap-4 py-5 border border-gray-200 border-solid px-7 rounded-2xl"
        >
            <Flex vertical>
                <Flex justify="space-between">
                    <Typography.Text className="text-base font-medium">
                        Payment Method
                    </Typography.Text>
                    <Button
                        danger
                        className="text-xs font-medium"
                        onClick={() => setOpenDrawer(true)}
                    >
                        Change
                    </Button>
                </Flex>
                <Row className="gap-6 mt-4">
                    <Col>
                        <Image preview={false} src={getCardImage(defaultCard.scheme)} width={40} />
                    </Col>
                    <Col>
                        <Typography.Text className="text-base font-medium ">
                            {defaultCard.maskedPan}
                        </Typography.Text>
                        <Flex gap={25} className="mt-2">
                            <TextCard value={`Expiry on  ${defaultCard.expiry}`} />
                        </Flex>
                    </Col>
                </Row>
            </Flex>

            {openDrawer && (
                <DrawerModal
                    open={openDrawer}
                    handleCancel={() => setOpenDrawer(false)}
                    modalTitle="Select your default card"
                    closeIcon
                    footer={
                        <Flex className="w-full " justify="flex-end" gap={10} key="">
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                className="px-5"
                                loading={isLoading}
                                onClick={() => changeDefaultCard(selectedCardId)}
                            >
                                Submit
                            </Button>

                            <Button
                                key="back"
                                onClick={() => setOpenDrawer(false)}
                                className="px-5"
                            >
                                Cancel
                            </Button>
                        </Flex>
                    }
                >
                    <Flex vertical gap={30}>
                        <Alert
                            description="Users cannot add a new card directly here. To add a new card, use the 
                             card for any transaction within any service on the platform."
                            type="warning"
                            showIcon
                            icon={<ExclamationCircleOutlined style={{ fontSize: '20px' }} />}
                            className="p-5 border-0 text-sm"
                        />
                        <Radio.Group onChange={handleRadioChange} value={selectedCardId}>
                            <Flex vertical gap={20}>
                                {allCards &&
                                    allCards.map(card => (
                                        <SavedCard cardData={card} key={card.id} />
                                    ))}
                            </Flex>
                        </Radio.Group>
                    </Flex>
                </DrawerModal>
            )}
        </Col>
    );
};

export default CardDetails;
