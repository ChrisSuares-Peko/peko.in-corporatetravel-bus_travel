import { Col, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import FlightSVG from './assets/icons/airplane-card.svg';
import EsimSVG from './assets/icons/esim-card.svg';
import HotelSVG from './assets/icons/hotel-card.svg';

import './assets/style.css';

type Props = {
    selectedType: string;
    handleChange: (key: string) => void;
};

const CorporateTravelCard = ({ selectedType, handleChange }: Props) => (
    <Col
        className="rounded-t-2xl w-fit px-6 m-0 mt-8"
        style={{ boxShadow: '0px 2.248px 18.19px 0px rgba(0, 0, 0, 0.10)' }}
    >
        <Flex
            justify="space-between"
            align="center"
            className="xs:flex-col xs:mx-6 sm:mx-0 sm:flex-row xs:gap-4 sm:gap-4 h-full"
        >
            <Flex className="xs:ms-4 md:ms-0 sm:me-2 pt-2" gap={25}>
                <Flex
                    className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center py-4 p-2 w-32 gap-2 ${selectedType === '1' && 'border-red-500 border-b-2'}`}
                    onClick={() => handleChange('1')}
                >
                    <ReactSVG
                        data-testid="flight-svg"
                        src={FlightSVG}
                        className={`${selectedType === '1' && 'selected-svg'}`}
                    />
                    <Typography.Text
                        className={`text-sm font-medium text-center ${selectedType === '1' && 'text-red-500'}`}
                    >
                        Air <br className="sm:hidden" /> Ticket
                    </Typography.Text>
                </Flex>
                <Flex
                    className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center py-4 p-2 w-34 gap-2 ${selectedType === '2' && 'border-red-500 border-b-2'}`}
                    onClick={() => handleChange('2')}
                >
                    <ReactSVG
                        data-testid="hotel-svg"
                        src={HotelSVG}
                        className={`${selectedType === '2' && 'selected-svg'} mb-2`}
                    />
                    <Typography.Text
                        className={`text-sm font-medium text-center ${selectedType === '2' && 'text-red-500'}`}
                    >
                        Hotel Booking
                    </Typography.Text>
                </Flex>
                <Flex
                    className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center py-4 p-2 w-32 gap-2 ${selectedType === '3' && 'border-red-500 border-b-2'}`}
                    onClick={() => handleChange('3')}
                >
                    <ReactSVG
                        data-testid="esim-svg"
                        src={EsimSVG}
                        className={`${selectedType === '3' && 'selected-svg'}`}
                    />
                    <Typography.Text
                        className={`text-sm font-medium text-center ${selectedType === '3' && 'text-red-500'} `}
                    >
                        Travel <br className="sm:hidden" /> eSIM
                    </Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    </Col>
);

export default CorporateTravelCard;
