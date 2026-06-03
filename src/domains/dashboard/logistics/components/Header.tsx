import { useState } from 'react';

import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Grid, Input, Row, Tooltip, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

const { Text } = Typography;

const { useBreakpoint } = Grid;

export default function Header() {
    const screens = useBreakpoint();
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState('');
    const dispatch = useAppDispatch();

    const handleSearchClick = () => {
        if (searchValue.length >= 8) {
            // dispatch(showToast({ description: 'Performing search...', variant: 'success' }));
            navigate(`${paths.logistics.track}?trackingNo=${searchValue}`);
        } else {
            dispatch(
                showToast({
                    description: 'Tracking no must be at least 8 characters long',
                    variant: 'error',
                })
            );
        }
    };

    return (
        <>
            <Row justify="space-between" className="gap-4">
                <Col>
                    <Flex align="center">
                        <Typography.Text className="text-lg font-medium align-middle sm:text-xl">
                            Logistics
                        </Typography.Text>
                        <Typography.Text className="text-zinc-500  text-[.8rem] ps-2 hidden sm:block">
                            (Serving 100+ Countries)
                        </Typography.Text>
                    </Flex>
                </Col>
                <Col className="sm:hidden">
                    <Button
                        onClick={() => navigate(paths.logistics.orderHistory)}
                        danger
                        className="text-[.8rem] sm:text-[.9rem]"
                        type="default"
                        size={screens.sm ? 'middle' : 'small'}
                        block
                    >
                        Order History
                    </Button>
                </Col>
                <Flex justify="between" className="w-full md:w-fit">
                    <Col className="w-full mt-5 pe-1 md:w-fit sm:mt-0">
                        <Tooltip
                            title="Please enter the tracking number you received when your order was created"
                            placement="bottomLeft"
                            color="gray"
                        >
                            <Input
                                placeholder="Track your shipment"
                                className="text-[.8rem] sm:text-[.9rem]"
                                value={searchValue}
                                onChange={e => setSearchValue(e.target.value)}
                                addonAfter={<SearchOutlined onClick={handleSearchClick} />}
                                allowClear
                                type="text"
                                minLength={8}
                                maxLength={20}
                            />
                        </Tooltip>
                    </Col>
                    <Col className="hidden ps-1 sm:block">
                        <Button
                            onClick={() => navigate(paths.logistics.orderHistory)}
                            danger
                            className="text-[.8rem] sm:text-[.9rem]"
                            type="default"
                            block
                        >
                            Order History
                        </Button>
                    </Col>
                </Flex>
            </Row>
            <Flex
                justify="center"
                className="px-[.7rem] py-3 mb-2 mt-4 sm:mb-4 sm:mt-2 border-[1px] border-green-200  sm:border-0 bg-green-50 sm:bg-white"
            >
                <Text
                    className="text-[.9rem] text-center  sm:text-[1.1rem] md:text-[1.3rem] font-thin
                text-textGreenTitle sm:text-black"
                >
                    Book now, and one of the Aramex agents will pick up the parcel/document from
                    your address.
                </Text>
            </Flex>
        </>
    );
}
