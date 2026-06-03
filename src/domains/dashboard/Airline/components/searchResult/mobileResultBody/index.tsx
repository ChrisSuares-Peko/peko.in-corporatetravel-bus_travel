import React, { useState } from 'react';

import { FilterOutlined } from '@ant-design/icons';
import { Col, Modal, Row, Skeleton } from 'antd';

import SearchResultCardMobile from './SearchResultCardMobile';
import { Flight } from '../../../types/Flight';

interface MobileResultBodyProps {
    isLoading: boolean;
    filterComponent: React.ReactNode;
    flightData: Flight[];
}

export default function MobileResultBody({
    isLoading,
    filterComponent,
    flightData,
}: MobileResultBodyProps) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <Row gutter={[20, 20]}>
            <Col span={24}>
                <Col
                    className="border flex w-full p-1 text-center justify-center item-center rounded-md bg-gray-50 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <FilterOutlined className="mr-2" /> Filter
                </Col>
                <Modal
                    okButtonProps={{ className: 'bg-red-500' }}
                    closeIcon={false}
                    open={isModalOpen}
                    onOk={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                    width={370}
                >
                    {filterComponent}
                </Modal>
            </Col>
            <Col span={24}>
                {isLoading ? (
                    Array.from({ length: 5 }, (_, index) => (
                        <Skeleton.Input
                            style={{ height: '120px' }}
                            className="w-full mt-4"
                            active={isLoading}
                            size="large"
                            block
                        />
                    ))
                ) : (
                    <SearchResultCardMobile flights={flightData} />
                )}
            </Col>
        </Row>
    );
}
