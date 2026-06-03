import React from 'react';

import { CommentOutlined } from '@ant-design/icons';
import { Flex, FloatButton, Image, Typography, theme } from 'antd';

import { NafaImg } from '@domains/dashboard/accounting/assets/images';

type Props = {};

const DashFooter = (props: Props) => {
    const {
        token: { colorPrimary },
    } = theme.useToken();
    return (
        <>
            <Typography.Text
                className="fixed text-md font-medium"
                style={{ right: 100, bottom: 57, color: colorPrimary }}
            >
                Talk to Nafa
            </Typography.Text>
            <FloatButton
                shape="circle"
                type="primary"
                style={{ right: 50 }}
                icon={<CommentOutlined />}
            />
            <Flex vertical className="w-full my-5" justify="start">
                <Image preview={false} width={100} src={NafaImg} />
            </Flex>
        </>
    );
};

export default DashFooter;
