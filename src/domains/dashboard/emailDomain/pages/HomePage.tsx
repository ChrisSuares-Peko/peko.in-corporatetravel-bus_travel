import React, { useEffect, useState } from 'react';

import {
    Col,
    Empty,
    Flex,
    Grid,
    Pagination,
    PaginationProps,
    Row,
    Skeleton,
    Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import { debounce } from 'lodash';

import MoreTransactions from '@assets/svg/moretransactions.svg';

import DomainCard from '../components/DomainCard';
import useEmailDomainApi from '../hooks/useEmailDomainApi';

const { useBreakpoint } = Grid;

const HomePage = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const debouncedSearch = debounce((searchQuery: string) => {
        setDebouncedSearchText(searchQuery);
    }, 500);
    useEffect(() => {
        if (searchText && searchText !== '') {
            setCurrentPage(1);
        }
        debouncedSearch(searchText);
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchText, debouncedSearch]);
    const screens = useBreakpoint();
    const size = screens.sm ? 'default' : 'small';
    const { data, isLoading, count } = useEmailDomainApi(debouncedSearchText, currentPage, limit);
    const handlePageChange: PaginationProps['onChange'] = (page, length) => {
        setCurrentPage(page);
        setLimit(length);
    };
    let cardsToDisplay;
    if (isLoading) {
        cardsToDisplay = Array.from({ length: limit }).map((_, index) => (
            <Col xs={24} sm={12} md={8} xl={6} key={index}>
                <Skeleton active avatar className="h-60 w-60" />
            </Col>
        ));
    } else if (data.length === 0) {
        cardsToDisplay = (
            <Empty
                image={
                    <img
                        src={MoreTransactions}
                        alt="No result"
                        style={{ width: '200px', height: '200px' }}
                    />
                } // Adjust width and height as needed
                description={
                    <div className="font-normal" style={{ marginTop: '80px' }}>
                        No result to show
                    </div>
                } // Add margin-top to position the text below the image
            />
        );
    } else {
        cardsToDisplay = data.map((item, i) => (
            <Col xs={12} sm={12} md={12} lg={12} xl={6} xxl={6} key={i} className="mt-4">
                <DomainCard
                    productId={item.id}
                    image={item.image || ''}
                    name={item.name || ''}
                    offersText={item.offersText || ''}
                />
            </Col>
        ));
    }
    return (
        <Content>
            <Flex justify="start" style={{ marginBottom: '20px' }}>
                <Typography.Title level={4}>Email/Domain</Typography.Title>
            </Flex>
            <Row
                gutter={[20, 20]}
                className="mt-8 h-full "
                justify={data && data.length > 0 ? 'start' : 'center'}
                align="middle"
            >
                {cardsToDisplay}
            </Row>
            {data.length > 0 && (
                <Pagination
                    className="sm:text-end text-center mt-10"
                    size={size}
                    total={count}
                    onChange={handlePageChange}
                    current={currentPage}
                    defaultPageSize={limit}
                    showSizeChanger
                />
            )}
        </Content>
    );
};

export default HomePage;
