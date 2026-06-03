import React from 'react';

import { Flex } from 'antd';

import DropDownSelection from '../forms/DropDownSelection';

const BeneficiarySelection: React.FC<{
    beneficiaryOptions: any[];
    onChange: (value: string) => void;
}> = ({ beneficiaryOptions, onChange }) => {
    const handleChange = (value: string) => {
        onChange(value); // Pass the value to the parent component or handle it further
    };

    return (
        <Flex className="w-full grid sm:grid-cols-2 sm:gap-20">
            <Flex className="sm:col-span-1" children={undefined} />
            <Flex className="sm:col-span-1">
                <DropDownSelection
                    title="Select Beneficiary"
                    options={beneficiaryOptions}
                    onChange={handleChange}
                />
            </Flex>
        </Flex>
    );
};

export default BeneficiarySelection;
