import { useState } from 'react';

import { Card, Flex } from 'antd';

import { CloseBtn } from './CloseBtn';
import FlightCard from './FlightCard';
import FlightCardDetails from './FlightCardDetails';

function DetailsBody() {
    const [isFlightDetailsVisible, setIsFlightDetailsVisible] = useState(false);
    return (
        <Flex className="w-full" vertical>
            <Card
                className="border-2"
                size="small"
                style={{
                    borderRadius: '10px',
                    borderBottom: '10px solid #FFF1F0',
                    borderLeft: '1px solid  #FFF1F0',
                    borderRight: '1px solid  #FFF1F0',
                    borderTop: '1px solid  #FFF1F0',
                    background: `linear-gradient(to bottom, #FAFAFA 25%, white 25%)`,
                }}
            >
                <FlightCard />
            </Card>
            <CloseBtn
                isFlightDetailsVisible={isFlightDetailsVisible}
                setIsFlightDetailsVisible={setIsFlightDetailsVisible}
            />

            {isFlightDetailsVisible && (
                <Flex className="mt-5 w-full" vertical>
                    <Card
                        style={{
                            borderRadius: '10px',
                            borderBottom: '10px solid #FFF1F0',
                            borderLeft: '1px solid #FFF1F0',
                            borderRight: '1px solid #FFF1F0',
                            borderTop: '1px solid #FFF1F0',
                            background: `linear-gradient(to bottom, #FAFAFA 25%, white 25%)`,
                        }}
                    >
                        <FlightCardDetails />
                    </Card>
                    <CloseBtn
                        isFlightDetailsVisible={isFlightDetailsVisible}
                        setIsFlightDetailsVisible={setIsFlightDetailsVisible}
                    />
                </Flex>
            )}
        </Flex>
    );
}

export default DetailsBody;
