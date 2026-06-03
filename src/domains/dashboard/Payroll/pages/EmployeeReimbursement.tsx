import React, { useState } from 'react';

import { Button, Col, Flex, Row, Tabs, TabsProps, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';

import useScreenSize from '@src/hooks/useScreenSize';

import ReimbursementTable from '../components/Dashboard/ReimbursementTable';
import ReimbursementTableMobile from '../components/Dashboard/ReimbursementTableMobile';
import ReimbursementModal from '../components/modals/ReimbursementModal';

const EmployeeReimbursement = () => {
    const screen = useScreenSize();
    const [openReimbursementModal, setOpenReimbursementModal] = useState(false);
    const [reloadTable, setReloadTable] = useState(false);
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Reimbursements',
            children: screen.xs ? (
                <ReimbursementTableMobile
                    reloadTable={reloadTable}
                    setReloadTable={setReloadTable}
                />
            ) : (
                <ReimbursementTable reloadTable={reloadTable} setReloadTable={setReloadTable} />
            ),
        },
    ];
    return (
        <Content>
            <Row className="mt-3">
                <Col span={24}>
                    <Flex className="justify-between md:flex-row ">
                        <Typography.Paragraph className=" text-neutral-700 text-xl font-medium">
                            Reimbursements
                        </Typography.Paragraph>

                        <Flex gap={10} className="justify-end">
                            <Button danger onClick={() => setOpenReimbursementModal(true)}>
                                Add Reimbursement
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
            {openReimbursementModal && (
                <ReimbursementModal
                    open={openReimbursementModal}
                    handleCancel={() => setOpenReimbursementModal(false)}
                    reloadTable={setReloadTable}
                />
            )}
        </Content>
    );
};

export default EmployeeReimbursement;
