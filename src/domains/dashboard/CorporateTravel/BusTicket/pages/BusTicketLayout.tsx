import { Outlet } from 'react-router-dom';

/**
 * Thin layout wrapper around every Bus Ticket sub-page.
 * The service tab selector is intentionally absent here — it only
 * appears on the Corporate Travel landing page (CorporateTravel.tsx).
 */
const BusTicketLayout = () => <Outlet />;

export default BusTicketLayout;
