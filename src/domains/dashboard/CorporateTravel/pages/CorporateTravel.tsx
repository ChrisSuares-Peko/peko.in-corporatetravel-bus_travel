import { Button, Card, Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CorporateTravelCard from '@components/molecular/corporate-travel-card/CorporateTravelCard';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import SearchFlight from '../../Airline/components/SearchFlight';
import Bookingfields from '../../Hotels/Components/HotelSearch/Bookingfields';
import { updateSelectedType } from '../slices/corporateTravel';
import { links } from '../utils/data';
import VisaSearch from './VisaSearch';

const CorporateTravel = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const active = params.get('active');
    if (active && ['1', '2', '3', '4'].includes(active)) {
        dispatch(updateSelectedType(active));
        params.delete('active');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }

    const { selectedType } = useAppSelector(state => state.reducer.corporateTravel);

    const handleChange = (key: string) => {
        if (key === '5') {
            // Bus Ticket is a full sub-flow at its own route — navigate there directly.
            navigate(`${paths.dashboard.corporateTravel}/${paths.busTicket.index}`);
            return;
        }
        dispatch(updateSelectedType(key));
    };

    const renderContent = (key: string) => {
        switch (key) {
            case '1':
                return <SearchFlight />;
            case '2':
                return <Bookingfields />;
            case '3':
                return <SearchFlight />;
            case '4':
                return <VisaSearch />;
            default:
                return null;
        }
    };

    const manageLabel = selectedType === '3' ? 'Order History' : 'Manage Booking';
    const manageLink = links[Number(selectedType)] || links[1];

    return (
        <Content>
            <Flex vertical className="gap-0 sm:gap-2">
                <Typography.Text className="text-xl font-medium">Corporate Travel</Typography.Text>
                <Typography.Text className="text-sm text-gray-500">
                    Business Travel Simplified
                </Typography.Text>
            </Flex>
            <Flex flex="0 0 auto" className="pt-10 xs:flex md:hidden">
                <Link to={manageLink}>
                    <Button danger ghost>
                        {manageLabel}
                    </Button>
                </Link>
            </Flex>
            <Flex justify="space-between" className="">
                <CorporateTravelCard handleChange={handleChange} selectedType={selectedType} />
                <Flex flex="0 0 auto" className="pt-10 xs:hidden md:flex">
                    <Link to={manageLink}>
                        <Button danger ghost>
                            {manageLabel}
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Card
                className="md:border xs:border-none xs:p-0 md:py-9 rounded-b-2xl md:rounded-tr-2xl"
                style={{ boxShadow: '0px 1.94px 19.398px 0px rgba(0, 0, 0, 0.10)' }}
            >
                {renderContent(selectedType)}
            </Card>
        </Content>
    );
};

export default CorporateTravel;
