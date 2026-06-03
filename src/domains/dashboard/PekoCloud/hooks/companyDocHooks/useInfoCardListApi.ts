import { useState, useCallback, useEffect } from 'react';

import { useAppSelector } from '@src/hooks/store';

import { listAllCompanyDocs } from '../../api/companyDoc';
import { CompanyDocListingResponse } from '../../types/companyDoc';

const initialDocs = [
    'Trade Licenses',
    'MOA & AOA',
    'Immigration Establishment Cards',
    'Ministry of Labour Establishment Cards',
];
export const useGetInfoCardAllDocApi = (reloadTable: boolean) => {
    const initialInfoDetails = {
        totalDocuments: 0,
        activeDocuments: 0,
        expiredDocuments: 0,
        completionLevel: 0,
    };
    const { role, id } = useAppSelector(state => state.reducer.auth);
    const [infoDetails, setInfoDetails] = useState(initialInfoDetails);
    const [docListData, setDocListData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [count, setCount] = useState<number>();
    const getCompanyDocList = useCallback(async () => {
        setIsLoading(true);
        const data: CompanyDocListingResponse | false = await listAllCompanyDocs({
            userId: id,
            userType: role,
        });

        if (data) {
            const arr = data?.result?.map(item => ({
                documentName: item.documentName ?? '',
                documentNumber: item.documentNumber ?? '',
                documentType: item.documentType ?? '',
                issueDate: item?.issueDate ?? '',
                expireDate: item.expireDate ?? '',
                // eslint-disable-next-line no-nested-ternary
                status: item.expireDate
                    ? new Date() > new Date(item.expireDate)
                        ? 'EXPIRED'
                        : 'ACTIVE'
                    : 'ACTIVE',
                actions: '',
                id: item?.id ?? '',
                document: item.document ?? '',
            }));
            const missingDocs = initialDocs.filter(
                docName => !arr.find(item => item.documentName === docName)
            );

            missingDocs.forEach(docName => {
                arr.unshift({
                    documentName: docName,
                    documentNumber: '',
                    documentType: '',
                    issueDate: '',
                    expireDate: '',
                    status: '',
                    actions: '',
                    id: '',
                    document: '',
                });
            });

            const totalDocuments = data.totalData;
            const activeDocuments = arr.filter(item => item.status === 'ACTIVE').length;
            const expiredDocuments = arr.filter(item => item.status === 'EXPIRED').length;
            const completionLevel =
                ((initialDocs.length - missingDocs.length) / initialDocs.length) * 100;

            setInfoDetails({ activeDocuments, completionLevel, expiredDocuments, totalDocuments });
            setCount(data.totalData);
            setDocListData(arr);
        }
        setIsLoading(false);
    }, [id, role]);
    useEffect(() => {
        getCompanyDocList();
    }, [getCompanyDocList, reloadTable]);

    return {
        tableDatas: docListData,
        orderCount: count,
        tableLoading: isLoading,
        infoDetails,
    };
};
