import { Button, Flex, Modal } from 'antd';

interface ConfirmationModalProps {
    isOpen: boolean;
    handleCancel: () => void;
    title: string;
    handleSubmit: () => void;
    isLoading: boolean;
}
const ConfirmationModal = ({
    isOpen,
    handleCancel,
    title,
    handleSubmit,
    isLoading,
}: ConfirmationModalProps) => (
    <Modal
        title={
            <Flex gap={16} align="start" className="font-medium mb-5">
                {title}
            </Flex>
        }
        open={isOpen}
        onCancel={handleCancel}
        closeIcon={null}
        centered
        width={400}
        footer={[
            <Flex className=" w-full" justify="flex-end" gap={10} key="">
                <Button key="back" onClick={handleCancel} className=" rounded-sm ">
                    No
                </Button>
                <Button
                    key="submit"
                    type="primary"
                    danger
                    loading={isLoading}
                    onClick={() => {
                        handleSubmit();
                    }}
                    className=" rounded-sm"
                >
                    Yes
                </Button>
            </Flex>,
        ]}
    />
);

export default ConfirmationModal;
