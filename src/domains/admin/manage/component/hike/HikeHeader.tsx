import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row } from 'antd';

import HikeModal from './HikeModal';

interface modalProps {
    searchText: string;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
    handleSearch: any;
}
const HikeHeader = ({ searchText, setRefresh, handleSearch }: modalProps) => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <Row justify="space-between" className="w-full gap-5">
            <Flex className="flex justify-start gap-3 ">
                <Flex className="hidden">
                    <Button danger>Excel</Button>
                    <Button danger>CSV</Button>
                    <Button danger>PDF</Button>
                </Flex>
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                <Button
                    type="primary"
                    className="w-full sm:w-fit"
                    danger
                    onClick={() => setOpenModal(true)}
                >
                    Add Hike
                </Button>

                <Input
                    value={searchText}
                    placeholder="Search "
                    suffix={<SearchOutlined />}
                    onChange={handleSearch}
                    allowClear
                    type="text"
                    variant="outlined"
                    maxLength={100}
                />
            </Flex>
            {openModal && (
                <HikeModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    setRefresh={setRefresh}
                />
            )}
        </Row>
    );
};

export default HikeHeader;
