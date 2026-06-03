import React, { useState } from 'react';

import { Steps, Flex, Typography } from 'antd';

import CorporateKYB from './CorporateKYB';
import OwnershipDetails from './OwnershipDetails';
import useGetCountries from '../../hooks/useGetCountries';

const { Text } = Typography;

const Registration = ({ kybData }: any) => {
    const [current, setCurrent] = useState<number>(0);
    const { countryData } = useGetCountries();
    const status = kybData?.status || 'Unknown';
    const remarks = kybData?.remarks || 'No remarks available';

    const getStatusStyles = (kyb: string) => {
        switch (kyb.toLowerCase()) {
            case 'pending':
                return { color: '#AE9C00', backgroundColor: '#FFFCDD' };
            case 're upload':
                return { color: '#D46B08', backgroundColor: '#FFE7C4' };
            case 'completed':
                return { color: '#389E0D', backgroundColor: '#E8F8E5' };
            default:
                return { color: '#000000', backgroundColor: '#E0E0E0' }; // Default style for unknown statuses
        }
    };

    const changeTab = (direction: 'next' | 'prev') => {
        setCurrent(prev => (direction === 'next' ? prev + 1 : prev - 1));
    };

    const steps = [
        {
            title: 'Corporate KYB',
            content: (
                <CorporateKYB changeTab={changeTab} kybData={kybData} countryData={countryData} />
            ),
        },
        {
            title: 'Ownership Details',
            content: (
                <OwnershipDetails
                    changeTab={changeTab}
                    kybData={kybData}
                    countryData={countryData}
                />
            ),
        },
    ];

    const items = steps.map(({ title }) => ({ key: title, title }));

    const statusStyles = getStatusStyles(status);

    return (
        <>
            {kybData?.status !== undefined && (
                <>
                    <Typography.Paragraph className="text-base font-medium">
                        KYB Status
                    </Typography.Paragraph>
                    <div
                        className="w-2/3"
                        style={{
                            padding: '1rem',
                            backgroundColor: '#F6F6F6',
                            borderRadius: '5px',
                            marginBottom: '.75rem',
                        }}
                    >
                        <Flex align="center">
                            <Text className="text-[#717171] font-medium">Status:</Text>
                            <span
                                className="font-normal px-3 py-1 rounded-2xl mx-auto"
                                style={statusStyles}
                            >
                                {status}
                            </span>
                            {kybData?.status === 'RE UPLOAD' && (
                                <>
                                    <Text className="text-[#717171] font-medium">Remarks:</Text>
                                    <Text className="text-[#FF3A3A] mx-auto">{remarks}</Text>
                                </>
                            )}
                        </Flex>
                    </div>
                </>
            )}
            <Steps
                className="text-green-400 mt-[1rem] sm:mt-0 w-[500px]"
                direction="horizontal"
                size="small"
                current={current}
                items={items}
            />

            <Flex vertical>{steps[current].content}</Flex>
        </>
    );
};

export default Registration;
