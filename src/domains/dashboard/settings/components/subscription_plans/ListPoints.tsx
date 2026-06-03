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

const ListPoints = ({ title, itemsPerColumn, items, showTicks }: Props) => {
    const renderItems = (start: number, end: number) =>
        items.slice(start, end).map((item, index) => (
            <Flex align="center" key={index}>
                {showTicks && <ReactSVG className="mr-3" src={Tick} />}
                <Typography.Text className="text-sm font-normal">{item}</Typography.Text>
            </Flex>
        ));

    const numColumns = Math.ceil(items.length / itemsPerColumn);

    return (
        <Flex
            className="w-full h-full p-10 border border-gray-200 border-solid rounded-2xl"
            justify="space-between"
            align="flex-start"
            vertical
            gap={20}
        >
            <Flex>
                <Typography.Title level={5}>{title}</Typography.Title>
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

export default ListPoints;
