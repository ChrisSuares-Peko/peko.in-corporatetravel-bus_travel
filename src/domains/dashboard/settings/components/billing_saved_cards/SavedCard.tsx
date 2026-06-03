import React from 'react';

import { Badge, Col, Flex, Image, Radio, Typography } from 'antd';

import { SavedCardData } from '../../types/subscription';
import { getCardImage } from '../../utils';

interface SavedCardProps {
    cardData: SavedCardData;
}
const SavedCard = ({ cardData }: SavedCardProps) => (
    <Col className="p-5 border border-gray-200 border-solid  rounded-2xl">
        <Flex vertical gap={10}>
            <Flex justify="space-between" align="center">
                <Typography.Text className="text-base font-medium">
                    {cardData.cardholderName}
                </Typography.Text>
                {cardData.is_default ? (
                    <Badge
                        status="success"
                        text="Your default"
                        className="px-4 py-1 rounded-2xl"
                        style={{ backgroundColor: '#ECFDF3', color: '#027A48' }}
                    />
                ) : (
                    <Radio value={cardData.id}>Use this card</Radio>
                )}
            </Flex>
            <Typography.Text className="text-base font-medium">
                {cardData.maskedPan}
            </Typography.Text>
            <Flex justify="space-between" align="center">
                <Typography.Text className="text-base">Expiry on {cardData.expiry}</Typography.Text>

                <Image preview={false} src={getCardImage(cardData.scheme)} width={50} />
            </Flex>
        </Flex>
    </Col>
);

export default SavedCard;
