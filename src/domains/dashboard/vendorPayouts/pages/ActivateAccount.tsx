import React from 'react';

import { LoadingOutlined } from '@ant-design/icons';
import { Flex, Spin } from 'antd';

import Registration from '../components/KYBSubmission/Registration';
import { useGetKYBDetailsApi } from '../hooks/useGetKYB';

const ActivateAccountPage: React.FC = () => {
    const { kybData, isLoading } = useGetKYBDetailsApi();
    return isLoading ? (
        <div className="flex items-center justify-center" style={{ height: '70vh' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
    ) : (
        <Flex gap={40} vertical>
            <Registration kybData={kybData} />
        </Flex>
    );
};

export default ActivateAccountPage;
