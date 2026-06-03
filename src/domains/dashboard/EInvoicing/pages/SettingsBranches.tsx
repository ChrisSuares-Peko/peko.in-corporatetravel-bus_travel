import { useEffect, useState } from 'react';

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Card,
    Col,
    Flex,
    Form,
    Input,
    Modal,
    Row,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
    message,
} from 'antd';

import { eInvoicingApi } from '../api';
import { Branch } from '../types';

const SettingsBranches = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [editing, setEditing] = useState<Branch | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        eInvoicingApi.getProfile().then(p => setBranches(p.branches));
    }, []);

    const openNew = () => {
        form.resetFields();
        setEditing({
            id: '',
            name: '',
            code: '',
            invoicePrefix: 'INV-',
            enabled: true,
            address: {
                buildingNumber: '',
                street: '',
                district: '',
                city: '',
                emirate: '',
                country: 'AE',
            },
        });
    };

    const openEdit = (branch: Branch) => {
        form.setFieldsValue({ ...branch, ...branch.address });
        setEditing(branch);
    };

    const remove = (branch: Branch) => {
        const hasInflight = branch.code === 'DXB';
        if (hasInflight) {
            Modal.confirm({
                title: 'Pending invoices on this branch',
                content: 'Disabling will block new invoices but leave in-flight ones unaffected.',
                okText: 'Disable anyway',
                onOk: () =>
                    setBranches(curr =>
                        curr.map(b => (b.id === branch.id ? { ...b, enabled: false } : b))
                    ),
            });
            return;
        }
        setBranches(curr => curr.filter(b => b.id !== branch.id));
    };

    const save = async () => {
        const values = await form.validateFields();
        const next: Branch = {
            id: editing?.id || `br_${Date.now()}`,
            name: values.name,
            code: values.code,
            invoicePrefix: values.invoicePrefix,
            enabled: editing?.enabled ?? true,
            address: {
                buildingNumber: values.buildingNumber,
                street: values.street,
                district: values.district,
                city: values.city,
                emirate: values.emirate,
                country: 'AE',
            },
        };
        setBranches(curr =>
            editing?.id ? curr.map(b => (b.id === editing.id ? next : b)) : [...curr, next]
        );
        message.success(editing?.id ? 'Branch updated' : 'Branch added');
        setEditing(null);
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Flex justify="space-between" align="center" wrap="wrap">
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Branches
                </Typography.Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={openNew}>
                    Add branch
                </Button>
            </Flex>

            <Card style={{ marginTop: 16 }}>
                <Table
                    rowKey="id"
                    dataSource={branches}
                    pagination={false}
                    columns={[
                        { title: 'Name', dataIndex: 'name' },
                        { title: 'Code', dataIndex: 'code' },
                        { title: 'Prefix', dataIndex: 'invoicePrefix' },
                        {
                            title: 'City',
                            render: (_v, b) => b.address.city,
                        },
                        {
                            title: 'Status',
                            render: (_v, b) =>
                                b.enabled ? <Tag color="green">Active</Tag> : <Tag>Disabled</Tag>,
                        },
                        {
                            title: 'Actions',
                            render: (_v, b) => (
                                <Space>
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => openEdit(b)}
                                    />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => remove(b)}
                                    />
                                    <Switch
                                        checked={b.enabled}
                                        onChange={v =>
                                            setBranches(curr =>
                                                curr.map(x =>
                                                    x.id === b.id ? { ...x, enabled: v } : x
                                                )
                                            )
                                        }
                                    />
                                </Space>
                            ),
                        },
                    ]}
                />
            </Card>

            <Modal
                open={!!editing}
                title={editing?.id ? 'Edit branch' : 'New branch'}
                onCancel={() => setEditing(null)}
                onOk={save}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    <Row gutter={12}>
                        <Col xs={24} md={12}>
                            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                                <Input maxLength={6} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item name="invoicePrefix" label="Invoice prefix" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item name="buildingNumber" label="Building #" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={9}>
                            <Form.Item name="street" label="Street" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={9}>
                            <Form.Item name="district" label="District" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="city" label="City" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12}>
                            <Form.Item name="emirate" label="Emirate" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </div>
    );
};

export default SettingsBranches;
