import React, { useState } from 'react';

import { Button, Col, Flex, Row, Tabs, TabsProps, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import LeaveModal from '../components/Leaves/LeaveModal';
import LeavesTable from '../components/Leaves/LeavesTable';

const EmployeeLeave = () => {
    const [openLeaveApplicationModal, setOpenLeaveApplicationModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);

    const initialMonth = new Date().getMonth() + 1;
    const initialYear = new Date().getFullYear();
    const [month, setMonth] = useState(initialMonth);
    const [year, setYear] = useState(initialYear);

    const handleChangeMonth = (value: any) => {
        setMonth(value);
        setReloadTable(prev => !prev);
    };

    const handleChangeYear = (value: any) => {
        setYear(value);
        setReloadTable(prev => !prev);
    };
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Leaves',
            children: (
                <LeavesTable
                    reloadTable={reloadTable}
                    setReloadTable={setReloadTable}
                    month={month}
                    year={year}
                    handleChangeMonths={handleChangeMonth}
                    handleChangeYears={handleChangeYear}
                />
            ),
        },
        {
            key: '2',
            label: 'Upcoming leaves',
            disabled: true,
        },
    ];
    return (
        <Content>
            <Row className="mt-3">
                <Col span={24}>
                    <Flex className="justify-between md:flex-row  ">
                        <Typography.Paragraph className=" text-neutral-700 text-xl font-medium">
                            Leaves
                        </Typography.Paragraph>

                        <Flex gap={10} className="justify-end">
                            <Button danger onClick={() => setOpenLeaveApplicationModal(true)}>
                                Add Leave
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
            </Row>
            <Row>
                <Col xs={24} className="mt-5">
                    <Tabs defaultActiveKey="1" items={items} />
                </Col>
            </Row>
            {openLeaveApplicationModal && (
                <LeaveModal
                    month={month}
                    year={year}
                    open={openLeaveApplicationModal}
                    handleCancel={() => setOpenLeaveApplicationModal(false)}
                    reloadTable={setReloadTable}
                />
            )}
        </Content>
    );
};

export default EmployeeLeave;
