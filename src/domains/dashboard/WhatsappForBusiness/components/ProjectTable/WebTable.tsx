import React, { useState } from 'react';

import { Table, Button, Tag, Col, Pagination, Tooltip } from 'antd';
import { ReactSVG } from 'react-svg';

import { formattedDateTime } from '@utils/dateFormat';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import BuyCreditModal from './ByCreditModal';
import disabled from '../../assets/images/ProjectTable/disabled.svg';
import pause from '../../assets/images/ProjectTable/pause-circle.svg';
import play from '../../assets/images/ProjectTable/play-circle.svg';
import { useGenerateEmbeddedSignupURL } from '../../hooks/useGenerateEmbeddedSignupURL';
import { useReActivateBillingApi } from '../../hooks/useReActivateBilling';
import { useStopBillingApi } from '../../hooks/useStopBilling';
import { Project } from '../../types/types';

interface WebTableProps {
    projectData: Project[] | undefined;
    isLoading: boolean;
    refreshProjects: () => void;
    count: number | undefined;
    currentPage: number | undefined;
    setPage: (page: number) => void;
}

const WebTable: React.FC<WebTableProps> = ({
    projectData,
    isLoading,
    refreshProjects,
    count,
    currentPage,
    setPage,
}) => {
    const [accountStatusLoading, setAccountStatusLoading] = useState<string | null>(null);

    const { stopBilling, isLoading: isStopping } = useStopBillingApi();
    const { reactivateBilling, isLoading: isReactivating } = useReActivateBillingApi();
    const { generateURL } = useGenerateEmbeddedSignupURL();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const handleStopBilling = async (projectId: string) => {
        await stopBilling(projectId);
        refreshProjects();
    };

    const handleReactivateBilling = async (projectId: string) => {
        await reactivateBilling(projectId);
        refreshProjects();
    };

    const handleBuyCreditClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalVisible(true);
    };

    const handleApplyNowClick = async (projectId: string) => {
        setAccountStatusLoading(projectId);
        try {
            const response = await generateURL(projectId);
            if (response && response.embeddedSignupURL) {
                window.open(response.embeddedSignupURL, '_blank');
            } else {
                console.error('Embedded signup URL is missing.');
            }
        } catch (error) {
            console.error('Error generating URL:', error);
        } finally {
            setAccountStatusLoading(null);
        }
    };
    // Determine if the "Subscription Status" column should be shown
    const isSubscriptionColumnVisible = projectData?.some(project => project.is_whatsapp_verified);

    // Define columns configuration
    const columns = [
        {
            title: 'Created On',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (created_at: string, record: Project) =>
                formattedDateTime(new Date(created_at)),
        },
        {
            title: 'Project Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Project Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusStyle = status === 'active' ? 'green' : 'gold';
                const newStatus = status === 'active' ? 'Active' : 'Paused';
                return (
                    <Tag color={statusStyle} className="rounded-3xl px-4 py-1 text-sm">
                        • {newStatus}
                    </Tag>
                );
            },
        },
        {
            title: 'WCCs',
            dataIndex: 'credit',
            key: 'credit',
            render: (credit: any) => `USD ${formatNumberWithLocalString(credit)}`,
        },
        {
            title: 'WhatsApp Business Account Status',
            key: 'accountStatus',
            render: (text: string, record: Project) =>
                !record.is_whatsapp_verified ? (
                    <Button
                        type="default"
                        danger
                        onClick={() => handleApplyNowClick(record.id)}
                        loading={accountStatusLoading === record.id}
                    >
                        Apply Now
                    </Button>
                ) : (
                    <Tag color="green" className="rounded-3xl px-4 py-1 text-sm">
                        • Completed
                    </Tag>
                ),
        },
        {
            title: 'Buy WCCs',
            key: 'buyCredit',
            render: (text: string, record: Project) => (
                <Button type="default" danger onClick={() => handleBuyCreditClick(record)}>
                    Buy WCCs
                </Button>
            ),
        },
        // Conditionally include the "Subscription Status" column
        ...(isSubscriptionColumnVisible
            ? [
                  {
                      title: 'Subscription Status',
                      dataIndex: 'subscription_status',
                      key: 'subscription_status',
                      render: (subscription_status: string, record: Project) => {
                          if (!record.is_whatsapp_verified) {
                              return (
                                  <Button type="link" disabled>
                                      <ReactSVG src={disabled} className="pt-2" />
                                  </Button>
                              );
                          }

                          const isStoppingOrReactivating = isStopping || isReactivating;
                          const StatusIcon = subscription_status === 'active' ? pause : play;
                          const handleClick =
                              subscription_status === 'active'
                                  ? () => handleStopBilling(record.id)
                                  : () => handleReactivateBilling(record.id);

                          const tooltipMessage =
                              subscription_status === 'active'
                                  ? 'Your current billing status is active. Click here to stop.'
                                  : 'Your current billing status is inactive. Click here to reactivate.';

                          return (
                              <Tooltip title={tooltipMessage}>
                                  <Button
                                      type="link"
                                      disabled={isStoppingOrReactivating}
                                      onClick={handleClick}
                                  >
                                      <ReactSVG src={StatusIcon} className="pt-2" />
                                  </Button>
                              </Tooltip>
                          );
                      },
                  },
              ]
            : []),
    ];

    return (
        <Col>
            <Table
                dataSource={projectData}
                className="mt-10"
                columns={columns}
                loading={isLoading}
                pagination={false}
                rowKey="name"
            />
            <Pagination
                current={currentPage}
                size="default"
                className="text-end pt-7"
                onChange={page => {
                    setPage(page);
                }}
                total={count}
                showSizeChanger={false}
            />
            <BuyCreditModal
                isVisible={isModalVisible}
                project={selectedProject}
                handleCancel={() => setIsModalVisible(false)}
            />
        </Col>
    );
};

export default WebTable;
