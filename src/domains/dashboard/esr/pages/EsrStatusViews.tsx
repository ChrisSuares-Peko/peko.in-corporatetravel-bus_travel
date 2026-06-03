import React, { useState } from 'react';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Skeleton, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

import IFrameModal from '@components/molecular/modals/IFrameModal';
import { paths } from '@src/routes/paths';

import { useGetInfoForStage } from '../hooks/useGetInfoForStage';

const EsrStatusViews = () => {
    const { state } = useLocation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { stageStepData, isLoading } = useGetInfoForStage(state);

    const showPreview = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // Determine if the file is viewable directly
    const isDirectlyViewable =
        stageStepData?.certificate.endsWith('.pdf') ||
        stageStepData?.certificate.endsWith('.jpg') ||
        stageStepData?.certificate.endsWith('.png');

    // Use Google Docs Viewer for other formats
    const viewerUrl = isDirectlyViewable
        ? stageStepData?.certificate
        : `https://docs.google.com/gview?url=${encodeURIComponent(stageStepData?.certificate || '')}&embedded=true`;

    const status = stageStepData?.status || 'unknown'; // Default to 'unknown' if status is undefined
    const navigate = useNavigate();
    const statusColors: Record<string, { background: string; text: string }> = {
        pending: {
            background: '#CCE5FF',
            text: '#0056b3',
        },
        'in progress': {
            background: '#FFFBCC',
            text: '#C89C00',
        },
        completed: {
            background: '#E0FFE0',
            text: '#027A48',
        },
        resubmit: {
            background: '#FFCCCC',
            text: '#CC0000',
        },
    };
    const { background, text } = statusColors[status.toLowerCase()] || {
        background: '#E0E0E0', // default background color
        text: '#000', // default text color
    };
    return isLoading ? (
        <Skeleton />
    ) : (
        <Flex vertical>
            <Typography.Text className="font-semibold text-lg mt-5">
                {stageStepData?.stageTitle}
            </Typography.Text>

            <Row gutter={[20, 20]} className="border-2 border-gray-150 rounded-lg p-10 w-full mt-5">
                <Col xs={8} md={4} xl={4}>
                    <Typography.Text className="text-md font-medium">
                        Date{' '}
                        <Typography.Text className="text-md font-light ms-1">
                            {' '}
                            {stageStepData?.date}
                        </Typography.Text>
                    </Typography.Text>
                </Col>
                <Col xs={8} md={4} xl={3}>
                    <Typography.Text className="text-md font-medium">
                        Fiscal Year{' '}
                        <Typography.Text className="text-md font-light ms-1">
                            {' '}
                            {stageStepData?.fiscalyear}
                        </Typography.Text>
                    </Typography.Text>
                </Col>
                <Col xs={8} md={4} xl={3}>
                    <Typography.Text className="text-md font-medium">
                        Status{' '}
                        <Typography.Text
                            className="text-md font-light ms-1"
                            style={{
                                backgroundColor: background,
                                color: text,
                                padding: '2px 4px',
                                borderRadius: '4px',
                            }} // Apply styles
                        >
                            {stageStepData?.status}
                        </Typography.Text>
                    </Typography.Text>
                </Col>
                <Col xs={24}>
                    <Row gutter={[20, 20]} className="mt-1">
                        <Col xs={24} md={20}>
                            <Flex vertical gap={15}>
                                <Typography.Text className="text-md font-medium">
                                    Agent Remarks
                                </Typography.Text>
                                <Typography.Text className="text-md font-light">
                                    {stageStepData?.remarks}
                                </Typography.Text>
                            </Flex>
                        </Col>
                        <Col xs={24} md={4} className="w-full">
                            <Flex vertical justify="end" className="w-full" gap={10}>
                                <Button
                                    icon={
                                        stageStepData?.certificate && (
                                            <DownloadOutlined className="text-iconRed text-lg" />
                                        )
                                    }
                                    type="default"
                                    disabled={!stageStepData?.certificate}
                                    danger
                                    download
                                    onClick={showPreview}
                                >
                                    Download Certificate
                                </Button>
                                {stageStepData?.stageNo === '1' && (
                                    <Button
                                        type="default"
                                        onClick={() => {
                                            navigate(
                                                `${paths.dashboard.accounting}/${paths.esr.index}/${paths.esr.stageView}`,
                                                {
                                                    state: {
                                                        stageId: stageStepData?.stageNo,
                                                        fiscalYear: stageStepData?.fiscalyear,
                                                    },
                                                }
                                            );
                                        }}
                                        danger
                                    >
                                        View
                                    </Button>
                                )}
                            </Flex>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <IFrameModal
                modalTitle="Document Preview"
                videoUrl={viewerUrl!}
                handleCancel={handleCancel}
                open={isModalVisible}
            />
        </Flex>
    );
};

export default EsrStatusViews;
