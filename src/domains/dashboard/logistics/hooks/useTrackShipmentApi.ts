import { useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import { trackShipment } from '../api';
import { ITrackShipmentResponse } from '../types/tracking';

export const useTrackShipmentApi = () => {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [resultData, setResultData] = useState({});
    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(true);

    const handleTrackShipment = useCallback(
        async (trackingNo: string) => {
            setIsLoading(true);
            const response: ITrackShipmentResponse | false = await trackShipment({
                userId: id,
                userType: role,
                trackingNumber: trackingNo,
            });

            if (response && response.TrackingResults.length > 0) {
                const prettyResult = {
                    trackingNo: response.TrackingResults[0].Key ?? 0,
                    trackingResults: response.TrackingResults[0].Value ?? [],
                    orderResponse: response.orderResponse,
                    shipmentStatus: response.shipmentStatus,
                    amount: response.amount,
                };

                setResultData(prettyResult);
                setIsLoading(false);
                return prettyResult;
            }
            if (response && response.NonExistingWaybills.length > 0) {
                dispatch(showToast({ description: 'Invalid tracking number', variant: 'warning' }));
            } else {
                // message.error('Unable to search shipments. Please try again.');
                dispatch(
                    showToast({
                        description: 'Unable to search shipments. Please try again.',
                        variant: 'error',
                    })
                );
            }

            setIsLoading(false);
            return false;
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [id, role]
    ); // Dependencies for useCallback

    return { data: resultData, isLoading, handleTrackShipment };
};
