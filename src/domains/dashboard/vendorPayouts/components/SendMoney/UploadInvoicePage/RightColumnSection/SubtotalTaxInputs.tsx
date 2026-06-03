import React from 'react';

import InputField from '../forms/InputField';

const SubtotalTaxInputs: React.FC<{
    subtotal: string;
    tax: string;
    onSubtotalChange: (value: string) => void;
    onTaxChange: (value: string) => void;
}> = ({ subtotal, tax, onSubtotalChange, onTaxChange }) => (
    <>
        <InputField
            label="Subtotal"
            name="subtotalAmount"
            value={subtotal}
            placeholder="AED  0.0"
            onChange={onSubtotalChange}
        />
        <InputField
            label="Tax (5%)"
            name="taxAmount"
            value={tax}
            placeholder="AED 0.0"
            onChange={onTaxChange}
        />
    </>
);

export default SubtotalTaxInputs;
