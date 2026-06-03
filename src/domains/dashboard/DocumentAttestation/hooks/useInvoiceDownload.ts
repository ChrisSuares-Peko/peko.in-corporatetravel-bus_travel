import { useCallback, useState } from 'react';

import { saveAs } from 'file-saver';

import { useAppSelector } from '@src/hooks/store';

import { downloadInvoice } from '../api';

export const useInvoiceDownload = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const generateInvoice = useCallback(
        async (transactionID: number) => {
            setIsLoading(true);
            const data: any | false = await downloadInvoice({
                userId: id,
                userType: role,
                transactionID,
            });
            if (data) {
                const uint8Array = new Uint8Array(data.pdfBuffer.data);

                const blob = new Blob([uint8Array], { type: 'application/pdf' });

                saveAs(blob, 'Invoice.pdf');
            }
            setIsLoading(false);
        },
        [id, role]
    );

    return { isLoading, generateInvoice };
};
