import { useEffect, useState, type FC } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Flex, Typography, Row, Col, Grid } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppSelector } from '@src/hooks/hooks';
import { paths } from '@src/routes/paths';

import '../assets/style.css';
import OfficeSuppliesTopMobile from './OfficeSuppliesTopMobile';
import ShoppingCartIcon from './ShoppingCartIcon';
import { useCartDetailsApi } from '../hooks/useCartDetailsApi';

const { useBreakpoint } = Grid;

interface OfficeSuppliesTopProps {
    titleHidden?: boolean;
    searchHidden?: boolean;
    searchText: string;
    setSearchText: (v: string) => void;
    categoryText?: string;
}

const OfficeSuppliesTop: FC<OfficeSuppliesTopProps> = ({
    titleHidden,
    searchHidden,
    categoryText,
    searchText,
    setSearchText,
}) => {
    const { getCartDetails } = useCartDetailsApi();
    const cartCount = useAppSelector(state => state.reducer.cart.count);
    const navigate = useNavigate();
    const screens = useBreakpoint();
    const [searchTextInput, setSearchTextInput] = useState('');

    useEffect(() => {
        getCartDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Row gutter={12} align="middle" justify="space-between" className="xs:hidden md:flex">
                <Col xs={6} sm={8} md={6} lg={6} xl={6}>
                    <Typography.Text
                        className={`font-medium sm:text-xl ${titleHidden ? 'hidden' : ''}`}
                    >
                        Office Supplies
                    </Typography.Text>
                    {categoryText && (
                        <Typography.Text className="text-xl">{categoryText}</Typography.Text>
                    )}
                </Col>
                <Col xs={0} sm={0} md={12} lg={12} xl={12} className="md:px-3 hidden">
                    <Input
                        placeholder="Search for products"
                        suffix={
                            <SearchOutlined
                                style={{ fontSize: '1.3rem' }}
                                className={`cursor-pointer text-gray-200 `}
                                onClick={() => setSearchText(searchTextInput)}
                            />
                        }
                        allowClear
                        type="text"
                        value={searchTextInput}
                        onChange={e => {
                            setSearchTextInput(e.target.value);
                            if (e.target.value === '') {
                                setSearchText('');
                            }
                        }}
                        onPressEnter={() => setSearchText(searchTextInput)}
                        maxLength={100}
                        className={`border-gray-100 border-b md:border-r-0 md:border-l-0 md:border-t-0 active:shadow-none xs:hidden  ${titleHidden === true ? 'hidden' : 'md:flex'}`}
                    />
                </Col>
                <Col xs={17} sm={16} md={6} lg={6} xl={6}>
                    <Flex className="justify-end md:justify-end gap-5">
                        <Flex gap={5} className="justify-end">
                            <Button
                                type="default"
                                danger
                                size={screens.sm ? 'middle' : 'small'}
                                onClick={() => {
                                    navigate(
                                        `${paths.dashboard.officeSupplies}/${paths.officeSupplies.orderHistory}`
                                    );
                                }}
                            >
                                Order History
                            </Button>
                            <Button
                                onClick={() =>
                                    navigate(
                                        `${paths.dashboard.officeSupplies}/${paths.officeSupplies.cartPage}`
                                    )
                                }
                                size={screens.sm ? 'middle' : 'small'}
                                className="border-none relative shadow-none"
                            >
                                <ShoppingCartIcon />
                                <Flex
                                    className="w-5 h-5 rounded-full bg-red-500"
                                    justify="center"
                                    align="center"
                                    style={{ position: 'absolute', top: -3, right: 48 }}
                                >
                                    <Typography.Text className="text-white text-xs font-medium">
                                        {cartCount}
                                    </Typography.Text>
                                </Flex>
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
            <OfficeSuppliesTopMobile cartCount={cartCount} titleHidden={titleHidden} />
        </>
    );
};

export default OfficeSuppliesTop;
