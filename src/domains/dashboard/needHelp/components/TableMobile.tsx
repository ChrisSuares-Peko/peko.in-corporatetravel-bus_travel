import React, { useState } from 'react';

import { RightOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Flex, Row, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';

import { ticketListingTableData } from '../types/type';

interface DetailProps {
    label: string;
    value: string | number;
}

const DetailSection: React.FC<DetailProps> = ({ label, value }) => (
    <Flex justify="space-between" className="w-full ">
        <Typography.Text style={{ fontWeight: 400 }}>{label} :</Typography.Text>
        <Typography.Text className="font-normal">{value}</Typography.Text>
    </Flex>
);

interface TableProp {
    ticket: ticketListingTableData;
    handleButtonClick: (record: ticketListingTableData) => void;
}
const dateFormat = 'DD-MM-YYYY';
const TableMobile: React.FC<TableProp> = ({ ticket, handleButtonClick }) => {
    const { date, status, module, ticketId } = ticket;

    const formattedDate = dayjs(date).format(dateFormat);
    const [showMore, setshowMore] = useState<boolean>(false);
    const handleSeeMore = () => {
        setshowMore(!showMore);
    };
    const details = [
        { label: 'Date', value: formattedDate },
        { label: 'Ticket ID', value: ticketId },
        { label: 'Module', value: module },
        { label: 'Issue Details', value: 'details' },
    ];
    return (
        <Content className="p-5 rounded-md ">
            <Flex gap={20} vertical>
                <Row gutter={[20, 20]} align="middle">
                    <Col xs={7}>
                        {' '}
                        <Flex justify="start">
                            <Typography.Text className="text-xs">{formattedDate}</Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={7}>
                        <Flex justify="center">
                            <Typography.Text className="text-xs font-normal text-center text-textDarkGray">
                                {module}
                            </Typography.Text>
                        </Flex>
                    </Col>
                    <Col xs={8}>
                        <Flex justify="center">
                            <Button
                                danger
                                size="small"
                                style={{
                                    background:
                                        status === 'SUCCESS'
                                            ? 'var(--Success-50, #ECFDF3)'
                                            : 'rgba(242, 244, 247, 1)',

                                    color:
                                        status === 'SUCCESS'
                                            ? 'var(--Success-700, #027A48)'
                                            : 'rgba(52, 64, 84, 1)',
                                }}
                                className="px-3 text-xs border-0 rounded-xl"
                                disabled
                            >
                                {status}
                            </Button>
                        </Flex>
                    </Col>
                    <Col xs={2}>
                        <Flex justify="end">
                            <RightOutlined
                                onClick={handleSeeMore}
                                className={`collapse-icon ${showMore ? 'open' : ''}`}
                            />
                        </Flex>
                    </Col>
                </Row>
                {showMore && (
                    <Flex vertical gap={10} className="p-6 bg-bgLightGray">
                        {details.map((detail, index) => (
                            <DetailSection key={index} {...detail} />
                        ))}
                        <Button
                            size="small"
                            danger
                            className="mt-4"
                            onClick={() => handleButtonClick(ticket)}
                        >
                            View
                        </Button>
                    </Flex>
                )}
                <Divider className="border border-solid" />
            </Flex>
        </Content>
    );
};

export default TableMobile;
