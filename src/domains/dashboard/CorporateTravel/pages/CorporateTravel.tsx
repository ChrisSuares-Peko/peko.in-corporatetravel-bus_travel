import { useEffect } from 'react';

import { Button, Card, Flex, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import clevertap from 'clevertap-web-sdk';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import CorporateTravelCard from '@components/molecular/corporate-travel-card/CorporateTravelCard';
import LandingPageImg from '@domains/dashboard/CorporateTravel/assets/images/LandingPageImg.png';
import CommonIndividualLandingPage from '@domains/dashboard/IndividualPlan/pages/CommonIndividualLandingPage';
import ServiceNotPurchasedPage from '@domains/dashboard/IndividualPlan/pages/ServiceNotPurchased';
import Bookingfields from '@src/domains/dashboard/Hotels/Components/HotelSearch/Bookingfields';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import useServiceAccess from '@src/hooks/useSubscriptionCheck';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import SearchFlight from '../../Airline/components/SearchFlight';
import SearchEsim from '../../esim/components/home/SearchEsim';
import Redirect from '../../esimV2/components/home/Redirect';
import { updateSelectedType } from '../slices/corporateTravel';
import { links } from '../utils/data';
import { corporateTravelFeatures } from '../utils/features';

const CorporateTravel = () => {
    const dispatch = useAppDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const active = params.get('active');
    if (active && (active === '1' || active === '2' || active === '3')) {
        dispatch(updateSelectedType(active));
        const clearActive = () => {
            params.delete('active');
            navigate(`${location.pathname}?${params.toString()}`);
        };
        clearActive();
    }

    const { selectedType } = useAppSelector(state => state.reducer.corporateTravel);
    // const [selectedType, setSelectedType] = useState<string>('1'); // State to track selected tab
    const { airline, hotels, eSim } = accessKeys;
    const isPurchased = useServiceAccess([airline, hotels, eSim]);
    const { user } = useAppSelector(state => state.reducer.user);

    const handleChange = (key: string) => {
        dispatch(updateSelectedType(key));
        // setSelectedType(key);

        // Log event to CleverTap
        let eventName = '';
        switch (key) {
            case '1':
                eventName = 'SearchFlight';
                break;
            case '2':
                eventName = 'Bookingfields';
                break;
            case '3':
                eventName = 'SearchEsim';
                //  navigate(`${location.pathname}/eSIM`);
                // return;
                break;
            default:
                break;
        }
        clevertap.event.push(eventName, {
            Page: 'CorporateTravel',
            Action: `${eventName} clicked`,
        });
    };

    useEffect(() => {
        clevertap.event.push('SearchFlight', {
            Page: 'CorporateTravel',
            Action: 'SearchFlight clicked',
        });
    }, []);

    const renderContent = (key: string) => {
        switch (key) {
            case '1':
                return <SearchFlight />;
            case '2':
                return <Bookingfields />;
            case '3':
                dispatch(updateSelectedType('1'));
                return <Redirect />;
                return <SearchEsim />;
            default:
                return '';
        }
    };

    if (!isPurchased && user?.roleName === 'corporate sub user') {
        return <ServiceNotPurchasedPage />;
    }

    return !isPurchased ? (
        <CommonIndividualLandingPage
            features={corporateTravelFeatures}
            serviceKey={packageAccessKeys['Corporate Travel']}
            // packageName={corporateTravel}
            title="Corporate Travel"
            serviceName="Travel"
            svgIcon={LandingPageImg}
            description="Make business trips easier, save time, and ensure smooth travel arrangements for flights and hotel bookings. Simplify your corporate travel needs effortlessly."
        />
    ) : (
        <Content>
            <Flex vertical className="gap-0 sm:gap-2">
                <Typography.Text className="text-xl font-medium">Corporate Travel</Typography.Text>
                <Typography.Text className="text-sm text-gray-500">
                    Business Travel Simplified
                </Typography.Text>
            </Flex>
            <Flex flex="0 0 auto" className="pt-10 xs:flex md:hidden">
                <Link to={links[Number(selectedType)]}>
                    <Button danger ghost>
                        {selectedType === '3' ? 'Order History' : 'Manage Booking'}
                    </Button>
                </Link>
            </Flex>
            <Flex justify="space-between" className="">
                <CorporateTravelCard handleChange={handleChange} selectedType={selectedType} />
                <Flex flex="0 0 auto" className="pt-10 xs:hidden md:flex">
                    <Link to={links[Number(selectedType)]}>
                        <Button danger ghost>
                            {selectedType === '3' ? 'Order History' : 'Manage Booking'}
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Card
                className="md:border xs:border-none xs:p-0 md:py-9 rounded-b-2xl md:rounded-tr-2xl"
                style={{
                    boxShadow: '0px 1.94px 19.398px 0px rgba(0, 0, 0, 0.10)',
                    // borderRadius: '0 1rem 1rem 1rem',
                }}
            >
                {renderContent(selectedType)}
            </Card>
        </Content>
    );
};

export default CorporateTravel;
