import React from 'react';

import { Card, Flex, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import FailedIcon from '@domains/dashboard/accounting/assets/icons/failed.svg';
import SuccessIcon from '@domains/dashboard/accounting/assets/icons/success.svg';
import { ActivityData } from '@domains/dashboard/accounting/types/types';

const ActivityLog = ({ success, description }: ActivityData) => (
    <Card
        className="xs:border-0 xs:rounded-none xs:bg-slate-100 md:rounded-lg md:bg-white md:border"
        bordered
    >
        <Flex gap="middle" align="center">
            <Flex
                className="w-20 h-16 md:14 bg-white rounded-full border"
                align="center"
                justify="center"
            >
                <ReactSVG className="fill-white" src={success ? SuccessIcon : FailedIcon} />
            </Flex>
            <Typography.Paragraph className="pr-3">{description}</Typography.Paragraph>
        </Flex>
    </Card>
);

export default ActivityLog;
