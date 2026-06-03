import React, { useRef, useState } from 'react';

import { Button, Col, Empty, Flex, Row, Skeleton } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import left from '@domains/dashboard/Hike/assets/leftarrow.svg';
import right from '@domains/dashboard/Hike/assets/rightarrow.svg';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

import HeaderBanner from '../components/HeaderBanner';
import HomePageCards from '../components/HomePageCards';
import HomePageHeader from '../components/HomePageHeader';
import SubCards from '../components/SubCards';
import useGetAllHike from '../hooks/useGetAllHikes';
import { resetAmount, resetHike } from '../slices/hikeSlice';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { hikeData, loading } = useGetAllHike();
    const [selectedHikes, setSelectedHikes] = useState<any>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { xs, md } = useScreenSize();

    const handleCardClick = (data: any) => {
        setSelectedHikes((prevSelectedHikes: any) => [...prevSelectedHikes, data]);
    };

    const handleSubmit = () => {
        dispatch(resetHike());
        dispatch(resetAmount());
        if (hikeData.length > 0) {
            navigate(paths.hike.purchasePage);
        } else {
            dispatch(
                showToast({
                    description: `No hike plans available`,
                    variant: 'error',
                })
            );
        }
    };

    // Function to scroll left
    const scrollLeft = () => {
        setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
    };

    // Function to scroll right
    const scrollRight = () => {
        // eslint-disable-next-line no-nested-ternary
        const totalVisibleCards = hikeData.length === 1 ? 1 : xs ? 1 : 2;
        const maxIndex = Math.max(0, Math.ceil(hikeData.length / totalVisibleCards) - 1); // Maximum scrollable index
        setCurrentIndex(prevIndex => (prevIndex < maxIndex ? prevIndex + 1 : maxIndex));
    };

    return (
        <>
            {loading ? (
                <Skeleton data-testid="skeleton-loading" />
            ) : (
                <>
                    <HomePageHeader />
                    <HeaderBanner />
                    {hikeData.length > 0 ? (
                        <Row justify="center" gutter={[20, 30]} className="relative py-4">
                            <Col xs={24} sm={24} md={20} lg={22} xl={14} className="relative">
                                {/* Scroll Left Arrow */}
                                {hikeData.length > (xs ? 1 : 2) && (
                                    <ReactSVG
                                        src={left}
                                        className="absolute left-0 z-10 transform -translate-x-full -translate-y-1/2 cursor-pointer top-1/2"
                                        onClick={scrollLeft}
                                        aria-label="left arrow"
                                        beforeInjection={svg => {
                                            if (xs) {
                                                svg.setAttribute(
                                                    'style',
                                                    'width: 22px; height: 22px;'
                                                );
                                            } else if (md) {
                                                svg.setAttribute(
                                                    'style',
                                                    'width: 42px; height: 42px;'
                                                );
                                            }
                                        }}
                                        style={{ marginLeft: xs ? '15px' : '-12px' }}
                                    />
                                )}

                                <Flex className="w-full mx-auto overflow-hidden">
                                    <Flex
                                        ref={scrollContainerRef}
                                        className="flex transition-transform duration-300 ease-in-out"
                                        style={{
                                            // eslint-disable-next-line no-nested-ternary
                                            transform: `translateX(-${currentIndex * (hikeData.length === 1 ? 100 : xs ? 100 : 50)}%)`,
                                            maxWidth: `${hikeData.length * (xs ? 100 : 50)}%`,
                                            margin: '0 auto', // Centers the container
                                        }}
                                    >
                                        {hikeData?.map((data, i) => (
                                            <Col
                                                key={i}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => handleCardClick(data)}
                                                onKeyDown={e => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleCardClick(data);
                                                    }
                                                }}
                                                // eslint-disable-next-line no-nested-ternary
                                                className={`flex-shrink-0 ${hikeData.length === 1 ? 'w-full' : xs ? 'w-full' : 'w-1/2'} px-2`}
                                            >
                                                <SubCards
                                                    salaryAmt={data.salaryAmount}
                                                    salaryValidation={data.salaryValidation}
                                                />
                                                <Col>
                                                    <HomePageCards
                                                        logo={data.logo}
                                                        partner={data.partners}
                                                        amount={data.amount}
                                                        features={data.features}
                                                        planType={data.planType}
                                                        length={hikeData.length}
                                                    />
                                                </Col>
                                            </Col>
                                        ))}
                                    </Flex>
                                </Flex>

                                {/* Scroll Right Arrow */}
                                {hikeData.length > (xs ? 1 : 2) && (
                                    <ReactSVG
                                        src={right}
                                        className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 cursor-pointer translate-x-full ${xs ? 'w-2 h-2' : 'w-8 h-8'}`}
                                        onClick={scrollRight}
                                        aria-label="right arrow"
                                        beforeInjection={svg => {
                                            if (xs) {
                                                svg.setAttribute(
                                                    'style',
                                                    'width: 22px; height: 22px;'
                                                );
                                            } else if (md) {
                                                svg.setAttribute(
                                                    'style',
                                                    'width: 42px; height: 42px;'
                                                );
                                            }
                                        }}
                                        style={{ marginRight: xs ? '15px' : '-12px' }}
                                    />
                                )}
                            </Col>
                        </Row>
                    ) : (
                        <Empty className="my-10" description="No Hike Plans Available" />
                    )}
                    <Flex justify="center" align="center">
                        <Button
                            danger
                            size="small"
                            type="primary"
                            onClick={handleSubmit}
                            disabled={hikeData.length < 1}
                            className="justify-center w-24 h-10 text-xs font-normal rounded-md sm:text-base sm:font-medium sm:w-32"
                        >
                            Buy Now
                        </Button>
                    </Flex>
                </>
            )}
        </>
    );
};

export default HomePage;
