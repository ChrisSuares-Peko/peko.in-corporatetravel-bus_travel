import React from 'react';

import { Col, Flex, Input, Typography } from 'antd';

type Props = {
    setSearchTextInput: (v: string) => void;
};

// eslint-disable-next-line arrow-body-style
const Header = ({ setSearchTextInput }: Props) => {
    return (
        <Col span={24}>
            <Flex className="w-full" justify="space-between" align="baseline">
                <Typography.Text className="text-lg font-medium">Order History</Typography.Text>
                <Input.Search
                    allowClear
                    className="w-64"
                    placeholder="Search"
                    onChange={e => setSearchTextInput(e.target.value)}
                    onSearch={e => setSearchTextInput(e)}
                />
            </Flex>
        </Col>
    );
};

export default Header;
