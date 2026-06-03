import React from 'react';

import { Flex, Typography } from 'antd';
import { capitalize } from 'lodash';

import ReviewLists from './ReviewLists';
import { PackageDetailsResponse, SelectedType } from '../types';

type Props = {
    data: PackageDetailsResponse;
    services: string[];
    selectedType: SelectedType;
};

const ReviewPackageDetails = ({ data, services, selectedType }: Props) => {
    const { Text } = Typography;
    const benefits = data?.packageDetails.description.split('\n');
    return (
        <Flex
            className="w-full h-full px-10 py-8 text-xs border border-gray-200 border-solid lg:w-4/6 rounded-xl"
            justify="space-between"
            align="flex-start"
            vertical
            gap={24}
        >
            <Flex justify="center" align="center">
                <Text className="text-lg font-medium">
                    {Array.isArray(services) && services?.length > 0 ? (
                        <Typography.Text className="space-x-1 text-lg">
                            {data?.packageDetails.packageName}{' '}
                        </Typography.Text>
                    ) : (
                        `${data?.packageDetails.packageName} ${capitalize(selectedType)}`
                    )}
                </Text>
            </Flex>
            {Array.isArray(services) && services?.length > 0 && (
                <ReviewLists
                    items={services}
                    itemsPerColumn={Math.ceil(services.length / 2)}
                    showTicks
                    title="Services"
                />
            )}
            {Array.isArray(benefits) && benefits?.length > 0 && (
                <ReviewLists
                    items={benefits}
                    itemsPerColumn={Math.ceil(benefits.length / 2)}
                    title="Features"
                    showTicks={false}
                />
            )}
        </Flex>
    );
};

export default ReviewPackageDetails;
