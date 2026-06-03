/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';

import { Col, Flex, Progress, Row, Typography } from 'antd';
import Lottie from 'react-lottie';

import { useAppSelector } from '@src/hooks/hooks';
import useScreenSize from '@src/hooks/useScreenSize';

import FilterComponent from './FilterComponent';
import HeadSearchResult from './HeadSearchResult';
import HeadSearchResultMobile from './HeadSearchResultMobile';
import MobileResultBody from './mobileResultBody';
import WebResultsBody from './webResultsBody';
import { Flight } from '../../types/Flight';
import { noFlightResults } from '../../utils/lottie';

export default function SearchResultComponent() {
    const { md } = useScreenSize();
    const [filterValue, setFilterValue] = useState({
        type: 'departure',
        highest: true,
    });
    const [flightData, setFlightData] = useState<Flight[]>([]);
    const [noResult, setNoResult] = useState<boolean>(false);
    const [flightSearchRes, setFlightSearchRes] = useState<Flight[]>([]);

    const { airlineData, flightResponse } = useAppSelector(state => state.reducer.airline);

    const dataSource =
        flightSearchRes && flightSearchRes.length > 0 ? flightSearchRes : flightResponse;
    const [filterCount, setFilterCount] = useState({ lowestPrice: 0, highestPrice: 1000000 });

    const [isLoading, setIsloading] = useState(true);
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        if (flightResponse.length > 0) {
            setIsloading(false);
            setFlightData(flightResponse);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(0);
            setProgress(prevProgress => {
                if (prevProgress >= 90) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 1000);
    }, [isLoading]);
    return (
        <Row>
            <Col span={24}>
                <Flex vertical gap={20}>
                    {md ? (
                        <HeadSearchResult
                            setFlightResData={setFlightSearchRes}
                            setFlightData={setFlightData}
                            setIsloading={setIsloading}
                            setProgress={setProgress}
                            setFilterCount={setFilterCount}
                            setNoResult={setNoResult}
                        />
                    ) : (
                        <HeadSearchResultMobile
                            setFlightResData={setFlightSearchRes}
                            setFlightData={setFlightData}
                            setIsloading={setIsloading}
                            setProgress={setProgress}
                            setFilterCount={setFilterCount}
                            setNoResult={setNoResult}
                        />
                    )}
                    {isLoading && (
                        <Progress
                            className="pe-14"
                            percent={progress}
                            status="exception"
                            showInfo={false}
                        />
                    )}

                    <Flex vertical gap={20}>
                        <>
                            {noResult ? (
                                <Flex
                                    vertical
                                    justify="center"
                                    align="center"
                                    className="h-full mt-10 full md:mt-28"
                                >
                                    <Lottie
                                        options={noFlightResults}
                                        height={md ? 200 : 100}
                                        width={md ? 400 : 150}
                                    />
                                    <Typography.Text className="mt-6 text-center md:text-sm">
                                        Apologies, no flights found. Kindly consider refining your
                                        search <br /> or exploring alternative destinations.
                                    </Typography.Text>
                                </Flex>
                            ) : md ? (
                                <WebResultsBody
                                    isLoading={isLoading}
                                    filterValue={filterValue}
                                    setFilterValue={setFilterValue}
                                    filterComponent={
                                        <FilterComponent
                                            flightsData={flightData}
                                            setFlightData={setFlightData}
                                            filterCount={filterCount}
                                            data={dataSource}
                                            filterValue={filterValue}
                                            setFilterValue={setFilterValue}
                                        />
                                    }
                                    flightData={flightData}
                                />
                            ) : (
                                <MobileResultBody
                                    isLoading={isLoading}
                                    filterComponent={
                                        <FilterComponent
                                            flightsData={flightData}
                                            setFlightData={setFlightData}
                                            filterCount={filterCount}
                                            data={dataSource}
                                            filterValue={filterValue}
                                            setFilterValue={setFilterValue}
                                        />
                                    }
                                    flightData={flightData}
                                />
                            )}
                        </>
                    </Flex>
                </Flex>
            </Col>
        </Row>
    );
}
