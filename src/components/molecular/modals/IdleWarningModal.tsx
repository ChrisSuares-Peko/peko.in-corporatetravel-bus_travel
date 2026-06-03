import React, { useEffect, useState } from 'react';

import { Button, Flex, Modal, Typography } from 'antd';

import { handleLogout } from '@src/services/handleLogout';

interface IdleWarningModalProps {
    isOpen: boolean;
    handleCancel: () => void;
    handleSubmit: () => void;
    isLoading: boolean;
}
const IdleWarningModal = ({
    isOpen,
    handleCancel,
    isLoading,
    handleSubmit,
}: IdleWarningModalProps) => {
    const [counter, setCounter] = useState(60); /// modal timeout seconds
    useEffect(() => {
        let countdown: string | number | NodeJS.Timeout | undefined;
        if (isOpen) {
            countdown = setInterval(() => {
                setCounter(prevCounter => {
                    if (prevCounter <= 1) {
                        clearInterval(countdown);
                        handleLogout();
                        return 0;
                    }
                    return prevCounter - 1;
                });
            }, 1000);
        }
        return () => {
            setCounter(60);
            clearInterval(countdown);
        };
    }, [isOpen]);
    const handleContinue = () => {
        handleCancel();
        setCounter(60); // Reset the counter
    };
    return (
        <Modal
            children={
                <Flex vertical className="">
                    <Typography.Text className="text-lg font-medium">
                        Still with us?
                    </Typography.Text>
                    <Typography.Text className=" mt-3 ">
                        {`We value your privacy, and you've been inactive for a while. We will log you out in the following seconds unless you confirm you're still with us.`}
                    </Typography.Text>
                    <Typography.Text className="text-5xl font-medium my-6">
                        {`${String(Math.floor(counter / 60)).padStart(2, '0')}:${String(counter % 60).padStart(2, '0')}`}
                    </Typography.Text>
                </Flex>
            }
            open={isOpen}
            onCancel={handleCancel}
            closeIcon={null}
            centered
            width={340}
            footer={[
                <Flex className=" w-full mt-8" justify="space-between" gap={10} key="">
                    <Button
                        key="back"
                        type="primary"
                        danger
                        onClick={handleContinue}
                        className=" rounded-sm w-full"
                    >
                        Stay with us
                    </Button>
                    <Button
                        key="submit"
                        loading={isLoading}
                        onClick={async () => {
                            await handleLogout();
                        }}
                        className=" rounded-sm"
                    >
                        Logout
                    </Button>
                </Flex>,
            ]}
        />
    );
};

export default IdleWarningModal;
