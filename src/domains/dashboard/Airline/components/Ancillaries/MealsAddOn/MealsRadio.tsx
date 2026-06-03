/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, type FC } from 'react';

import { Col, Flex, Row, Radio, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import food from '@src/domains/dashboard/Airline/assets/icons/food.svg';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { ancillariesTypes } from '../../../enum/ancillaries';
import { removeSelectedAncillary } from '../../../slices/airlineSlice';
import { AncillaryMeal, AncillarySearch } from '../../../types/ancilaryType';

interface MealsRadioProps {
    index: number;
    passengerKey: string;
    segmentKey: string;
    handleSelectedAnc: (anc: AncillaryMeal, ancilaryType: string) => void;
}

const MealsRadio: FC<MealsRadioProps> = ({
    handleSelectedAnc,
    passengerKey,
    segmentKey,
    index,
}) => {
    const dispatch = useAppDispatch();
    const { MEAL } = ancillariesTypes;
    const ancillariesData: AncillarySearch = useAppSelector(
        state => state.reducer.airline.ancillariesSearch
    ) as AncillarySearch;
    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );
    const { meals } = ancillariesData.data[0];

    const [value, setValue] = useState<any>(null);
    useEffect(() => {
        const handleCheck = (segmentkey: string) => {
            const result = selectedAncillaries.find(
                item =>
                    item.ancType === MEAL &&
                    item.passengerKey === passengerKey &&
                    item.segmentKey === segmentkey
            );
            if (!result) return null;
            const foundItem = meals.find(
                meal => meal.ancillary.ancillaryOfferId === result.ancillaryOfferId
            );
            if (!foundItem) return null;
            return foundItem;
        };
        setValue(handleCheck(segmentKey));
    }, [selectedAncillaries, segmentKey]);

    return (
        <Col span={24} className="flex flex-col items-start justify-start mt-2 ms-2">
            <Flex>
                <ReactSVG src={food} className="" />
                <Typography.Text className="mx-2 text-lg font-medium leading-7 capitalize text-neutral-700">
                    Add a meal
                </Typography.Text>
            </Flex>
            <Typography.Paragraph className="mx-10 text-base font-normal leading-7 capitalize text-neutral-400">
                Meals are usually cheaper when pre-booked
            </Typography.Paragraph>
            <Row className="mt-8" justify="space-between" align="top" gutter={[20, 20]}>
                <Radio.Group
                    key={index}
                    value={value}
                    onChange={e => {
                        handleSelectedAnc(e.target.value, MEAL);
                        setValue(e.target.value);
                    }}
                >
                    {meals.map(
                        meal =>
                            meal.segmentPassengerMapping.segmentKeys[0] === segmentKey && (
                                <Radio.Button
                                    key={
                                        meal.segmentPassengerMapping.passengerKeys +
                                        meal.ancillary.ancillaryOfferId
                                    }
                                    value={meal}
                                    onClick={e => {
                                        e.preventDefault();
                                        if (value === meal) {
                                            dispatch(
                                                removeSelectedAncillary({
                                                    ancType: MEAL,
                                                    segmentKey,
                                                    passengerKey,
                                                })
                                            );
                                        }
                                    }}
                                    className="h-24 mx-2 my-2 text-base font-medium leading-7 capitalize rounded-md text-neutral-400 w-52"
                                >
                                    <Flex
                                        className="p-2"
                                        justify="center"
                                        align="center"
                                        gap={5}
                                        vertical
                                    >
                                        <Flex className="p-0 m-0">
                                            <Typography.Text className="text-base font-medium capitalize text-neutral-400 tex line-clamp-2">
                                                {meal.ancillary.ancillaryDescription}
                                            </Typography.Text>
                                        </Flex>
                                        <Typography.Text className="text-neutral-400 ">
                                            AED{' '}
                                            {formatNumberWithLocalString(meal.fare[0].buyingAmount)}
                                        </Typography.Text>
                                    </Flex>
                                </Radio.Button>
                            )
                    )}
                </Radio.Group>
            </Row>
        </Col>
    );
};

export default MealsRadio;
