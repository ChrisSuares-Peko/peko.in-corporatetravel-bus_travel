import { Collapse, Flex } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import MealsRadio from './MealsRadio';
import { ancillariesTypes } from '../../../enum/ancillaries';
import { AncillaryMeal, AncillarySearch } from '../../../types/ancilaryType';

type Props = {
    handleSelectedAnc: (ancilary: AncillaryMeal, ancilaryType: string) => void;
    passengerKey: string;
};
// Utility function to find the journey by segmentKey
const findJourneyBySegmentKey = (journeys: any[], segmentKey: string) =>
    journeys.find(journey =>
        journey.flightSegments.some((segment: any) => segment.segmentKey === segmentKey)
    );
const MealsAddOn = ({ handleSelectedAnc, passengerKey }: Props) => {
    const { MEAL } = ancillariesTypes;
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;
    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );
    const { flightSegments, meals } = ancillariesData.data[0];
    const journey = useAppSelector(state => state.reducer.airline.selectedAirline.journey);

    const flightSegmentsData = flightSegments
        .map((item, index) => {
            const { segmentKey } = item;
            const selectedAnc = selectedAncillaries.find(
                it =>
                    it.ancType === MEAL &&
                    it.passengerKey === passengerKey &&
                    it.segmentKey === segmentKey
            );
            const meal = meals.find(m => m?.segmentPassengerMapping?.segmentKeys[0] === segmentKey);

            if (meal) {
                let label = `${item.departureAirportCode} -> ${item.arrivalAirportCode}`;
                if (meal.ancillary.isAncillaryTripWise) {
                    const foundJourney = findJourneyBySegmentKey(journey, segmentKey);
                    if (foundJourney?.flight?.segmentReference) {
                        const { onPoint, offPoint } = foundJourney.flight.segmentReference;
                        label = `${onPoint} -> ${offPoint}`;
                    }
                }
                return {
                    key: index,
                    label: (
                        <Flex justify="space-between">
                            <Flex>{label}</Flex>
                            {selectedAnc?.itemPrice && (
                                <Flex>
                                    {' '}
                                    AED: {formatNumberWithLocalString(selectedAnc?.itemPrice)}
                                </Flex>
                            )}
                        </Flex>
                    ),
                    children: (
                        <MealsRadio
                            index={index}
                            segmentKey={segmentKey}
                            passengerKey={passengerKey}
                            handleSelectedAnc={handleSelectedAnc}
                        />
                    ),
                };
            }
            return { key: index, label: ``, children: false };
        })
        .filter(item => item.children !== false);

    return <Collapse expandIconPosition="end" ghost items={flightSegmentsData} />;
};

export default MealsAddOn;
