import React, { useEffect, useState } from 'react';

import { Col, Row, Pagination, Skeleton, Grid, PaginationProps, Empty } from 'antd';
import { Content } from 'antd/es/layout/layout';
import clevertap from 'clevertap-web-sdk';
import { debounce } from 'lodash';

import MoreTransactions from '@assets/svg/moretransactions.svg';
import SubHeader from '@src/domains/dashboard/Subscriptions/components/SubscriptionListing/SubHeader';
import SubscriptionCard from '@src/domains/dashboard/Subscriptions/components/SubscriptionListing/SubscriptionCard';
import SubscriptionHeader from '@src/domains/dashboard/Subscriptions/components/SubscriptionListing/SubscriptionHeader';

import Categories from '../components/SubscriptionListing/Categories';
import { useGetCategories } from '../hooks/useCategory';
import useSubscriptionApi from '../hooks/useSubscriptionApi';

const { useBreakpoint } = Grid;

const SubscriptionsListing = () => {
    const [searchText, setSearchText] = useState<string>('');
    const [debouncedSearchText, setDebouncedSearchText] = useState<string>(searchText);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(20);
    const [category, setCategory] = useState<string>('All');

    const { CategoryData, Loading } = useGetCategories();
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState('All Categories');

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

    useEffect(() => {
        clevertap.event.push('Softwares', {
            Page: 'Softwares',
            Action: 'Subscription page loaded',
            // Action:'softwares clicked',
            // Email: user?.email,
            // SubscriptionName: name
        });
    }, []);

    const { data, isLoading, count } = useSubscriptionApi(
        debouncedSearchText,
        currentPage,
        category,
        limit,
        selectedCategory
    );

    const handlePageChange: PaginationProps['onChange'] = (page, length) => {
        if (length !== limit) {
            setCurrentPage(1);
        } else {
            setCurrentPage(page);
        }
        setLimit(length);
    };
    const screens = useBreakpoint();
    const size = screens.sm ? 'default' : 'small';

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
                <SubscriptionCard
                    image={item.image}
                    id={item.id}
                    title={item.name}
                    description={item.description}
                    discount={item.badge}
                />
            </Col>
        ));
    }

    return (
        <Content className="mb-20 ">
            <SubscriptionHeader />
            <Categories
                isLoading={Loading}
                category={CategoryData}
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
                setSelectedCategoryName={setSelectedCategoryName}
            />
            <SubHeader
                count={count}
                category={category}
                setCategory={setCategory}
                searchText={searchText}
                setSearchtext={setSearchText}
            />
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

export default SubscriptionsListing;
