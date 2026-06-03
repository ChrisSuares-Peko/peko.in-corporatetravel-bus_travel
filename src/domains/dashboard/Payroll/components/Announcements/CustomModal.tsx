import React from 'react';

import { Button, Flex, Modal, Typography } from 'antd';

import ModalDetails from './ModalDetails';
import { IModalData } from '../../types/announcementTypes';

type Props = {
    toggleModal: () => void;
    isModalOpen: boolean;
    modalData: IModalData;
};
const CustomModal = ({ toggleModal, isModalOpen, modalData }: Props) => (
    <Modal
        width={772}
        title="Announcement"
        open={isModalOpen}
        onOk={toggleModal}
        onCancel={toggleModal}
        footer={[
            <Flex className="w-full" justify="flex-end" gap={10} key="">
                <Button
                    key="submit"
                    type="primary"
                    danger
                    onClick={() => {
                        toggleModal();
                    }}
                    className=" rounded-sm"
                >
                    Close
                </Button>
            </Flex>,
        ]}
    >
        <Flex justify="space-between" className="mt-6">
            <Flex>
                <ModalDetails text={modalData && modalData.date} title="Date: " />
            </Flex>
            <Flex>
                <ModalDetails text={modalData && modalData.status} title="Status: " />
            </Flex>
        </Flex>
        <Flex justify="space-between" className="mt-4">
            <Flex>
                <ModalDetails text={modalData && modalData.subject} title="Subject: " />
            </Flex>
        </Flex>
        <Flex justify="space-between" className="mt-6">
            <Flex>
                <Typography.Text className="text-base font-medium"> Details: </Typography.Text>
            </Flex>
        </Flex>
        <Flex>
            <Typography.Text className="text-base">
                {modalData && ` ${modalData.details}`}
            </Typography.Text>
        </Flex>
    </Modal>
);

export default CustomModal;
