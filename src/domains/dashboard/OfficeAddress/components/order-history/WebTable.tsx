import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Flex, Typography } from 'antd';

import useDebounce from '@src/hooks/useDebounce';

import HistoryTable from './HistoryTable';

const OrderHistory: React.FC = () => {
    const [searchTextInput, setSearchTextInput] = React.useState('');
    const debouncedSearchText = useDebounce(searchTextInput, 500);

    return (
        <Flex vertical>
            <Flex justify="space-between" className="mb-4">
                <Typography.Paragraph className={`text-xl  font-medium `}>
                    Order History
                </Typography.Paragraph>
                <Flex align="center">
                    <Input
                        suffix={<SearchOutlined />}
                        allowClear
                        placeholder="Search"
                        style={{
                            width: 'calc(100% - 10px)',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        value={searchTextInput}
                        onChange={e => setSearchTextInput(e.target.value)}
                    />
                </Flex>
            </Flex>
            <HistoryTable searchText={debouncedSearchText} />
        </Flex>
    );
};

export default OrderHistory;
