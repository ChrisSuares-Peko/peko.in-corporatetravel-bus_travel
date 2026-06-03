/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useState } from 'react';

import { Card, Flex, Row, Typography, Pagination } from 'antd';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import useScrollUpOnPageChange from '@src/hooks/useScrollTopOnPageChange';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import SearchResultCard from './SearchResultCard';
import { setSelectedAirline } from '../../../slices/airlineSlice';
import { Flight } from '../../../types/Flight';
import '../../../assets/style.css';
import { noFlightResults } from '../../../utils/lottie';
import FlightInfoDrawer from '../FlightInfoDrawer';

interface FlightDetailProps {
    flights: Flight[] | undefined;
}

function SearchResultBody({ flights }: FlightDetailProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [drawerDetails, setDrawerDetails] = useState<Flight>();
    const [selectedAirlinePrice, setSelectedAirlinePrice] = useState<number>();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

    const [currentPage, setCurrentPage] = useState<number>(1);
    // const [paginatedFlights, setPaginatedFlights] = useState<any[]>([]);
    const [itemsPerPage] = useState<number>(7);

    const handleClick = (item: Flight) => {
        const { offerId } = item;
        if (!offerId) {
            dispatch(
                showToast({
                    description: 'This is not available at this moment',
                    variant: 'warning',
                })
            );
            console.log('offerId is not available');
        } else {
            dispatch(setSelectedAirline(item));
            navigate(
                `${paths.dashboard.corporateTravel}/${paths.airline.index}/${paths.airline.results}/${paths.airline.details}`
            );
        }
    };

    // Calculate paginated data
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedFlights = flights?.slice(startIndex, endIndex) || [];

    useEffect(() => {
        setCurrentPage(1);
    }, [flights]);

    useScrollUpOnPageChange(currentPage);
    return (
        <Card
            bordered={false}
            className="bg-[#F4F6FA] flex-1  mt-3 "
            bodyStyle={{ padding: '1rem' }}
        >
            {!flights || flights?.length === 0 ? (
                <Flex className="w-full h-full mt-28" vertical justify="center" align="center">
                    <Lottie options={noFlightResults} height={250} width={400} />
                    <Typography.Text className="mt-8 text-center md:text-sm">
                        Apologies, no flights found. Kindly consider refining your search <br /> or
                        exploring alternative destinations.
                    </Typography.Text>
                </Flex>
            ) : (
                <Flex vertical justify="space-between">
                    <Row gutter={10}>
                        {paginatedFlights.map((item, index) => (
                            <SearchResultCard
                                item={item}
                                key={index}
                                handleClick={handleClick}
                                setDrawerDetails={setDrawerDetails}
                                setIsDrawerOpen={setIsDrawerOpen}
                                setSelectedAirlinePrice={setSelectedAirlinePrice}
                            />
                        ))}
                    </Row>
                    <Flex justify="end">
                        <Pagination
                            current={currentPage}
                            pageSize={itemsPerPage}
                            total={flights.length}
                            onChange={page => setCurrentPage(page)}
                            className="text-end pt-7"
                            showSizeChanger={false}
                        />
                    </Flex>
                </Flex>
            )}
            {isDrawerOpen && (
                <FlightInfoDrawer
                    handleClose={() => setIsDrawerOpen(!isDrawerOpen)}
                    flightDetails={drawerDetails ?? drawerDetails}
                    price={selectedAirlinePrice}
                    isDrawerOpen={isDrawerOpen}
                    handleSubmit={handleClick}
                />
            )}
        </Card>
    );
}

export default SearchResultBody;
