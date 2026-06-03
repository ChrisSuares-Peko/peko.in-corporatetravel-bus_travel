import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row } from 'antd';

import WhatsAppNumberModal from './WhatsAppNumberModal'; // Update this if necessary
import { refresh } from '../../types/refferalCode';

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
    setRefresh: (refresh: boolean) => void;
};

const WhatsAppNumbersHeaders = ({ searchText, handleSearch, setRefresh }: Props & refresh) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Row justify="end" className="w-full gap-5">
            <Flex className="flex justify-start gap-3">
                <Button type="primary" danger onClick={() => setOpenModal(true)}>
                    Add New WhatsApp Number
                </Button>
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                <Input
                    value={searchText}
                    placeholder="Search"
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
            {openModal && (
                <WhatsAppNumberModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    setRefresh={setRefresh}
                />
            )}
        </Row>
    );
};

export default WhatsAppNumbersHeaders;
