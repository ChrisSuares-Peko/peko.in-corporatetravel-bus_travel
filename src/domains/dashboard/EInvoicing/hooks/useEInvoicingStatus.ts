import { useEffect } from 'react';

import { eInvoicingApi } from '../api';
import { setMetrics } from '../slices/eInvoicingSlice';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

// Surfaces the SMB's e-invoicing state plus the live counters used by the
// dashboard tile and overview page. Backed by the mock BFF for now.
export const useEInvoicingStatus = () => {
    const dispatch = useAppDispatch();
    const state = useAppSelector(s => s.reducer.eInvoicing);

    useEffect(() => {
        if (state.status !== 'ACTIVE') return;
        let cancelled = false;
        eInvoicingApi.getMetrics().then(metrics => {
            if (!cancelled) dispatch(setMetrics(metrics));
        });
        return () => {
            cancelled = true;
        };
    }, [state.status, dispatch]);

    return state;
};
