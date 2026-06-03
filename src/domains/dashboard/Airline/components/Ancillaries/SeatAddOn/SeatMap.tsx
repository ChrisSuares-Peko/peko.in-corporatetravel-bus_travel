/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, type FC } from 'react';

import { Col, Flex, Radio, Row, Typography } from 'antd';

import exitmarks from '@src/domains/dashboard/Airline/assets/images/exitmarks.png';
import flightfrontandend from '@src/domains/dashboard/Airline/assets/images/flight-frontandend.png';
import flightbody from '@src/domains/dashboard/Airline/assets/images/flightbody.png';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import { ancillariesTypes, passengerTypesPtc } from '../../../enum/ancillaries';
import { setSelectedAncillaries, removeSelectedAncillary } from '../../../slices/airlineSlice';
import { Deck, Seat } from '../../../types/ancilaryType';

interface SeatMapProps {
    index: number;
    passengerKey: string;
    passengerPtc: string;
    segmentKey: string;
    deck: Deck;
}

const SeatMap: FC<SeatMapProps> = ({ deck, passengerKey, segmentKey, index, passengerPtc }) => {
    const { SEAT } = ancillariesTypes;
    const dispatch = useAppDispatch();

    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );

    const handleSelectedAnc = (val: any) => {
        dispatch(
            setSelectedAncillaries({
                ancType: SEAT,
                ancillaryOfferId: val.ancillaryOfferId,
                passengerKey,
                segmentKey: val.segmentKey,
                itemPrice: val.sellingAmount,
            })
        );
    };

    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        const handleCheck = (segmentkey: string) => {
            const result = selectedAncillaries.find(
                item =>
                    item.ancType === SEAT &&
                    item.passengerKey === passengerKey &&
                    item.segmentKey === segmentkey
            );
            if (!result) return null;
            function findAirSeatByAncillaryOfferId(ancillaryOfferId: string) {
                try {
                    // eslint-disable-next-line no-restricted-syntax, no-unsafe-optional-chaining
                    for (const row of deck?.airRow) {
                        const findedSeat = row.airSeats.find(
                            seat => seat.ancillaryOfferId === ancillaryOfferId
                        );
                        if (findedSeat) {
                            return findedSeat;
                        }
                    }
                    return null;
                } catch (error) {
                    return null;
                }
            }
            const foundSeat = findAirSeatByAncillaryOfferId(result.ancillaryOfferId);
            return foundSeat;
        };
        setValue(handleCheck(segmentKey));
    }, [selectedAncillaries, segmentKey]);

    const checkSeatStatus = (seat: Seat) => {
        const { CHILD, INFANT } = passengerTypesPtc;
        const result = selectedAncillaries.find(
            item =>
                item.ancType === SEAT &&
                item.passengerKey !== passengerKey &&
                item.ancillaryOfferId === seat.ancillaryOfferId &&
                item.segmentKey === segmentKey
        );
        if (result) {
            return true;
        }
        try {
            if (
                seat.availability !== 'VAC' ||
                seat.restrictedGeneral === true ||
                seat.noSeat === true
            ) {
                return true;
            }
            if (passengerPtc === CHILD && seat.childAllowed === false) {
                return true;
            }
            if (passengerPtc === INFANT && seat.infantAllowed === false) {
                return true;
            }
            return false;
        } catch (error) {
            return true;
        }
    };
    return (
        <Flex key={index} className="overflow-x-auto sm:w-full hide-scrollbar">
            <Col className="relative w-[89.625rem] h-[29.4375rem] flex flex-row">
                <Flex className="absolute w-[89.625rem] h-[29.4375rem] top-0 left-0">
                    <Flex className="absolute w-[88rem] h-[20.4375rem] top-[1.1875rem] left-[0.6875rem]">
                        <img
                            className="absolute w-[88rem] h-[21.4375rem] top-[2.875rem] left-0"
                            alt="Group"
                            src={flightfrontandend}
                        />
                        <img
                            className="absolute w-[75rem] h-[27.3125rem] top-0 left-[10.0625rem]"
                            alt="Group"
                            src={flightbody}
                        />
                        <Flex className="absolute w-[88rem] h-[15.8125rem] top-[5.5rem] left-[7.5rem]">
                            <Flex vertical className="px-1 my-auto">
                                {deck.airRow[0].airSeats.map((char, ind) => (
                                    <Typography.Text key={ind} className="my-4 text-center">
                                        {String.fromCharCode(65 + ind)}
                                    </Typography.Text>
                                ))}
                            </Flex>
                            <Radio.Group
                                key={index}
                                value={value}
                                onChange={e => {
                                    handleSelectedAnc({
                                        segmentKey,
                                        ancillaryOfferId: e.target.value.ancillaryOfferId,
                                        sellingAmount: e.target.value?.fare[0]?.sellingAmount,
                                    });
                                    setValue(e.target.value);
                                }}
                            >
                                <Row key={index}>
                                    {deck.airRow.map((row, i) => (
                                        <Flex key={i} vertical className="px-0 my-auto">
                                            <Flex className="px-1 my-auto">{i + 1}</Flex>
                                            {row.airSeats.map(seat => (
                                                <Radio
                                                    disabled={checkSeatStatus(seat)}
                                                    key={`${seat.seatCode}${seat.ancillaryOfferId}`}
                                                    value={seat}
                                                    className="p-1 m-1"
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        if (value === seat) {
                                                            dispatch(
                                                                removeSelectedAncillary({
                                                                    ancType: SEAT,
                                                                    segmentKey,
                                                                    passengerKey,
                                                                })
                                                            );
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </Flex>
                                    ))}
                                </Row>
                            </Radio.Group>
                        </Flex>
                        <img
                            className="absolute w-[66.625rem] h-[23.75rem] top-[1.8125rem] left-[12.625rem]"
                            src={exitmarks}
                            alt=""
                        />
                        {/* <ReactSVG
                            className="absolute w-[34px] h-[424px] top-[100px] left-[1272px]"
                            src={backdivider}
                        /> */}
                    </Flex>
                </Flex>
            </Col>
        </Flex>
    );
};

export default SeatMap;
