import { useState, type FC } from 'react';

import { Col, Typography, Flex, Button } from 'antd';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import AncCustomModal from './AncCustomModal';
import BaggagesAddOn from './BaggagesAddOn';
import MealsAddOn from './MealsAddOn';
import SeatAddOn from './SeatAddOn';
import { ancillariesTypes } from '../../enum/ancillaries';
import { setSelectedAncillaries } from '../../slices/airlineSlice';
import { AncillaryRule, AncillaryMeal, AncillarySearch } from '../../types/ancilaryType';

interface PassengerAddonsProps {
    index: number;
    item: any;
}

const PassengerAddons: FC<PassengerAddonsProps> = ({ index, item }) => {
    const { MEAL, SEAT, BAGGAGE } = ancillariesTypes;
    const { Paragraph, Text } = Typography;
    const [isBaggageModalOpen, setIsBaggageModalOpen] = useState(false);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
    const dispatch = useAppDispatch();

    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;

    const { meals, baggages, ancillaryRules, seatMap } = ancillariesData.data[0];

    const isAncillaryRequired = (ancillaries: AncillaryRule[], ancillaryType: string): boolean => {
        const ancType = ancillaryType.toUpperCase();
        // Find the ancillary item that matches the given type
        const ancillary = ancillaries.find(items => items.ancillaryType === ancType);
        // Check if the ancillary exists and its minimum quantity is greater than 0
        return ancillary?.ancillaryQuantity.some(quantity => quantity.min > 0) || false;
    };

    const handleSelectedAnc = (val: AncillaryMeal, ancType: string) => {
        dispatch(
            setSelectedAncillaries({
                ancType,
                ancillaryOfferId: val.ancillary.ancillaryOfferId,
                passengerKey: item.passengerKey,
                segmentKey: val.segmentPassengerMapping.segmentKeys[0],
                itemPrice: val.fare[0].sellingAmount,
            })
        );
    };

    return (
        <Col key={index} span={24}>
            <Paragraph className="text-[1.25rem] font-semibold pb-4">
                {`${item.passengerInfo.givenName}`}
            </Paragraph>
            {seatMap && (
                <Flex key={index + 1} className="w-full my-2" justify="space-between">
                    <Paragraph className="text-lg pb-4">
                        Choose The Seat You Want
                        {isAncillaryRequired(ancillaryRules, SEAT) ? (
                            <Text className="text-brandColor mx-1">(Required)</Text>
                        ) : (
                            <Text className="text-brandColor mx-1">(Optional)</Text>
                        )}
                    </Paragraph>
                    <Button onClick={() => setIsSeatModalOpen(prev => !prev)} danger>
                        Select
                    </Button>
                    {isSeatModalOpen && (
                        <AncCustomModal
                            key={index + 1}
                            handleCancel={() => setIsSeatModalOpen(prev => !prev)}
                            handleOk={() => setIsSeatModalOpen(prev => !prev)}
                            isModalOpen={isSeatModalOpen}
                            customComponents={
                                <SeatAddOn
                                    passengerKey={item.passengerKey} // handleSelectedAnc is handled from inside
                                    passengerPtc={item.ptc}
                                />
                            }
                            title="Select Seats"
                            ancType={SEAT}
                            passengerKey={item.passengerKey}
                        />
                    )}
                </Flex>
            )}

            {meals && (
                <Flex key={index + 2} className="w-full my-2" justify="space-between">
                    <Paragraph className="text-lg pb-4">
                        Add Meal
                        {isAncillaryRequired(ancillaryRules, MEAL) ? (
                            <Text className="text-brandColor mx-1">(Required)</Text>
                        ) : (
                            <Text className="text-brandColor mx-1">(Optional)</Text>
                        )}
                    </Paragraph>
                    <Button onClick={() => setIsMealModalOpen(prev => !prev)} danger>
                        Select
                    </Button>
                    {isMealModalOpen && (
                        <AncCustomModal
                            key={index + 2}
                            handleCancel={() => setIsMealModalOpen(prev => !prev)}
                            handleOk={() => setIsMealModalOpen(prev => !prev)}
                            isModalOpen={isMealModalOpen}
                            customComponents={
                                <MealsAddOn
                                    handleSelectedAnc={handleSelectedAnc}
                                    passengerKey={item.passengerKey}
                                />
                            }
                            title="Select Meals"
                            ancType={MEAL}
                            passengerKey={item.passengerKey}
                        />
                    )}
                </Flex>
            )}

            {baggages && (
                <Flex key={index + 3} className="w-full my-2" justify="space-between">
                    <Paragraph className="text-lg pb-4">
                        Add Extra Luggage
                        {isAncillaryRequired(ancillaryRules, BAGGAGE) ? (
                            <Text className="text-brandColor mx-1">(Required)</Text>
                        ) : (
                            <Text className="text-brandColor mx-1">(Optional)</Text>
                        )}
                    </Paragraph>
                    <Button onClick={() => setIsBaggageModalOpen(prev => !prev)} danger>
                        Select
                    </Button>
                    {isBaggageModalOpen && (
                        <AncCustomModal
                            key={index + 3}
                            handleCancel={() => setIsBaggageModalOpen(prev => !prev)}
                            handleOk={() => setIsBaggageModalOpen(prev => !prev)}
                            isModalOpen={isBaggageModalOpen}
                            customComponents={
                                <BaggagesAddOn
                                    handleSelection={handleSelectedAnc}
                                    passengerKey={item.passengerKey}
                                />
                            }
                            title="Select Luggage"
                            ancType={BAGGAGE}
                            passengerKey={item.passengerKey}
                        />
                    )}
                </Flex>
            )}
        </Col>
    );
};

export default PassengerAddons;
