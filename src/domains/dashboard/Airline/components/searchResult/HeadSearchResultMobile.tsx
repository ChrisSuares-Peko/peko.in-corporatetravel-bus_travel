import { useEffect, useState } from 'react';

import { ArrowRightOutlined } from '@ant-design/icons';
import { Badge, Col, Row, Typography } from 'antd';
import dayjs from 'dayjs';

import { useAppSelector } from '@src/hooks/store';

import useHandleAirlineSearch from '../../hooks/useHandleAirlineSearch';
import { useGetOneWaySearch } from '../../hooks/useSearchOneWayApi';
import { ITripData } from '../../types/airlineTypes';
import { retrieveAirportName } from '../../utils/airlineData';
import { retrieveFlightClass } from '../../utils/getFlightClass';

type props = {
    setFlightResData: any;
    setFlightData: any;
    setIsloading: any;
    setFilterCount: any;
    setProgress: any;
    setNoResult: (result: boolean) => void;
};
function HeadSearchResultMobile({
    setFilterCount,
    setFlightResData,
    setIsloading,
    setFlightData,
    setProgress,
    setNoResult,
}: props) {
    const airlineFormData = useAppSelector(state => state.reducer.airline.formData);
    const airlineSearchData: ITripData = useAppSelector(state => state.reducer.airline.searchData);
    const { isLoading, searchHandler, noResult, filterCount } = useGetOneWaySearch();
    setNoResult(noResult);
    const { handleAirlineSearch } = useHandleAirlineSearch();

    const [tripData, setTripData] = useState<ITripData>({
        tripType: airlineSearchData.tripType,
        fromLocation: airlineSearchData?.fromLocation ?? '',
        toLocation: airlineSearchData?.toLocation ?? '',
        depart: airlineSearchData?.depart ?? '',
        departDay: airlineSearchData?.departDay ?? '',
        arrive: airlineSearchData?.arrive ?? '',
        arriveDay: airlineSearchData?.arriveDay ?? '',
        fromLocation1: airlineSearchData?.fromLocation1 ?? '',
        toLocation1: airlineSearchData?.toLocation1 ?? '',
        depart1: airlineSearchData?.depart1 ?? '',
        departDay1: airlineSearchData?.departDay1 ?? '',
        arrive1: airlineSearchData?.arrive1 ?? '',
        arriveDay1: airlineSearchData?.arriveDay1 ?? '',
        adults: airlineSearchData?.adults ?? '',
        children: airlineSearchData?.children ?? '',
        infants: airlineSearchData?.infants ?? '',
        class: airlineSearchData?.class ?? '',
    });

    const handleSearch = async () => {
        setProgress(0);
        setIsloading(true);
        const search = handleAirlineSearch(tripData);
        if (search.status) {
            const res = await searchHandler(search.data);
            setFlightData(res);
            setFlightResData(res);
        }
    };

    useEffect(() => {
        setIsloading(isLoading);
        setFilterCount({
            lowestPrice: filterCount.lowestPrice === Infinity ? 0 : filterCount.lowestPrice,
            highestPrice: filterCount.highestPrice === -Infinity ? 0 : filterCount.highestPrice,
        });
    }, [filterCount, isLoading, setFilterCount, setIsloading]);

    useEffect(() => {
        handleSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row className="gap-5">
            <Col span={24} className="align-middle justify-between">
                <Col className="pt-3 pb-2 flex flex-col w-full items-start">
                    <Typography.Text className="font-semibold text-base whitespace-nowrap">
                        {airlineFormData.flightSegments[0].departureAirportCode}{' '}
                        <Typography.Text className="font-normal text-sm whitespace-nowrap">
                            {retrieveAirportName(
                                airlineFormData.flightSegments[0].departureAirportCode
                            )}{' '}
                        </Typography.Text>
                        <ArrowRightOutlined className="mx-2" />{' '}
                        {airlineFormData.flightSegments[0].arrivalAirportCode}{' '}
                        <Typography.Text className="font-normal text-sm whitespace-nowrap">
                            {retrieveAirportName(
                                airlineFormData.flightSegments[0].arrivalAirportCode
                            )}{' '}
                        </Typography.Text>
                    </Typography.Text>
                    <Typography.Paragraph className="font-normal text-sm text-gray-400 whitespace-nowrap capitalize">
                        {dayjs(
                            airlineFormData.flightSegments[0].departureDate,
                            'YYYY-MM-DD'
                        ).format('ddd, MMM D')}
                        <Badge dot color="#8F8F8F" className="mx-1" />
                        {airlineFormData.passengerData.adultCount +
                            airlineFormData.passengerData.childCount +
                            airlineFormData.passengerData.infantCount}{' '}
                        traveller
                        <Badge dot color="#8F8F8F" className="mx-1" />
                        {retrieveFlightClass(airlineFormData.flightSegments[0].cabinPreferences[0])}
                    </Typography.Paragraph>
                </Col>
            </Col>
        </Row>
    );
}

export default HeadSearchResultMobile;
