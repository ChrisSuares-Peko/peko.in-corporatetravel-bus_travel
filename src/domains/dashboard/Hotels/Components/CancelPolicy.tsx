import { Divider, Modal, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

interface modalProps {
    isModalOpen: boolean;
    handleCancel: () => void;
    cancellationPolicy: string;
}

const CancelPolicy = ({ isModalOpen, handleCancel, cancellationPolicy }: modalProps) => (
    <Modal
        title="Cancellation Policy Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
    >
        <Divider />
        <Content className="px-4">
            <Typography
                dangerouslySetInnerHTML={{ __html: cancellationPolicy! }}
                className="mt-3 text-justify"
                style={{ lineHeight: '1.5' }}
            />
        </Content>
    </Modal>
);

export default CancelPolicy;
