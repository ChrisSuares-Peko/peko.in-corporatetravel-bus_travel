import React, { useState } from 'react';

import { Flex } from 'antd';

import { useGetFareRules } from '../hooks/useGetFareRules';
import PassengerSelectionPage from '../views/PassengerSelectionPage';
import PriceCardPage from '../views/PriceCardPage';
import SeatSelectionPage from '../views/SeatSelectionPage';

type Props = {
    handleSubmission: (values: any, bookingDetails: any) => void;
};

const AdaptiveAirlineDetail = ({ handleSubmission }: Props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const { fareRules } = useGetFareRules();
    const handleNextClick = () => {
        setCurrentPage(prevPage => (prevPage < 3 ? prevPage + 1 : 1));
    };

    const handlePrevClick = () => {
        setCurrentPage(prevPage => (prevPage > 1 ? prevPage - 1 : prevPage));
    };
    return (
        <Flex vertical className="gap-4">
            {currentPage === 1 && <PriceCardPage handleClick={handleNextClick} />}
            {currentPage === 2 && (
                <PassengerSelectionPage
                    handlePrevClick={handlePrevClick}
                    handleClick={handleNextClick}
                    fareRules={fareRules}
                    handleSubmission={handleSubmission}
                />
            )}

            {currentPage === 3 && (
                <SeatSelectionPage
                    handlePrevClick={handlePrevClick}
                    handleClick={handleNextClick}
                    handleSubmission={handleSubmission}
                />
            )}
        </Flex>
    );
};

export default AdaptiveAirlineDetail;
