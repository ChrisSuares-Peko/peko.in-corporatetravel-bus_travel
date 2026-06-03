import { useMemo, useState } from 'react';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';
import OtpModal from '@components/molecular/modals/OtpModal';
import { Scope } from '@src/enums/enums';
import { useAppSelector } from '@src/hooks/store';

import CompanyInfoModalWithForm from './modals/CompanyInfoModal';
import { getOtp } from '../api/general';
import useActivities from '../hooks/useActivities';
import useCompanyInfoApi from '../hooks/useCompanyInfoApi';
import { companyInfoSchema } from '../schema';
import { UpdateCompanyInfoRequestPayload } from '../types';

interface CompanyInfoModalProps {
    open: boolean;
    handleCancel: () => void;
}

const CompanyInfoModal = ({ open, handleCancel }: CompanyInfoModalProps) => {
    const { id, role } = useAppSelector(state => state.reducer.auth);
    const { data } = useAppSelector(state => state.reducer.companyInfo);
    const [isOtpSending, setIsOtpSending] = useState(false);
    const { handleUpdateCompanyInfo, isEditLoading } = useCompanyInfoApi({
        handleCancel,
        handleOtpClose: () => setIsOpen(false),
    });
    const { activityList } = useActivities();
    const [formValues, setFormValues] = useState<UpdateCompanyInfoRequestPayload>();
    const [isOpen, setIsOpen] = useState(false);
    useHideWidgetOnDrawer(open);
    const initialValues = useMemo(
        () => ({
            activity: data?.activity ?? '',
            trnNo: data?.trnNo ?? '',
            trnExpiry: data?.trnExpiry ?? '',
            tradeLicenseNo: data?.tradeLicenseNo ?? '',
            tradeLicenseExpiry: data?.tradeLicenseExpiry ?? '',
            tradeLicenseDoc: data?.tradeLicenseDoc ?? '',
            trnCertificate: data?.trnCertificate ?? '',
            eidDoc: data?.eidDoc ?? '',
        }),
        [data]
    );

    return (
        <>
            <CompanyInfoModalWithForm
                modalTitle="Company Information"
                open={open}
                handleCancel={handleCancel}
                validationSchema={companyInfoSchema}
                handleFormSubmit={async values => {
                    setFormValues(values);
                    if (JSON.stringify(initialValues) === JSON.stringify(values))
                        return handleCancel();
                    const resp = await getOtp({
                        userId: id,
                        userType: role,
                    });
                    if (resp) {
                        setIsOpen(true);
                    }
                    return undefined;
                }}
                initialValues={initialValues}
                reinitialise
                activities={activityList!}
            />
            <OtpModal
                isOpen={isOpen}
                isLoading={isEditLoading!}
                handleCancel={() => setIsOpen(false)}
                isOtpSending={isOtpSending}
                onResend={async () => {
                    setIsOtpSending(true);
                    const res = await getOtp({
                        userId: id,
                        userType: role,
                    });
                    if (res) setIsOtpSending(false);
                    else setIsOtpSending(false);
                }}
                handleSubmit={otp => {
                    handleUpdateCompanyInfo({
                        ...formValues!,
                        otp,
                        scope: Scope.EMAIL,
                        userId: id,
                        userType: role,
                    });
                }}
                title="Confirmation"
            />
        </>
    );
};

export default CompanyInfoModal;
