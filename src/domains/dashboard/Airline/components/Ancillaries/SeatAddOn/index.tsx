import { Collapse, Flex } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import SeatMap from './SeatMap';
import { ancillariesTypes } from '../../../enum/ancillaries';
import { AncillarySearch } from '../../../types/ancilaryType';

type Props = {
    passengerKey: string;
    passengerPtc: string;
};
const SeatAddOn = ({ passengerKey, passengerPtc }: Props) => {
    const { SEAT } = ancillariesTypes;
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;

    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );

    const { flightSegments, seatMap } = ancillariesData.data[0];

    const flightSegmentsData = flightSegments.map((item, index) => {
        const label = `${item.departureAirportCode} -> ${item.arrivalAirportCode}`;
        const { segmentKey } = item;
        const selectedAnc = selectedAncillaries.find(
            it =>
                it.ancType === SEAT &&
                it.passengerKey === passengerKey &&
                it.segmentKey === segmentKey
        );

        return {
            key: index,
            label: (
                <Flex justify="space-between">
                    <Flex>{label}</Flex>
                    {selectedAnc?.itemPrice && (
                        <Flex> AED: {formatNumberWithLocalString(selectedAnc?.itemPrice)}</Flex>
                    )}
                </Flex>
            ),
            children:
                seatMap[index]?.cabin[0]?.deck &&
                seatMap[index].cabin[0].deck.map((deck, i) => (
                    <SeatMap
                        index={i}
                        deck={deck}
                        segmentKey={item.segmentKey}
                        passengerPtc={passengerPtc}
                        passengerKey={passengerKey}
                    />
                )),
        };
    });

    return <Collapse expandIconPosition="end" ghost items={flightSegmentsData} />;
};

export default SeatAddOn;
