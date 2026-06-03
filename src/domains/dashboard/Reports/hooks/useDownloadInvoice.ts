import { useState, useCallback } from 'react';

import { saveAs } from 'file-saver';

import { useAppSelector } from '@src/hooks/store';

import { downloadInvoice } from '../api';
import { downloadResponse } from '../types';

export const useDownloadInvoice = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const getInvoiceData = useCallback(
        async (transactionID: number) => {
            setIsLoading(true);
            const data: downloadResponse | false = await downloadInvoice({
                userId: id,
                userType: role,
                transactionID,
            });
            if (data) {
                const uint8Array = new Uint8Array(data.pdfBuffer.data);

                const blob = new Blob([uint8Array], { type: 'application/pdf' });

                saveAs(blob, `Invoice-${transactionID}.pdf`);
            }
            setIsLoading(false);
        },
        [id, role]
    );

    return { loader: isLoading, getInvoiceData };
};
