import React from 'react';

import { Col, Row, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import AmenitiesCollapse from './AmenitiesCollapse';
import Ancillaries from './Ancillaries';
import FlightCard from './FlightCard';
import PassengerCard from './PassengerCard';
import ReceiverDetails from './ReceiverDetails';
import useGetCountries from '../hooks/useGetCountries';
import useGetSelectedAirline from '../hooks/useGetSelectedAirline';

type props = {
    isLcc: boolean;
    setIsLcc: (value: boolean) => void;
    formRef: React.MutableRefObject<any>;
    formRef1: React.MutableRefObject<any>;
    showSpinner: any;
    handleSubmission: (values: any, bookingDetails: any) => void;
    fareRules: any;
    isLoading: boolean;
};

const AirlineDetailBody = ({
    formRef,
    formRef1,
    isLcc,
    setIsLcc,
    showSpinner,
    handleSubmission,
    fareRules,
    isLoading,
}: props) => {
    const airlineForm = useAppSelector(state => state.reducer.airline.formData);
    const { adultCount, childCount, infantCount } = airlineForm.passengerData;
    const { Text } = Typography;
    useGetSelectedAirline();
    // const { fareRules, isLoading } = useGetFareRules();
    const { countryData, phoneCodes } = useGetCountries();

    const renderAdultsCard = () =>
        Array.from({ length: adultCount }, (_, index) => (
            <PassengerCard
                formRef={formRef.current[index]}
                passengerType="adult"
                fareRules={fareRules}
                countryData={countryData}
                phoneCodes={phoneCodes}
                cardTitle={`Adult Passenger ${index + 1}`}
                key={index}
            />
        ));

    const renderChildCard = () =>
        Array.from({ length: childCount }, (_, index) => (
            <PassengerCard
                formRef={formRef.current[adultCount + index]}
                passengerType="child"
                fareRules={fareRules}
                countryData={countryData}
                phoneCodes={phoneCodes}
                cardTitle={`Child Passenger ${index + 1}`}
                key={index}
            />
        ));

    const renderInfantCard = () =>
        Array.from({ length: infantCount }, (_, index) => (
            <PassengerCard
                formRef={formRef.current[adultCount + childCount + index]}
                passengerType="infant"
                fareRules={fareRules}
                countryData={countryData}
                phoneCodes={phoneCodes}
                cardTitle={`Infant Passenger ${index + 1}`}
                key={index}
            />
        ));

    return (
        <Col xl={17}>
            {!isLcc && (
                <>
                    <FlightCard />
                    <Row>
                        <Col
                            span={24}
                            className="flex justify-between items-center w-full mt-6 mb-2"
                        >
                            <Text className="text-[1.25rem] font-semibold leading-7 capitalize">
                                {adultCount + childCount + infantCount > 1
                                    ? `Passengers Details`
                                    : `Passenger Details`}{' '}
                            </Text>
                        </Col>
                    </Row>

                    {renderAdultsCard()}
                    {renderChildCard()}
                    {renderInfantCard()}

                    <ReceiverDetails
                        setSpinner={showSpinner}
                        setIsLcc={setIsLcc}
                        passengerCount={adultCount + childCount + infantCount}
                        phoneCodes={phoneCodes}
                        formRef={formRef1}
                        handleSubmission={handleSubmission}
                    />
                    <AmenitiesCollapse />
                </>
            )}

            {isLcc && <Ancillaries />}
        </Col>
    );
};

export default AirlineDetailBody;
