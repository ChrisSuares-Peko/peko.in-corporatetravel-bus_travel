import { Suspense, lazy, useState } from 'react';

import { Flex, Typography, Button, Skeleton, Image } from 'antd';

import EmptyImage from '@assets/svg/emptyDocs.svg';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import FieldLabelWithButton from './FieldLabelValueWithButton';
import useBankApi from '../hooks/useBankApi';
import { setData } from '../slices/bank';

const BankModal = lazy(() => import('./BankModal'));
const ConfirmationModal = lazy(() => import('@components/molecular/modals/ConfirmationModal'));

const BankAccounts = () => {
    const dispatch = useAppDispatch();
    const { id } = useAppSelector(state => state.reducer.bank);
    const [openBankModal, setOpenBankModal] = useState(false);
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const { tableData, isLoading, isDeleteLoading, handleDeleteBank } = useBankApi({
        handleCancel: () => setOpenConfirmationModal(false),
    });
    return (
        <>
            <Flex
                vertical
                className="h-full sm:border border-solid border-gray-200 p-2 sm:p-6  rounded-xl"
            >
                <Flex className=" w-full" justify="space-between" align="center">
                    <Typography.Title className="line-clamp-1" level={5}>
                        Bank Accounts
                    </Typography.Title>

                    <Button
                        danger
                        size="small"
                        onClick={() => {
                            if (tableData && tableData.length >= 5) {
                                dispatch(
                                    showToast({
                                        description:
                                            'Oops! You’ve reached the maximum limit for adding the bank accounts. Remove one to add a new one.',
                                        variant: 'warning',
                                    })
                                );
                            } else {
                                setOpenBankModal(true);
                                dispatch(setData({ id: 0 }));
                            }
                        }}
                    >
                        Add Account
                    </Button>
                </Flex>
                <Flex
                    vertical
                    className=" mt-8 min-h-72 max-h-[26rem]  sm:min-h-[17rem] sm:max-h-[17rem] overflow-y-scroll"
                    gap={20}
                >
                    {isLoading ? (
                        <Flex className=" w-full">
                            <Skeleton avatar />
                        </Flex>
                    ) : (
                        <>
                            {tableData?.length < 1 ? (
                                <Flex vertical align="center" justify="center" className="mt-8">
                                    <Image src={EmptyImage} preview={false} />
                                    <Typography.Text className="text-base font-normal py-4 text-center text-gray-400 ">
                                        No bank accounts saved
                                    </Typography.Text>
                                </Flex>
                            ) : (
                                tableData?.map(
                                    ({
                                        id: itemId,
                                        bankName,
                                        accountNumber,
                                        default: defaultBank,
                                    }) => (
                                        <FieldLabelWithButton
                                            key={itemId}
                                            label={accountNumber}
                                            value={`${bankName ?? '--'} ${defaultBank ? '(Default)' : ''}`}
                                            id={itemId}
                                            handleEdit={val => {
                                                dispatch(setData({ id: val }));
                                                setOpenBankModal(true);
                                            }}
                                            handleDelete={val => {
                                                dispatch(setData({ id: val }));
                                                setOpenConfirmationModal(true);
                                            }}
                                        />
                                    )
                                )
                            )}
                        </>
                    )}
                </Flex>
            </Flex>
            <Suspense>
                {openBankModal && (
                    <BankModal open={openBankModal} handleCancel={() => setOpenBankModal(false)} />
                )}
                <ConfirmationModal
                    isOpen={openConfirmationModal}
                    handleCancel={() => setOpenConfirmationModal(false)}
                    title="Are you sure you want to delete this bank account?"
                    handleSubmit={() => handleDeleteBank(id!)}
                    isLoading={isDeleteLoading!}
                />
            </Suspense>
        </>
    );
};

export default BankAccounts;
