import React from 'react';

import { Modal, Flex, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

import { paths } from '@src/routes/paths';

import useGetRedirectURL from '../../hooks/useGetRedirectURL';
import { GetRedirectURLRes } from '../../types/types';

type Props = {
    isModalOpen: boolean;
    toggleModal: (key: string) => void;
    redirectType: string;
};

const ConfirmationModal = ({ isModalOpen, toggleModal, redirectType }: Props) => {
    const { handleGetRedirectURL, isLoading } = useGetRedirectURL();
    const navigate = useNavigate();
    const handleConfirm = async () => {
        const res: GetRedirectURLRes | false = await handleGetRedirectURL(redirectType);
        if (res !== false) {
            navigate(paths.insurance.insurance, { state: { url: res.redirectUrl } });
        }
    };
    return (
        <Modal
            title=""
            open={isModalOpen}
            className="flex w-full top-1/2 md:-right-36"
            onOk={() => toggleModal(' ')}
            onCancel={() => toggleModal(' ')}
            footer={
                <Flex className="w-full" justify="end" gap={10}>
                    <Button
                        type="primary"
                        onClick={() => handleConfirm()}
                        loading={isLoading}
                        danger
                    >
                        Confirm
                    </Button>
                    <Button type="default" onClick={() => toggleModal('')}>
                        Cancel
                    </Button>
                </Flex>
            }
            closeIcon={null}
        >
            <Flex vertical align="center">
                <Typography.Text>
                    You are now being re-directed to the online portal of Policy Bazaar.
                </Typography.Text>
                <Typography.Text>
                    The insurance related services are directly provided by Policy Bazaar.
                </Typography.Text>
                <Typography.Text>Please click Confirm to proceed.</Typography.Text>
            </Flex>
        </Modal>
    );
};

export default ConfirmationModal;
