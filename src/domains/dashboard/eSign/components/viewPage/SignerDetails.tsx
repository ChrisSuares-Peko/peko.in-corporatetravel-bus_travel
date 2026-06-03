import React from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Tooltip, Typography } from 'antd';
import { FieldArray } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import { useAppSelector } from '@src/hooks/store';

import SignerDetailsForm from './SignerDetailsForm';
import { SignerDetailsTypes } from '../../types';

type SignerDetailsProps = {
    values: SignerDetailsTypes[];
};

const SignerDetails: React.FC<SignerDetailsProps> = ({ values }) => {
    const { isDisabled } = useAppSelector(state => state.reducer.eSignDoc);
    return (
        <Flex vertical className="w-full mt-5" gap={20}>
            <Flex justify="space-between" align="center" className="w-full">
                {!isDisabled ? (
                    <>
                        <Typography.Text className="xs:text-sm md:text-lg font-medium">
                            Add Signers
                        </Typography.Text>
                        <FieldArray name="signers_info">
                            {({ push }) =>
                                values.length < 10 && (
                                    <Button
                                        danger
                                        disabled={isDisabled}
                                        onClick={() =>
                                            push({
                                                sequence: values.length + 1 || '',
                                                signer_name: '',
                                                signer_email: '',
                                                signer_mobile: '',
                                                page_number: [],
                                                signer_position: [],
                                            })
                                        }
                                    >
                                        Add New Signer
                                    </Button>
                                )
                            }
                        </FieldArray>
                    </>
                ) : (
                    <Flex justify="space-between" align="center" className="w-full">
                        <Typography.Text className="xs:text-sm md:text-lg font-medium">
                            Signers
                        </Typography.Text>
                        {/* <Typography.Text className="text-neutral-400 text-sm font-normal">
                            {signers_info.length} Added
                        </Typography.Text> */}
                    </Flex>
                )}
            </Flex>
            <Flex className="-mb-5">
                <CheckboxInput name="sequentialSignature" disabled={isDisabled}>
                    <Flex align="center" gap={7}>
                        Enable sequential signing
                        <Tooltip
                            title="Signers will receive email invitation only after previous signers have completed the eSign."
                            placement="bottomLeft"
                        >
                            <InfoCircleOutlined className="text-[#A0A0A0]" />
                        </Tooltip>
                    </Flex>
                </CheckboxInput>
            </Flex>
            <FieldArray name="signers_info">
                {({ remove }) => (
                    <>
                        {values.map((_, index) => (
                            <Flex key={index} justify="space-between" align="center">
                                <SignerDetailsForm index={index} removeSigner={remove} />
                            </Flex>
                        ))}
                    </>
                )}
            </FieldArray>
        </Flex>
    );
};

export default SignerDetails;
