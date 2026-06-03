/* eslint-disable no-nested-ternary */
import React, { useState } from 'react';

import { Flex, Typography, Button, Skeleton, Empty, Carousel, Grid } from 'antd';

import { useAppSelector } from '@src/hooks/store';

import BeneficiaryCard from './BeneficiaryCard';
import BeneficiaryModal from './BeneficiaryModal';
import useGetBeneficiary from '../../hooks/beneficiary/useFetchBeneficiary';
import { Beneficiary, BeneficiaryActionType } from '../../types';

const BeneficiariesList = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { tableData, isLoading } = useAppSelector(state => state.reducer.beneficiary);
    const details = useAppSelector(state => state.reducer.billPayment);
    const serviceData = details ? details.vendor : null;
    useGetBeneficiary({ accesskey: serviceData?.accessKey });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [beneficiaryActionType, setBeneficiaryActionType] = useState<BeneficiaryActionType>(
        BeneficiaryActionType.ADD
    );
    const [editBeneficiaryData, setEditBeneficiaryData] = useState<Beneficiary | null>(null);

    const handleEditClick = (beneficiary: Beneficiary) => {
        setEditBeneficiaryData(beneficiary);
        setBeneficiaryActionType(BeneficiaryActionType.EDIT);
        setIsModalOpen(true);
    };
    const handleAddBeneficiary = () => {
        setEditBeneficiaryData(null);
        setBeneficiaryActionType(BeneficiaryActionType.ADD);
        setIsModalOpen(true);
    };

    return (
        <>
            <Flex className="w-full h-9 " justify="space-between" align="center">
                <Typography.Text className="font-medium text-lg  sm:text-lg">
                    Your Beneficiaries
                </Typography.Text>
                <Button
                    danger
                    onClick={handleAddBeneficiary}
                    className="h-full text-xs sm:text-sm sm:px-5"
                >
                    Add Beneficiary
                </Button>
            </Flex>
            <Flex vertical className="mt-7 w-full sm:h-[42rem] pr-3 sm:overflow-x-auto " gap={24}>
                {isLoading ? (
                    [...Array(5)].map((_, index) => <Skeleton key={index} active />)
                ) : tableData && tableData.length > 0 ? (
                    screens.xs ? (
                        <Carousel
                            className="relative"
                            slidesToShow={1}
                            autoplay
                            dots={{ className: 'custom-slick-dots-beneficiary ' }}
                        >
                            {tableData.map((item, index) => (
                                <BeneficiaryCard
                                    key={index}
                                    beneficiary={item}
                                    handleEdit={() => handleEditClick(item)}
                                />
                            ))}
                        </Carousel>
                    ) : (
                        tableData.map((item, index) => (
                            <BeneficiaryCard
                                key={index}
                                beneficiary={item}
                                handleEdit={() => handleEditClick(item)}
                            />
                        ))
                    )
                ) : (
                    <Flex className="h-full" justify="center" align="center">
                        <Empty description="No Beneficiaries Found." className="px-0 sm:px-10" />
                    </Flex>
                )}
            </Flex>
            {isModalOpen && (
                <BeneficiaryModal
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    closeAddModal={() => setIsModalOpen(false)}
                    editValues={editBeneficiaryData}
                    beneficiaryActionType={beneficiaryActionType}
                    setBeneficiaryActionType={setBeneficiaryActionType}
                    accesskeyValue={serviceData?.accessKey}
                />
            )}
        </>
    );
};

export default BeneficiariesList;
