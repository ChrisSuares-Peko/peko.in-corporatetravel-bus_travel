import React from 'react';

import { CloseOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';

import useHideWidgetOnDrawer from '@components/molecular/freshChat/hooks/useHideWidgetOnDrawer';

interface Props {
    children: React.ReactNode;
    open: boolean;
    handleCancel: () => void;
    modalTitle: string;
    closeIcon?: boolean;
    width?: number;
    footer?: React.ReactNode | null;
}

const DrawerModal = ({
    open,
    handleCancel,
    modalTitle,
    children,
    closeIcon = false,
    width = 470,
    footer = null,
}: Props) => {
    useHideWidgetOnDrawer(open);
    return (
        <Drawer
            title={modalTitle}
            open={open}
            onClose={handleCancel}
            closeIcon={null}
            extra={
                closeIcon && (
                    <CloseOutlined
                        onClick={handleCancel}
                        style={{ fontSize: '16px', color: '#000' }}
                    />
                )
            }
            destroyOnClose
            width={width}
            styles={{
                body: { paddingInline: 20, paddingBlock: 16 },
                header: { paddingInline: 20 },
            }}
            zIndex={20}
            footer={footer || ''}
        >
            {children}
        </Drawer>
    );
};

export default DrawerModal;
