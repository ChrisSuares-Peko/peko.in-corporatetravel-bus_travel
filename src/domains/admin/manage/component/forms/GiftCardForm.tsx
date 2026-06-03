import React from 'react';

import { Form, Flex } from 'antd';

import CustomFileUploadInput from '@components/atomic/inputs/CustomFileUploadInput';
import CustomSelectSearch from '@components/atomic/inputs/CustomSelectSearch';
import InputTextArea from '@components/atomic/inputs/InputTextArea';
import MultiTextInput from '@components/atomic/inputs/MultiTextInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { commonSelectType } from '@customtypes/general';

import { priceTypes } from '../../utils/giftCards';

interface GiftCardFormProps {
    selectedVendor: any;
    selectedPriceType: any;
    vendorData: commonSelectType[];
    handleVendorChange: (vendorId: any) => void;
    handlePriceTypeChange: (priceType: any) => void;
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({
    selectedVendor,
    selectedPriceType,
    vendorData,
    handleVendorChange,
    handlePriceTypeChange,
}) => (
    <Flex vertical className="w-full ">
        <Form layout="vertical">
            <TextInput
                name="name"
                label="Gift Card Name"
                type="text"
                placeholder="Enter Gift Card Name"
                isRequired
                classes=" rounded-sm"
                // maxLength={30}
            />
            <CustomSelectSearch
                name="serviceOperatorId"
                label="Vendor"
                placeholder="Select Vendor"
                isRequired
                classes="rounded-sm"
                options={vendorData}
                onChange={handleVendorChange}
            />

            <CustomSelectSearch
                name="priceType"
                label="Price type"
                placeholder="Select Price Type"
                isRequired
                classes="rounded-sm"
                options={priceTypes}
                onChange={handlePriceTypeChange}
            />
            <TextInput
                name="product_id"
                label="Product Id / Sku"
                type="text"
                placeholder="Enter Product Id / Sku"
                isRequired
                classes="rounded-sm"
                maxLength={50}
                allowAlphabetsAndNumbersOnly
            />

            {selectedVendor === 43 && (
                <TextInput
                    name="activation_fee"
                    label="Activation Fee"
                    type="text"
                    classes="rounded-sm"
                    isRequired
                    placeholder="Enter Activation Fee"
                    allowDecimalsOnly
                />
            )}
            {selectedVendor === 35 && (
                <TextInput
                    name="brand_code"
                    label="Brand code"
                    type="text"
                    placeholder="Enter Brand code"
                    isRequired
                    maxLength={30}
                />
            )}

            <SelectInput
                name="currency"
                label="Currency"
                placeholder="Select currency"
                isRequired
                options={[{ label: 'AED', value: 'AED' }]}
            />
            {selectedPriceType === 'FIXED' ? (
                <MultiTextInput
                    name="denominations"
                    label="Denominations"
                    type="text"
                    isRequired
                    placeholder="Enter Denominations"
                    classes="rounded-sm"
                    maxLength={20}
                    allowDecimalsOnly
                />
            ) : (
                <>
                    <TextInput
                        name="minDenomination"
                        label="Min Denomination"
                        placeholder="Enter Min Denomination"
                        type="text"
                        isRequired
                        classes="rounded-sm"
                        maxLength={20}
                        allowDecimalsOnly
                    />
                    <TextInput
                        name="maxDenomination"
                        label="Max Denomination"
                        type="text"
                        isRequired
                        placeholder="Enter Max Denomination"
                        classes="rounded-sm"
                        maxLength={20}
                        allowDecimalsOnly
                    />
                </>
            )}

            <InputTextArea
                name="description"
                label="Description"
                placeholder="Enter Description"
                isRequired
                maxLength={10000}
            />
            <InputTextArea
                name="redemption_instructions"
                label="Redemption instructions"
                placeholder="Enter Redemption instructions"
                isRequired
                maxLength={10000}
            />
            <CustomFileUploadInput
                label="Image"
                name="image"
                format="format"
                showFileName
                showNotification
                fileOutputObject
            />
        </Form>
    </Flex>
);

export default GiftCardForm;
