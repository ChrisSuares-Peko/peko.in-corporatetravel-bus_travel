import { Divider } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';

import ServiceTabSelector from '../../components/ServiceTabSelector';

/**
 * Layout wrapper rendered around every Bus Ticket sub-page.
 * Shows the service tab selector with "Bus Ticket" (key '5') always active
 * so users know which service they are in throughout the booking flow.
 * Clicking any other tab navigates back to /corporate-travel.
 */
const BusTicketLayout = () => {
    const navigate = useNavigate();

    const handleTabChange = (key: string) => {
        if (key !== '5') {
            navigate('/corporate-travel');
        }
        // key '5' is already active — clicking it again does nothing
    };

    return (
        <div>
            {/* Service tab bar — Bus Ticket always highlighted */}
            <ServiceTabSelector activeTab="5" onChange={handleTabChange} />

            <Divider className="my-4" style={{ borderColor: '#E8E8E8' }} />

            {/* Bus Ticket sub-page content */}
            <Outlet />
        </div>
    );
};

export default BusTicketLayout;
