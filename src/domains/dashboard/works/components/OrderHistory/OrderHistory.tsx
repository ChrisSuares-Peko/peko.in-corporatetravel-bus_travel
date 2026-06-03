// OrderHistory.tsx
import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Flex, Typography } from 'antd';

// Update the path accordingly

import useDebounce from '@src/hooks/useDebounce';
import useScreenSize from '@src/hooks/useScreenSize';

import HistoryTable from './HistoryTable';
import HistoryTableMobile from './HistoryTableMobile';

const OrderHistory: React.FC = () => {
    const screen = useScreenSize();
    const [searchText, setSearchText] = React.useState<string>('');
    const debouncedSearchText = useDebounce(searchText, 500);
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    return (
        <Flex vertical>
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
                    {/* <Button
                            icon={<SearchOutlined />}
                            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                            onClick={() => setSearchText(searchTextInput)}
                        /> */}
                </Flex>
            </Flex>
            {screen.xs ? (
                <HistoryTableMobile searchText={debouncedSearchText} />
            ) : (
                <HistoryTable searchText={debouncedSearchText} />
            )}
        </Flex>
    );
};

export default OrderHistory;
