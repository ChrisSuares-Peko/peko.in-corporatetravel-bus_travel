import React from 'react';

import { Radio, Row, Checkbox, Flex } from 'antd';

interface FlightSeatSelectionProps {}

const FlightSeatSelector: React.FC<FlightSeatSelectionProps> = () => {
    const renderSeats = () => {
        const rows: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];
        const cols: number[] = Array.from({ length: 28 }, (_, index) => index);

        return (
            <Flex align="">
                {cols.map((col, rowIndex) => (
                    <Row key={col}>
                        {col !== 0 && <div className="text-center px-2">{col}</div>}
                        {col === 0 && <div className="text-center p-1" />}
                        {rows.map((row, index) => (
                            <React.Fragment key={index}>
                                {rowIndex === 0 && col === 0 ? (
                                    <Flex className="px-1 my-auto">{row}</Flex>
                                ) : (
                                    <Checkbox
                                        key={`${col}${row}`}
                                        value={`${col}${row}`}
                                        className="m-1 p-1 text-center"
                                    />
                                )}
                            </React.Fragment>
                        ))}
                    </Row>
                ))}
            </Flex>
        );
    };

    return <Radio.Group>{renderSeats()}</Radio.Group>;
};

export default FlightSeatSelector;
