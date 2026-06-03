import React, { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Flex, Input, Row, Typography } from 'antd';

import CouponCodeModal from './CouponCodeModal';
import { refresh } from '../../types/accessCode';

type Props = {
    handleSearch: (e: any) => void;
    searchText: string;
};
const CouponCodeHeader = ({ searchText, handleSearch, setRefresh }: Props & refresh) => {
    const [openModal, setOpenModal] = useState(false);
    return (
        <Row justify="space-between" className="w-full gap-5">
            <Flex>
                <Typography.Text />
            </Flex>
            <Flex className="flex-col justify-end w-full gap-3 px-0 md:flex-row md:w-auto">
                <Button
                    type="primary"
                    className="w-full sm:w-fit"
                    danger
                    onClick={() => setOpenModal(true)}
                >
                    Add Coupon Code
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
                <CouponCodeModal
                    open={openModal}
                    handleCancel={() => setOpenModal(false)}
                    setRefresh={setRefresh}
                />
            )}
        </Row>
    );
};

export default CouponCodeHeader;
