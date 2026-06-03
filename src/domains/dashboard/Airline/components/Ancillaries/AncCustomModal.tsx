import React from 'react';

import { Button, Flex, Modal, Typography } from 'antd';

import { useAppSelector } from '@src/hooks/store';
import { formatNumberWithLocalString } from '@utils/priceFormat';

const { Text } = Typography;
type Props = {
    customComponents: React.ReactNode;
    isModalOpen: any;
    handleOk: any;
    handleCancel: any;
    title?: string;
    passengerKey: string;
    ancType: string;
};

const AncCustomModal = ({
    customComponents,
    isModalOpen,
    handleOk,
    handleCancel,
    title,
    ancType,
    passengerKey,
}: Props) => {
    const selectedAncillaries = useAppSelector(
        state => state.reducer.airline.selectedAncillaries.selectedAncillaries
    );

    const totalPrice = selectedAncillaries
        .filter(anc => anc.ancType === ancType && anc.passengerKey === passengerKey) // Filter for meals
        .reduce((total, anc) => total + anc.itemPrice, 0); // Sum the prices

    return (
        <Modal
            title={title || 'Basic Modal'}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
            footer={[
                <Flex className=" w-full" justify="flex-end" gap={10} key="">
                    {/* <Button key="back" onClick={handleCancel} className=" rounded-sm ">
                        Cancel
                    </Button> */}
                    <Button
                        key="submit"
                        type="primary"
                        danger
                        onClick={handleOk}
                        className=" rounded-sm"
                    >
                        Submit
                    </Button>
                </Flex>,
            ]}
        >
            <Flex vertical gap={20} className="mb-8 mt-6">
                {customComponents}

                <Flex justify="space-between" className="px-[1rem] py-[12px]">
                    <Text className="text-[1rem]  text-zinc-900 font-semibold">Total</Text>
                    <Text className="text-[1rem]  text-zinc-900 font-semibold me-4">
                        AED: {formatNumberWithLocalString(totalPrice)}
                    </Text>
                </Flex>
            </Flex>
        </Modal>
    );
};

export default AncCustomModal;
