import React from 'react';

import { Flex, Typography, Row } from 'antd';
import { ReactSVG } from 'react-svg';

import Tick from '@src/assets/svg/tick.svg';

type Props = {
    title: string;
    itemsPerColumn: number;
    items: string[];
    showTicks: boolean;
};

const ReviewLists = ({ title, itemsPerColumn, items, showTicks }: Props) => {
    const renderItems = (start: number, end: number) =>
        items.slice(start, end).map((item, index) => (
            <Flex align="center" key={index}>
                {showTicks && <ReactSVG className="mr-2" src={Tick} />}
                <Typography.Text className="text-sm font-normal">{item}</Typography.Text>
            </Flex>
        ));

    const numColumns = Math.ceil(items.length / itemsPerColumn);
    if (items.length === 0) {
        return '';
    }

    return (
        <Flex
            className="w-full h-full"
            justify="space-between"
            align="flex-start"
            vertical
            gap={20}
        >
            <Flex>
                <Typography.Text className="text-lg font-medium">{title}</Typography.Text>
            </Flex>
            <Row className="gap-16">
                {[...Array(numColumns)].map((_, columnIndex) => (
                    <Flex key={columnIndex} vertical className="gap-5">
                        {renderItems(
                            columnIndex * itemsPerColumn,
                            (columnIndex + 1) * itemsPerColumn
                        )}
                    </Flex>
                ))}
            </Row>
        </Flex>
    );
};

export default ReviewLists;
