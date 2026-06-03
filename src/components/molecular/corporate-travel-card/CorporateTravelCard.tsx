import { Col, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import BusSVG from './assets/icons/bus-card.svg';
import EsimSVG from './assets/icons/esim-card.svg';
import FlightSVG from './assets/icons/airplane-card.svg';
import HotelSVG from './assets/icons/hotel-card.svg';
import VisaSVG from './assets/icons/visa-card.svg';

import './assets/style.css';

type Props = {
    selectedType: string;
    handleChange: (key: string) => void;
};

const TAB_ITEMS = [
    { key: '1', testId: 'flight-svg', src: FlightSVG, label: <>Air <br className="sm:hidden" /> Ticket</> },
    { key: '2', testId: 'hotel-svg', src: HotelSVG, label: <>Hotel Booking</> },
    { key: '3', testId: 'esim-svg', src: EsimSVG, label: <>Travel <br className="sm:hidden" /> eSIM</> },
    { key: '4', testId: 'visa-svg', src: VisaSVG, label: <>Visa</> },
    { key: '5', testId: 'bus-svg', src: BusSVG, label: <>Bus <br className="sm:hidden" /> Ticket</> },
];

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
            <Flex className="xs:ms-4 md:ms-0 sm:me-2 pt-2 flex-wrap" gap={0}>
                {TAB_ITEMS.map(item => (
                    <Flex
                        key={item.key}
                        className={`flex xs:flex-col md:flex-row cursor-pointer justify-between items-center py-4 p-2 w-32 gap-2 ${
                            selectedType === item.key && 'border-red-500 border-b-2'
                        }`}
                        onClick={() => handleChange(item.key)}
                    >
                        <ReactSVG
                            data-testid={item.testId}
                            src={item.src}
                            className={`${selectedType === item.key ? 'selected-svg' : ''} ${item.key === '2' ? 'mb-2' : ''}`}
                        />
                        <Typography.Text
                            className={`text-sm font-medium text-center ${
                                selectedType === item.key && 'text-red-500'
                            }`}
                        >
                            {item.label}
                        </Typography.Text>
                    </Flex>
                ))}
            </Flex>
        </Flex>
    </Col>
);

export default CorporateTravelCard;
