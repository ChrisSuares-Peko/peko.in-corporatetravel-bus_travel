import { type FC } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Col, Flex, Input, Row, Select, Typography } from 'antd';

import { officeSuppliesFilterOptions } from '@domains/dashboard/officeSupplies/utils/data';

interface ProductListingProps {
    filter: string;
    setFilter: (v: string) => void;
    selectedCategoryName: string;
    searchText: string;
    setSearchText: (v: string) => void;
    setCurrentPage: (v: number) => void;
}

const Filters: FC<ProductListingProps> = ({
    filter,
    setFilter,
    selectedCategoryName,
    searchText,
    setSearchText,
    setCurrentPage,
}) => (
    <Flex vertical>
        <Row>
            <Col xs={24} md={12}>
                <Typography.Text className="text-xl ms-2 text-textBlack">
                    {selectedCategoryName}
                </Typography.Text>
            </Col>
            <Col xs={24} md={12}>
                <Row
                    className="xs:mt-5 mt-0 gap-5 justify-end flex-row-reverse md:flex-row"
                    align="middle"
                >
                    <Col className=" hidden md:block">
                        <Input
                            placeholder="Search for products"
                            suffix={
                                <SearchOutlined
                                    style={{ fontSize: '1.3rem' }}
                                    className={`cursor-pointer text-gray-200 `}
                                    onClick={() => setSearchText(searchText)}
                                />
                            }
                            allowClear
                            type="text"
                            value={searchText}
                            onChange={e => {
                                setSearchText(e.target.value);
                            }}
                            maxLength={100}
                            className="border-gray-200 border active:shadow-none  w-full"
                        />
                    </Col>
                    <Col>
                        <Select
                            className="border-gray-200 text-gray-200 rounded-sm"
                            defaultValue={filter}
                            style={{ width: 150 }}
                            onChange={v => {
                                setFilter(v);
                                setCurrentPage(1);
                            }}
                            options={officeSuppliesFilterOptions}
                        />
                    </Col>
                    <Col xs={24} sm={24} md={0} lg={0} xl={0} className="mt-4">
                        <Input
                            placeholder="Search for products"
                            suffix={
                                <SearchOutlined
                                    style={{ fontSize: '1.3rem' }}
                                    className={`cursor-pointer text-gray-200 `}
                                    onClick={() => setSearchText(searchText)}
                                />
                            }
                            allowClear
                            type="text"
                            value={searchText}
                            onChange={e => {
                                setSearchText(e.target.value);
                            }}
                            maxLength={100}
                            className="border-gray-200 border active:shadow-none  w-full"
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    </Flex>
);

export default Filters;
