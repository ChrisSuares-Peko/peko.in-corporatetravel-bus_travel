import React from 'react';

import { Col, Flex, Grid, Image, Row, Tabs, TabsProps, Typography } from 'antd';
import { useLocation } from 'react-router-dom';

// import BeneficiariesList from '../../components/beneficiary/BeneficiariesList';
import LicenseDetails from '../../components/dubai-police/LicenseDetails';
import PlateTab from '../../components/dubai-police/PlateTab';
import TcNumber from '../../components/dubai-police/TcNumber';
import TicketDetails from '../../components/dubai-police/TicketDetails';
import { useFetchLimitApi } from '../../hooks/useFetchLimitApi';

const DubaiPolice = () => {
    const { state } = useLocation();
    const item = state ? state.item : null;
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { limitData } = useFetchLimitApi('dubaipolice');

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Plate Details',
            children: <PlateTab flexiKey={limitData?.flexiKey} />,
        },
        {
            key: '2',
            label: 'Traffic File Number',
            children: <TcNumber flexiKey={limitData?.flexiKey} />,
        },
        {
            key: '3',
            label: 'License Details',
            children: <LicenseDetails flexiKey={limitData?.flexiKey} />,
        },
        {
            key: '4',
            label: 'Ticket Details',
            children: <TicketDetails flexiKey={limitData?.flexiKey} />,
        },
    ];

    return (
        <Row>
            <Col xl={24} className="w-full xl:sticky xl:top-0 h-fit">
                <Flex align="center" gap={15} className="mb-10">
                    {item && (
                        <Image
                            src={item.icon}
                            alt="icon"
                            preview={false}
                            height={screens.xs ? 40 : 60}
                        />
                    )}
                    <Typography.Text className="text-lg font-medium">
                        {item ? item.title : ''}
                    </Typography.Text>
                </Flex>
                <Tabs defaultActiveKey="1" items={items} />
            </Col>
            {/* <Col xl={9} className="w-full sm:bg-gray-50 rounded-3xl sm:p-6 mt-10 sm:mt-5 xl:mt-0">
                <BeneficiariesList />
            </Col> */}
        </Row>
    );
};

export default DubaiPolice;
