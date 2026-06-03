/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, type FC } from 'react';

import { ShoppingOutlined } from '@ant-design/icons';
import { Col, Flex, Row, Radio, Typography } from 'antd';

import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { ancillariesTypes } from '../../../enum/ancillaries';
import { removeSelectedAncillary } from '../../../slices/airlineSlice';
import { AncillaryMeal, AncillarySearch } from '../../../types/ancilaryType';

interface BaggagesRadioProps {
    index: number;
    passengerKey: string;
    segmentKey: string;
    handleSelection: (anc: AncillaryMeal, ancilaryType: string) => void;
}

const BaggagesRadio: FC<BaggagesRadioProps> = ({
    handleSelection,
    passengerKey,
    segmentKey,
    index,
}) => {
    const dispatch = useAppDispatch();
    const { BAGGAGE } = ancillariesTypes;
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;
    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );
    const { baggages } = ancillariesData.data[0];

    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        const handleCheck = (segmentkey: string) => {
            const result = selectedAncillaries.find(
                item =>
                    item.ancType === BAGGAGE &&
                    item.passengerKey === passengerKey &&
                    item.segmentKey === segmentkey
            );
            if (!result) return null;
            const foundItem = baggages.find(
                baggage => baggage.ancillary.ancillaryOfferId === result.ancillaryOfferId
            );
            if (!foundItem) return null;
            return foundItem;
        };
        setValue(handleCheck(segmentKey));
    }, [selectedAncillaries, segmentKey]);

    return (
        <Col span={24} className="mt-2">
            <Flex>
                <ShoppingOutlined className="w-8 h-8 text-2xl" />
                <Typography.Text className="mx-2 text-lg font-medium leading-7 capitalize text-neutral-700">
                    Add extra luggage
                </Typography.Text>
            </Flex>
            <Typography.Paragraph className="mx-10 text-base font-normal leading-7 capitalize text-neutral-400">
                Baggage is 20% cheaper when pre-booked.
            </Typography.Paragraph>
            <Row className="mt-4" gutter={[20, 20]}>
                <Radio.Group
                    value={value}
                    key={index}
                    onChange={e => {
                        handleSelection(e.target.value, BAGGAGE);
                        setValue(e.target.value);
                    }}
                >
                    {baggages.map(
                        (baggage, i) =>
                            baggage.segmentPassengerMapping.segmentKeys[0] === segmentKey && (
                                <Col key={i} className="m-1">
                                    <Row className="p-3 border">
                                        <Flex>
                                            <Radio
                                                value={baggage}
                                                key={
                                                    baggage.segmentPassengerMapping.passengerKeys +
                                                    baggage.ancillary.ancillaryOfferId
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    if (value === baggage) {
                                                        dispatch(
                                                            removeSelectedAncillary({
                                                                ancType: BAGGAGE,
                                                                segmentKey,
                                                                passengerKey,
                                                            })
                                                        );
                                                    }
                                                }}
                                            >
                                                <Typography.Text className="mx-2 text-base font-medium leading-7 capitalize text-neutral-400">
                                                    {baggage.ancillary.ancillaryDescription}
                                                </Typography.Text>
                                            </Radio>
                                        </Flex>
                                        <Typography.Paragraph className="mx-8 text-lg font-medium leading-7 capitalize">
                                            AED{' '}
                                            {formatNumberWithLocalString(
                                                baggage.fare[0].buyingAmount
                                            )}
                                        </Typography.Paragraph>
                                    </Row>
                                </Col>
                            )
                    )}
                </Radio.Group>
            </Row>
        </Col>
    );
};

export default BaggagesRadio;
