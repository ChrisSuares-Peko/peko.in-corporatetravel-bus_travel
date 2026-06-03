import { useCallback, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { DropDown } from '@customtypes/general';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import { getBankList, createSupplierApi, uploadKybDocs, getExistingDocuments } from '../api/kyb';
import {
    BankDetails,
    BankListResponse,
    CorporateDocument,
    CreateSupplierPayload,
    ExistingDocumentsListResponse,
    KybDocumentPayload,
} from '../types/paymentlinkType';

export default function useKybSubmit() {
    const { role, id } = useAppSelector(state => state.reducer.auth);
    // const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(false);
    const [bankList, setBankList] = useState<DropDown>([]);
    const [existingDocumentsList, setExistingDocumentsList] = useState<CorporateDocument | null>(
        null
    );
    const [userBankData, setUserBankData] = useState<null | BankDetails>(null);
    const navigate = useNavigate();

    const handleCollectorCreateSupplier = async (payload: CreateSupplierPayload) => {
        setIsLoading(true);
        const response: {} | false = await createSupplierApi({
            userId: id,
            userType: role,
            ...payload,
        });
        if (response) {
            navigate(paths.invoice.kybDocumentPage, { replace: true });
        }
        setIsLoading(false);
    };

    const handleUploadKybDocs = async (payload: KybDocumentPayload) => {
        setIsLoading(true);
        const response: {} | false = await uploadKybDocs({
            userId: id,
            userType: role,
            ...payload,
        });
        if (response) {
            navigate(`/${paths.invoice.index}/${paths.invoice.kybSuccess}`, { replace: true });
        }
        setIsLoading(false);
    };

    const getFatoorahBankList = useCallback(async () => {
        setIsPageLoading(true);
        const response: BankListResponse | false = await getBankList({
            userId: id,
            userType: role,
        });
        if (response) {
            setBankList(response.bankList);
            setUserBankData(response.bankDetails);
            setIsPageLoading(false);
        }
    }, [id, role]);

    const getExistingDocs = useCallback(async () => {
        setIsPageLoading(true);
        const response: ExistingDocumentsListResponse | false = await getExistingDocuments({
            userId: id,
            userType: role,
        });
        if (response) {
            setExistingDocumentsList(response.corporateDocuments);
            setIsPageLoading(false);
        }
    }, [id, role]);

    useEffect(() => {
        getFatoorahBankList();
        getExistingDocs();
    }, [getFatoorahBankList, getExistingDocs]);

    return {
        handleCollectorCreateSupplier,
        handleUploadKybDocs,
        isLoading,
        existingDocumentsList,
        bankList,
        userBankData,
        isPageLoading,
    };
}
