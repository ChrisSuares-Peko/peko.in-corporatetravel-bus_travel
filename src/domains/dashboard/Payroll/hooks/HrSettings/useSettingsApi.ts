import { useCallback, useEffect, useState } from 'react';

import { SuccessGenericResponse } from '@customtypes/general';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import {
    getLeaveSummary,
    leavesummary,
    payrollSetting,
    getPayrollSettings,
    createWPSSetting,
    getWpsSettings,
} from '../../api/hrSettingApi';
import {
    GetPayrollSettingType,
    LeaveSettingsType,
    PayrollSettingFormType,
    WpsSettings,
} from '../../types/HrSetting';

export default function usePayrollApi() {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [payrollData, setPayrollData] = useState<GetPayrollSettingType | undefined>(undefined);
    const [leaveSummmary, setLeaveSummmary] = useState<LeaveSettingsType | undefined>(undefined);
    const [wpsData, setWpsData] = useState<WpsSettings | undefined>(undefined);

    const getPayrollSetting = useCallback(async () => {
        setIsLoading(true);
        const res = await getPayrollSettings({ userId: id, userType: role });
        if (res) {
            setPayrollData(res);
        }
        setIsLoading(false);
    }, [id, role]);

    const postPayrollSetting = async (values: PayrollSettingFormType) => {
        const userDocs = payrollData?.officialDocuments;
        const payload = {
            payrollSettings: {
                organizationWorkingDays: values.organizationWorkingDays,
                salaryCycleDay: values.salaryCycleDay,
                payrollStartsFrom: values.payrollStartsFrom,
                selectedWeekdaysCount: values.selectedWeekdaysCount,
            },
            officialDocuments: {
                hrManagerName: values.hrManagerName,
                establishmentId: values.establishmentId,
                hrManagerSignature: userDocs?.hrManagerSignature
                    ? userDocs.hrManagerSignature
                    : {
                          base64: values.hrManagerSignature,
                          format: values.signatureFormat,
                      },
                companyOfficialStamp: userDocs?.companyOfficialStamp
                    ? userDocs.companyOfficialStamp
                    : {
                          base64: values.companyOfficialStamp,
                          format: values.companyOfficialFormat,
                      },
            },
        };

        const res: GetPayrollSettingType | false = await payrollSetting({
            ...payload,
            userId: id,
            userType: role,
        });
        if (res) {
            setPayrollData(res);
            dispatch(
                showToast({
                    description: 'Payroll settings updated successfully',
                    variant: 'success',
                })
            );
        }
    };

    const handleDeleteDocs = async (docName: string) => {
        setIsLoading(true);
        const { payrollSettings, officialDocuments } = payrollData!;
        console.log('off', officialDocuments);
        const {
            organizationWorkingDays,
            salaryCycleDay,
            payrollStartsFrom,
            selectedWeekdaysCount,
        } = payrollSettings!;
        let hrManagerSignature: string | null = officialDocuments?.hrManagerSignature;
        let companyOfficialStamp: string | null = officialDocuments?.companyOfficialStamp;
        const establishmentId = officialDocuments?.establishmentId;

        if (docName === 'companyOfficialStamp') {
            companyOfficialStamp = null;
        } else if (docName === 'hrManagerSignature') {
            hrManagerSignature = null;
        }
        const payload = {
            payrollSettings: {
                organizationWorkingDays,
                salaryCycleDay,
                payrollStartsFrom,
                selectedWeekdaysCount,
            },
            officialDocuments: {
                hrManagerName: officialDocuments?.hrManagerName,
                hrManagerSignature,
                companyOfficialStamp,
                establishmentId,
            },
        };

        const res: GetPayrollSettingType | false = await payrollSetting({
            ...payload,
            userId: id,
            userType: role,
        });
        if (res) {
            setPayrollData(res);
            dispatch(
                showToast({
                    description: 'File deleted successfully',
                    variant: 'success',
                })
            );
        }
        setIsLoading(false);
    };

    const getLeaveSetting = useCallback(async () => {
        setIsLoading(true);
        const res = await getLeaveSummary({ userId: id, userType: role });
        if (res) {
            setLeaveSummmary(res);
        }
        setIsLoading(false);
    }, [id, role]);

    const leaveSummaryApi = async (payload: LeaveSettingsType) => {
        const resp: LeaveSettingsType | false = await leavesummary({
            ...payload,
            userId: id,
            userType: role,
        });
        if (resp) {
            setLeaveSummmary(resp);
            dispatch(
                showToast({
                    description: 'Leave settings updated successfully',
                    variant: 'success',
                })
            );
        }
    };

    const postWPSSetting = async (payload: WpsSettings) => {
        const res: SuccessGenericResponse<WpsSettings> | false = await createWPSSetting({
            ...payload,
            userId: id,
            userType: role,
        });
        if (res) {
            dispatch(
                showToast({
                    description: res.message,
                    variant: 'success',
                })
            );
        }
    };

    const getWpsSetting = useCallback(async () => {
        setIsLoading(true);
        const res = await getWpsSettings({ userId: id, userType: role });
        if (res) {
            setWpsData(res);
        }
        setIsLoading(false);
    }, [id, role]);

    useEffect(() => {
        getLeaveSetting();
        getPayrollSetting();
        getWpsSetting();
    }, [getPayrollSetting, getLeaveSetting, getWpsSetting]);

    return {
        payrollData,
        postPayrollSetting,
        handleDeleteDocs,
        leaveSummmary,
        leaveSummaryApi,
        postWPSSetting,
        isLoading,
        wpsData,
    };
}
