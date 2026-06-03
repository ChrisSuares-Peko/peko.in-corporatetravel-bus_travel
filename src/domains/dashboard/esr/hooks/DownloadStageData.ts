import { useCallback, useState } from 'react';

import { saveAs } from 'file-saver';

import { useAppSelector } from '@src/hooks/store';

import { downloadStageDetails } from '../api/esr';
import { downloadStageResponse } from '../types';

export default function DownloadStageData() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [isLoading, setIsLoading] = useState(false);

    const getStageDetails = useCallback(
        async (stageId: number, fiscalYear: string) => {
            setIsLoading(true);
            const data: downloadStageResponse | false = await downloadStageDetails({
                userId: id,
                userType: role,
                fiscalYear,
                stageId,
            });
            if (data) {
                const stageData = data as downloadStageResponse;
                const uint8Array = new Uint8Array(stageData.pdfData.data);

                const blob = new Blob([uint8Array], { type: 'application/pdf' });

                saveAs(blob, 'StageData.pdf');
            }
            setIsLoading(false);
        },
        [id, role]
    );

    return { loader: isLoading, getStageDetails };
}
