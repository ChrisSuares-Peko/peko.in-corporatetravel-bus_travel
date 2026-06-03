import React from 'react';

import { Card, Flex, Typography, Skeleton, Button } from 'antd';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed and configured

import { paths } from '@src/routes/paths';

import { TaskData } from '../../types/types';

const UpcomingTaskCard = ({ item }: { item: TaskData }) => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleAlertNavigate = () => {
        if (item.type === 'FLEETS' || item.type === 'FLEETS_DOCS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.fleet}`);
        } else if (item.type === 'ASSETS' || item.type === 'ASSETS_DOCS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.assets}`);
        } else if (item.type === 'COMPANY_DOCS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.companyDocuments}`);
        } else if (item.type === 'FINANCIAL_DOCS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.financials}`, {
                state: {
                    tab: '3',
                },
            });
        } else if (item.type === 'OWNERS_DOCS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.ownershipDocuments}`);
        } else if (item.type === 'CHEQUE_LEAVES') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.financials}`, {
                state: {
                    tab: '1',
                },
            });
        } else if (item.type === 'SUBSCRIPTIONS') {
            navigate(`/${paths.pekoCloud.index}/${paths.pekoCloud.subscriptions}`);
        }
    };

    return (
        <Card
            className="xs:border-0 xs:rounded-none xs:bg-slate-100 md:rounded-md md:bg-white md:border"
            bordered
        >
            <Flex vertical gap="middle">
                {item.isLoading ? (
                    <>
                        <Skeleton.Input
                            style={{ width: 200, marginBottom: 8 }}
                            active
                            size="small"
                        />
                        <Skeleton.Input
                            style={{ width: '100%', marginBottom: 8 }}
                            active
                            size="small"
                        />
                        <Skeleton.Input
                            style={{ width: 100, marginBottom: 8 }}
                            active
                            size="small"
                        />
                    </>
                ) : (
                    <Flex vertical>
                        <Flex gap="small" className="p-2" align="center">
                            <Flex className="mt-2" vertical gap="small">
                                <Typography.Text className="text-xs">{item.title}</Typography.Text>
                                <Typography.Text className=" text-textGreen  text-xs">
                                    {item.date}
                                </Typography.Text>
                            </Flex>
                        </Flex>
                        <Flex justify="end">
                            <Button
                                danger
                                type="default"
                                className="text-xs"
                                size="small"
                                onClick={handleAlertNavigate}
                            >
                                Update Now
                            </Button>
                        </Flex>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};

export default UpcomingTaskCard;
