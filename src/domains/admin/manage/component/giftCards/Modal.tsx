import { useState } from 'react';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { commonSelectType } from '@customtypes/general';

import useGiftCardsUpdate from '../../hooks/useGiftCardUpdate';
import { giftCardSchema } from '../../schema/giftCards';
import { GiftCardsBody } from '../../types/giftCards';
import GiftCardForm from '../forms/GiftCardForm';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: GiftCardsBody;
    handleRefresh: () => void;
    vendorData: commonSelectType[];
};

const CreateUpdateModal = ({
    open,
    handleCancel,
    data,
    handleRefresh,
    vendorData,
}: DepartmentModalProps) => {
    const [selectedVendor, setSelectedVendor] = useState(
        data?.serviceOperatorId ? data.serviceOperatorId : null
    );
    const [selectedPriceType, setSelectedPriceType] = useState(
        data?.priceType ? data.priceType : null
    );

    const handleVendorChange = (vendorId: any) => {
        setSelectedVendor(vendorId);
    };
    const handlePriceTypeChange = (priceType: any) => {
        setSelectedPriceType(priceType);
    };
    const { isLoading, handleGiftCardsCreation, updateGiftCardsDetails } = useGiftCardsUpdate();
    return (
        <CustomModalWithForm
            modalTitle="Gift Card Management"
            open={open}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let result;
                if (values.id) {
                    result = await updateGiftCardsDetails(values);
                } else {
                    result = await handleGiftCardsCreation(values);
                }
                if (result) {
                    handleCancel();
                    handleRefresh();
                }
            }}
            initialValues={{
                id: data?.id || '',
                name: data?.name || '',
                serviceOperatorId: data?.serviceOperatorId || '',
                priceType: data?.priceType || '',
                product_id: data?.product_id || '',
                activation_fee: data?.activation_fee || undefined,
                brand_code: data?.brand_code || '',
                currency: data?.currency || '',
                denominations: data?.denominations || '',
                minDenomination: data?.minDenomination || '',
                maxDenomination: data?.maxDenomination || '',
                description: data?.description || '',
                redemption_instructions: data?.redemption_instructions || '',
                image: data?.image || '',
            }}
            validationSchema={giftCardSchema}
        >
            <GiftCardForm
                selectedVendor={selectedVendor}
                selectedPriceType={selectedPriceType}
                vendorData={vendorData}
                handleVendorChange={handleVendorChange}
                handlePriceTypeChange={handlePriceTypeChange}
            />
        </CustomModalWithForm>
    );
};

export default CreateUpdateModal;
