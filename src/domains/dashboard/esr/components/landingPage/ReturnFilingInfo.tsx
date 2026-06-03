/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';

import {
    CheckCircleFilled,
    CloseOutlined,
    DownloadOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Card, Typography, Row, Col, Button, Flex, Image, Grid } from 'antd';
import { useNavigate } from 'react-router-dom';

import IFrameModal from '@components/molecular/modals/IFrameModal';
import { paths } from '@src/routes/paths';

import AssessmentStep from './AssessmentStep';
import InfoNotes from './InfoNotes';
import downArrowSVG from '../../assets/downArrowFilled.svg';
import rightArrowSVG from '../../assets/rightArrow.svg';
import stage3SVG from '../../assets/stage3.svg';
import useForm from '../../hooks/useForm';
import { FisicalYearData } from '../../types/types';
import { FillingForReturnStepsData } from '../../utils/data';

const { Text } = Typography;
const { useBreakpoint } = Grid;
interface ReturnFilingInfoType {
    yearData: FisicalYearData | undefined;
    dropdownData: string;
}
const ReturnFilingInfo = ({ dropdownData, yearData }: ReturnFilingInfoType) => {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showPreview = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    // Determine if the file is viewable directly
    const isDirectlyViewable =
        yearData?.downloadLink.endsWith('.pdf') ||
        yearData?.downloadLink.endsWith('.jpg') ||
        yearData?.downloadLink.endsWith('.png');

    // Use Google Docs Viewer for other formats
    const viewerUrl = isDirectlyViewable
        ? yearData?.downloadLink
        : `https://docs.google.com/gview?url=${encodeURIComponent(yearData!.downloadLink)}&embedded=true`;

    const { handleSubmission, loader } = useForm();
    const screens = useBreakpoint();
    const height = screens.md ? 35 : 25;
    const width = screens.md ? 35 : 25;
    const navigate = useNavigate();
    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };
    // Helper function to render status-based UI
    const renderStatus = () => {
        const status = yearData ? yearData.status : null;

        if (status === 'Completed') {
            return (
                <Flex gap={25} justify="space-between" align="end" className="w-full">
                    <Flex gap={10} justify="center">
                        <Flex className="self-center align-middle" gap={4}>
                            <CheckCircleFilled className="text-successGreen text-lg" />
                            <Text className="font-medium  text-successGreen">{status}</Text>
                        </Flex>
                        {!isCollapsed && (
                            <Button
                                danger
                                type="primary"
                                className=" font-medium "
                                loading={loader}
                                onClick={() => {
                                    if (yearData)
                                        navigate(paths.esr.view, {
                                            state: {
                                                stageId: yearData.stageId,
                                                fiscalYear: dropdownData,
                                            },
                                        });
                                }}
                            >
                                View Return Filling Status
                            </Button>
                        )}
                    </Flex>
                    {yearData?.downloadLink && (
                        <Button
                            icon={<DownloadOutlined className="text-iconRed text-lg" />}
                            danger
                            type="default"
                            className="font-medium flex align-middle self-center justify-between"
                            download
                            onClick={showPreview}
                        >
                            Download
                        </Button>
                    )}
                </Flex>
            );
        }
        if (status === 'In Progress') {
            return (
                <Flex className="self-start align-middle" gap={10}>
                    {!isCollapsed && (
                        <Button
                            danger
                            type="primary"
                            className=" font-medium "
                            loading={loader}
                            onClick={() => {
                                if (yearData)
                                    navigate(paths.esr.view, {
                                        state: {
                                            stageId: yearData.stageId,
                                            fiscalYear: dropdownData,
                                        },
                                    });
                            }}
                        >
                            View Return Filling Status
                        </Button>
                    )}
                    <Flex className="self-center align-middle" gap={4}>
                        <ExclamationCircleOutlined className="text-textYellow text-lg" />
                        <Text className="font-medium text-textYellow">{status}</Text>
                    </Flex>
                </Flex>
            );
        }
        if (status === 'Resubmit') {
            return (
                <Flex gap={20} className="mt-2">
                    {!isCollapsed && (
                        <Button
                            danger
                            type="primary"
                            className=" font-medium "
                            loading={loader}
                            onClick={() => {
                                if (yearData)
                                    navigate(paths.esr.view, {
                                        state: {
                                            stageId: yearData.stageId,
                                            fiscalYear: dropdownData,
                                        },
                                    });
                            }}
                        >
                            View Return Filling Status
                        </Button>
                    )}
                    <Flex className="self-center align-middle" gap={4}>
                        <CloseOutlined className="text-textRed text-lg" />
                        <Text className="font-medium text-textRed">{status}</Text>
                    </Flex>
                </Flex>
            );
        }

        return null;
    };
    return (
        <Card
            className={`md:mx-20 my-0 md:my-5 border-2 border-gray-150 rounded-xl md:rounded-lg ${
                !isCollapsed ? 'border-l-lightRed border-l-4' : ''
            }`}
        >
            <Flex align="center" className="justify-between">
                <Flex vertical align="center">
                    <Image
                        src={stage3SVG}
                        alt="Stage 3"
                        width={width}
                        height={height}
                        preview={false}
                    />
                    <Text className="my-1 text-stageGrey  font-medium">Stage 3</Text>
                </Flex>
                <Flex vertical align="center">
                    <Image
                        src={isCollapsed ? rightArrowSVG : downArrowSVG}
                        alt={isCollapsed ? 'Expand' : 'Collapse'}
                        onClick={handleCollapse}
                        width={width}
                        height={height}
                        preview={false}
                    />
                    <Text className="my-2 ">&nbsp;</Text>
                </Flex>
            </Flex>
            <Flex vertical>
                <Text className=" text-headBlack text-[15px] md:text-[18px] font-medium">
                    Return Filling
                </Text>
                {!isCollapsed && (
                    <Flex vertical className="p-4">
                        {FillingForReturnStepsData.map((step, index) => (
                            <AssessmentStep key={index} title={step.title} content={step.content} />
                        ))}

                        {!isCollapsed && (
                            <Row className="mt-3" gutter={[20, 20]}>
                                <Col span={24}>
                                    <InfoNotes />
                                </Col>
                                <Col span={24} className="mt-2">
                                    <Flex gap={25}>
                                        {yearData && yearData.isCompleted ? (
                                            renderStatus()
                                        ) : (
                                            <Button
                                                danger
                                                type="primary"
                                                className="font-medium"
                                                onClick={() => {
                                                    if (yearData && yearData.isPaymentCompleted) {
                                                        navigate(paths.esr.registrationAssessment, {
                                                            state: {
                                                                stageId: yearData.stageId,
                                                                fiscalYear: dropdownData,
                                                            },
                                                        });
                                                    } else {
                                                        handleSubmission({
                                                            amount: '2000',
                                                            currentStage: 1,
                                                            currentStep: 1,
                                                            fiscalYear: dropdownData,
                                                            stage: 3,
                                                            stageId: 3,
                                                            stageTitle: 'Filing for Return',
                                                        });
                                                    }
                                                }}
                                                loading={loader}
                                            >
                                                Make Payment
                                            </Button>
                                        )}
                                    </Flex>
                                </Col>
                            </Row>
                        )}
                    </Flex>
                )}
                {isCollapsed && yearData && yearData.isCompleted && renderStatus()}
            </Flex>
            <IFrameModal
                modalTitle="Document Preview"
                videoUrl={viewerUrl!}
                handleCancel={handleCancel}
                open={isModalVisible}
            />
        </Card>
    );
};

export default ReturnFilingInfo;
