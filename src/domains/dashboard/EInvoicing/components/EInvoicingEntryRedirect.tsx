import { Navigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import { useEInvoicingStatus } from '../hooks/useEInvoicingStatus';

// When the SMB lands on `/einvoicing`, route them to the right step based on
// their activation state. Resumes the onboarding wizard mid-flight if PENDING.
const EInvoicingEntryRedirect = () => {
    const { status } = useEInvoicingStatus();
    const base = paths.dashboard.einvoicing;
    if (status === 'INACTIVE') return <Navigate to={`${base}/${paths.einvoicing.activate}`} replace />;
    if (status === 'PENDING')
        return <Navigate to={`${base}/${paths.einvoicing.onboarding}`} replace />;
    return null;
};

export default EInvoicingEntryRedirect;
