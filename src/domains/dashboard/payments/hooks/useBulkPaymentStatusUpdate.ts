/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import Pusher from 'pusher-js';

import { VITE_PUSHER_APPKEY } from '@src/config-global';

import { getBulkPaymentStatusApi } from '../api';
import { BulkPaymentResp, BulkPaymentStatusResp } from '../types';

const useBulkPaymentStatusUpdate = (
    id: number,
    role: string,
    batchId: number,
    bulkPaymentData: BulkPaymentResp[],
    setBulkPaymentData: React.Dispatch<React.SetStateAction<BulkPaymentResp[]>>
) => {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const getBulkPaymentStatus = async (batchId: number) => {
        const unSucceed = bulkPaymentData.filter(v => v.paymentStatus !== 'SUCCESS');
        if (unSucceed.length === 0) return;
        const resp: BulkPaymentStatusResp | false = await getBulkPaymentStatusApi(
            {
                userId: id,
                userType: role,
            },
            batchId
        );
        if (resp) {
            const bulkPaymentStatus = resp?.bulkPaymentStatus;
            if (bulkPaymentStatus && Array.isArray(bulkPaymentStatus)) {
                setBulkPaymentData((prevBulkPaymentData): BulkPaymentResp[] =>
                    prevBulkPaymentData.map((item): BulkPaymentResp => {
                        const updatedItem = bulkPaymentStatus.find(
                            v => v.corporateTxnId === item.corporateTxnId
                        );
                        return updatedItem ? { ...item, paymentStatus: updatedItem.status } : item;
                    })
                );
            }
        }
    };

    useEffect(() => {
        if (batchId) {
            getBulkPaymentStatus(batchId);
        }
        const pusher = new Pusher(VITE_PUSHER_APPKEY, { cluster: 'ap2' });
        const subscribedChannel = pusher.subscribe('update-bulk-payment-status');

        subscribedChannel.bind('real-time-notification', (data: any) => {
            if (data?.credentialId === id) {
                const { corporateTxnId, status } = data.message;
                setBulkPaymentData((prevBulkPaymentData): BulkPaymentResp[] =>
                    prevBulkPaymentData.map(
                        (item): BulkPaymentResp =>
                            item?.corporateTxnId === corporateTxnId
                                ? { ...item, paymentStatus: status }
                                : item
                    )
                );
            }
        });

        return () => {
            subscribedChannel.unbind_all();
            subscribedChannel.unsubscribe();
        };
    }, [batchId]);

    // You may want to add any dependencies here if needed
};

export default useBulkPaymentStatusUpdate;
