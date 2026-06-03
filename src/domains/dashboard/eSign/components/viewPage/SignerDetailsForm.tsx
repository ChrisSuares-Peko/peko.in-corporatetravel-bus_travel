import { useState } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex } from 'antd';
import { ErrorMessage } from 'formik';
import * as Yup from 'yup';

import UAEFlag from '@assets/svg/uaeflag.svg';
import MultiSelectInput from '@components/atomic/inputs/MultiSelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import useScreenSize from '@src/hooks/useScreenSize';

import PageSelectInput from './PageSelectInput';
import ResendButton from './ResendButton';
import StatusBadge from './StatusBadge';
import { useESignDocument } from '../../hooks/useESignDocument';
import { signer_positionOptions } from '../../utils';

interface SignerDetailsFormProps {
    index: number;
    removeSigner: (index: number) => void;
}

const SignerDetailsForm = ({ index, removeSigner }: SignerDetailsFormProps) => {
    const { isDisabled, pageNumbers, signers_info, sequentialSignature } = useAppSelector(
        state => state.reducer.eSignDoc
    );
    const [name, setName] = useState(signers_info[index]?.signer_name);
    const [email, setEmail] = useState(signers_info[index]?.signer_email);
    const { isLoading, resendInvitation } = useESignDocument();
    const { sm } = useScreenSize();
    // Create options dynamically based on pageNumbers
    const options = [{ label: 'All', value: 'all' }];
    if (pageNumbers) {
        // eslint-disable-next-line no-plusplus
        for (let i = 1; i <= pageNumbers; i++) {
            options.push({
                label: i.toString(),
                value: i.toString(),
            });
        }
    }
    const validationSchema = Yup.object().shape({
        signer_name: Yup.string().trim().required('Please enter the signer name'),
        signer_email: Yup.string().email('Invalid email').required('Please enter the signer email'),
    });
    const handleResendInvitation = async (indexNo: number) => {
        try {
            await validationSchema.validate(
                { signer_name: name, signer_email: email },
                { abortEarly: false }
            );
            resendInvitation(indexNo, name, email);
        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                err.errors.forEach(error => {
                    console.log({ error });
                });
            }
        }
    };
    return (
        <Flex className="w-full rounded-[.8rem] border pt-5 px-5 pb-2	border-gray-200">
            <Flex className="w-full  md:gap-1 md:justify-around flex-col md:flex-row">
                <Flex className="flex-col hidden">
                    <TextInput
                        name={`signers_info[${index}].sequence`}
                        placeholder="#"
                        label=" "
                        type="text"
                        classes="w-10"
                        allowNumbersOnly
                        isDisabled
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].sequence`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>
                <Flex justify="center" align="center" className="flex-col ">
                    <Flex>{index + 1}</Flex>
                </Flex>
                <Flex className="flex-col">
                    <TextInput
                        name={`signers_info[${index}].signer_name`}
                        placeholder="Enter Signer Name"
                        label={<Flex className="line-clamp-1">Signer Name </Flex>}
                        type="text"
                        isRequired
                        handleChange={setName}
                        isDisabled={isDisabled && signers_info[index]?.status === 'signed'}
                        allowAlphabetsAndSpaceOnly
                        maxLength={50}
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].signer_name`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`signers_info[${index}].signer_email`}
                        placeholder="Enter Signer Email"
                        label={<Flex className="line-clamp-1">Signer Email </Flex>}
                        type="text"
                        isRequired
                        isDisabled={isDisabled && signers_info[index]?.status === 'signed'}
                        handleChange={setEmail}
                        allowEmailsOnly
                        maxLength={50}
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].signer_email`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <TextInput
                        name={`signers_info[${index}].signer_mobile`}
                        placeholder="Mobile Number  "
                        label={<Flex className="line-clamp-1">Mobile Number</Flex>}
                        type="text"
                        allowNumbersOnly
                        maxLength={10}
                        isDisabled={isDisabled}
                        prefix={
                            <Flex
                                align="center"
                                gap={6}
                                className=" h-full  me-1 cursor-not-allowed"
                            >
                                <img src={UAEFlag} alt="" />
                            </Flex>
                        }
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].signer_mobile`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <PageSelectInput
                        name={`signers_info[${index}].page_number`}
                        placeholder="Select pages"
                        label={<Flex className="line-clamp-1">Page Number To Be Signed </Flex>}
                        options={options}
                        isRequired
                        isDisabled={isDisabled}
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].page_number`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>

                <Flex className="flex-col">
                    <MultiSelectInput
                        name={`signers_info[${index}].signer_position`}
                        placeholder="Select"
                        label={<Flex className="line-clamp-1">Position To Be Signed </Flex>}
                        options={signer_positionOptions}
                        isRequired
                        isDisabled={isDisabled}
                        // maxCount={1}
                    />
                    <ErrorMessage
                        name={`signers_info[${index}].signer_position`}
                        render={msg => (
                            <div className="error-message -mt-6 text-red-500">{msg}</div>
                        )}
                    />
                </Flex>
                {!isDisabled && (
                    <Flex vertical justify="center" align="center">
                        {sm ? (
                            <DeleteOutlined
                                onClick={() => index > 0 && removeSigner(index)}
                                disabled={index === 0}
                                className={`text-xl  pl-3 ${index === 0 ? 'cursor-not-allowed text-gray-400' : 'text-bgOrange2 '}`}
                            />
                        ) : (
                            <Button
                                danger
                                className={`w-full   ${index === 0 ? 'cursor-not-allowed' : ''}`}
                                disabled={index === 0}
                                type="primary"
                                icon={<DeleteOutlined />}
                                onClick={() => index > 0 && removeSigner(index)}
                            >
                                Remove
                            </Button>
                        )}
                    </Flex>
                )}
                {isDisabled && (
                    <Flex vertical justify="" align="center">
                        <Flex className="pb-2">
                            <StatusBadge
                                status={
                                    signers_info[index]?.status === 'signed'
                                        ? 'COMPLETED'
                                        : 'PENDING'
                                }
                            />
                        </Flex>
                        <ResendButton
                            signers_info={signers_info}
                            sequentialSignature={sequentialSignature}
                            index={index}
                            resendInvitation={handleResendInvitation}
                            isLoading={isLoading}
                        />
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

export default SignerDetailsForm;
