import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import VendorForm from '../../forms/VendorForm';
import useVendorUpdate from '../../hooks/useVendorUpdate';
import { vendorData } from '../../schema/vendor';
import { Vendor } from '../../types/vendors';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Vendor;
    handleRefresh: () => void;
};

const VendorModal = ({ open, handleCancel, data, handleRefresh }: DepartmentModalProps) => {
    const { isLoading, handleVendorCreation, updateVendorDetails } = useVendorUpdate();

    return (
        <CustomModalWithForm
            modalTitle="Vendor Management"
            open={open}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const emailsArray = values.vendorEmail
                    .split(/[,\s]+/)
                    .filter((email: string) => email.trim() !== '');
                let result;
                if (values.id) {
                    result = await updateVendorDetails({ ...values, vendorEmail: emailsArray });
                } else {
                    result = await handleVendorCreation({
                        ...values,
                        vendorEmail: emailsArray,
                    });
                }
                if (result) {
                    handleCancel();
                    handleRefresh();
                }
            }}
            validationSchema={vendorData}
            initialValues={{
                id: data?.id || '',
                vendorName: data?.vendorName || '',
                type: data?.type || '',
                apiUrl: data?.apiUrl || '',
                healthUrl: data?.healthUrl || '',
                optional1: data?.optional1 || '',
                optional2: data?.optional2 || '',
                optional3: data?.optional3 || '',
                optional4: data?.optional4 || '',
                optional5: data?.optional5 || '',
                optional6: data?.optional6 || '',
                vendorEmail: data?.vendorEmail?.join(',') || '',
            }}
        >
            <VendorForm />
        </CustomModalWithForm>
    );
};

export default VendorModal;
