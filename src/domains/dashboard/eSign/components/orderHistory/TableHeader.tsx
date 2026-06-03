import { type FC } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Flex, Input, Typography } from 'antd';

interface TableHeaderProps {
    setSearchText: (v: string) => void;
    searchText?: string;
}

const TableHeader: FC<TableHeaderProps> = ({ setSearchText, searchText }) => (
    <Flex gap={15} className="mb-4 flex-col sm:flex-row justify-between">
        <Typography.Paragraph className="text-xl font-medium">eSign Status</Typography.Paragraph>
        <Flex align="center">
            <Input
                placeholder="Search document name"
                allowClear
                suffix={<SearchOutlined />}
                variant="outlined"
                style={{
                    width: 'calc(100% - 10px)',
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                }}
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
            />
        </Flex>
    </Flex>
);

export default TableHeader;
