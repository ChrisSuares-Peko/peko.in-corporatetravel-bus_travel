import { SearchOutlined } from '@ant-design/icons';
import { Select, Input, Row, Col, Typography } from 'antd';

import { filterOptionsInListing } from '@src/domains/dashboard/GiftCards/utils/data';

interface tagProps {
    count?: number;
    category: string;
    setCategory: (value: any) => void;
    searchText: string;
    setSearchText: (value: any) => void;
    setCurrentPage: (value: number) => void;
}

const TagElement = ({
    count,
    category,
    setCategory,
    searchText,
    setSearchText,
    setCurrentPage,
}: tagProps) => (
    <Row className="mt-3 md:mt-12 gap-5 justify-between" align="middle">
        <Col className="w-full md:w-auto">
            <Typography.Text className="font-normal text-lg sm:text-xl">
                Delight your clients and employees by sending them gift cards instantly
            </Typography.Text>
        </Col>
        <Row gutter={[16, 16]}>
            <Col className="flex flex-col md:flex-row gap-2 w-full md:w-auto justify-end">
                <Input
                    placeholder="Search for gift cards"
                    value={searchText}
                    suffix={<SearchOutlined />}
                    allowClear
                    type="text"
                    maxLength={100}
                    onChange={e => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="text-[.8rem] sm:text-[.9rem]"
                />
            </Col>
            <Col>
                <Select
                    defaultValue={category}
                    onChange={value => {
                        setCategory(value);
                        setCurrentPage(1);
                    }}
                    options={filterOptionsInListing}
                    style={{ width: 100 }}
                    className="w-full xs:mt-2 sm:mt-0"
                />
            </Col>
        </Row>
    </Row>
);

export default TagElement;
