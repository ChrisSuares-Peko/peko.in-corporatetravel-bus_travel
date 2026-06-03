import React from 'react';

import { Card, Flex, Modal, Typography } from 'antd';

interface hotelProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    roomData: any;
}
const CheckInRoomDetails = ({ roomData, isModalOpen, handleCancel }: hotelProps) => (
    <Modal
        title="Room Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={800}
    >
        <Card
            className="h-full  sm:border-none md:border md:border-solid rounded-2xl"
            style={{ maxHeight: '70vh', overflowY: 'auto' }}
        >
            <Flex vertical gap={15}>
                <Typography
                    dangerouslySetInnerHTML={{ __html: roomData! }}
                    className="mt-3 text-justify"
                    style={{ lineHeight: '1.5' }}
                />
            </Flex>
        </Card>
    </Modal>
);

export default CheckInRoomDetails;
