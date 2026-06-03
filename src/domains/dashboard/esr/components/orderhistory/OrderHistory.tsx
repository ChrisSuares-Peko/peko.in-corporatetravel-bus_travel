import React, { useState, useEffect } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Flex, Typography, Grid } from 'antd';

import HistoryTable from './HistoryTable';

const OrderHistory: React.FC = () => {
    const [searchTextInput, setSearchTextInput] = useState('');
    const [searchText, setSearchText] = useState<string>('');
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (screens.xs) setSearchText(searchTextInput);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTextInput, screens.xs]);

    return (
        <Flex vertical>
            {screens.xs ? (
                <>
                    <Flex align="center">
                        <Input
                            placeholder="Search"
                            style={{
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            value={searchTextInput}
                            onChange={e => setSearchTextInput(e.target.value)}
                            suffix={<SearchOutlined />}
                        />
                    </Flex>
                    <Typography.Paragraph className="w-full py-5 text-lg font-medium">
                        Order History
                    </Typography.Paragraph>
                </>
            ) : (
                <Flex justify="space-between" className="mb-4">
                    <Typography.Paragraph className="text-xl font-medium">
                        Order History
                    </Typography.Paragraph>
                    <Flex align="center">
                        <Input
                            placeholder="Search"
                            allowClear
                            suffix={<SearchOutlined />}
                            variant="outlined"
                            style={{
                                width: 'calc(100% - 10px)',
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            }}
                            value={searchText}
                            onChange={handleSearchChange}
                        />
                    </Flex>
                </Flex>
            )}
            <HistoryTable searchText={searchText} />
        </Flex>
    );
};

export default OrderHistory;
