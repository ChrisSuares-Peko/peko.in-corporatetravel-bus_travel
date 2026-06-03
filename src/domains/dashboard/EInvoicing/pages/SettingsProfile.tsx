import { useEffect, useState } from 'react';

import { Button, Card, Col, Descriptions, Flex, Form, Input, Row, Select, Typography, message } from 'antd';

import { eInvoicingApi } from '../api';
import TrnInput from '../components/TrnInput';
import { BusinessProfile } from '../types';

const SettingsProfile = () => {
    const [profile, setProfile] = useState<BusinessProfile | null>(null);
    const [editing, setEditing] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        eInvoicingApi.getProfile().then(setProfile);
    }, []);

    if (!profile) return null;

    const startEdit = () => {
        form.setFieldsValue({
            ...profile.address,
            invoiceFormat: profile.defaults.invoiceNumberFormat,
            currency: profile.defaults.currency,
            iban: profile.bank.iban,
            swift: profile.bank.swift,
        });
        setEditing(true);
    };

    const save = async () => {
        await form.validateFields();
        message.success('Profile updated');
        setEditing(false);
    };

    return (
        <div style={{ padding: '24px 0' }}>
            <Flex justify="space-between" align="center" wrap="wrap">
                <Typography.Title level={3} style={{ margin: 0 }}>
                    Business profile
                </Typography.Title>
                {!editing ? (
                    <Button onClick={startEdit}>Edit</Button>
                ) : (
                    <Flex gap={8}>
                        <Button onClick={() => setEditing(false)}>Cancel</Button>
                        <Button type="primary" onClick={save}>
                            Save
                        </Button>
                    </Flex>
                )}
            </Flex>

            <Card title="Locked details" style={{ marginTop: 16 }}>
                <Typography.Paragraph type="secondary">
                    These can't be changed online — contact Peko Ops to update.
                </Typography.Paragraph>
                <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                    <Descriptions.Item label="Legal name">
                        {profile.legalName}
                    </Descriptions.Item>
                    <Descriptions.Item label="TRN">
                        <TrnInput value={profile.trn} disabled />
                    </Descriptions.Item>
                    <Descriptions.Item label="Activity code">{profile.activityCode}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Editable details" style={{ marginTop: 16 }}>
                {!editing ? (
                    <Descriptions column={{ xs: 1, md: 2 }} bordered size="small">
                        <Descriptions.Item label="Address" span={2}>
                            {[
                                profile.address.buildingNumber,
                                profile.address.street,
                                profile.address.district,
                                profile.address.city,
                                profile.address.emirate,
                            ]
                                .filter(Boolean)
                                .join(', ')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Default currency">
                            {profile.defaults.currency}
                        </Descriptions.Item>
                        <Descriptions.Item label="Invoice number format">
                            {profile.defaults.invoiceNumberFormat}
                        </Descriptions.Item>
                        <Descriptions.Item label="IBAN">{profile.bank.iban ?? '—'}</Descriptions.Item>
                        <Descriptions.Item label="SWIFT">{profile.bank.swift ?? '—'}</Descriptions.Item>
                    </Descriptions>
                ) : (
                    <Form form={form} layout="vertical">
                        <Row gutter={16}>
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
                            <Col xs={24} md={8}>
                                <Form.Item name="city" label="City" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="emirate" label="Emirate" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="postalCode" label="Postal code">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="invoiceFormat" label="Invoice number format">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="currency" label="Default currency">
                                    <Select
                                        options={[
                                            { value: 'AED', label: 'AED' },
                                            { value: 'USD', label: 'USD' },
                                            { value: 'EUR', label: 'EUR' },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="iban" label="IBAN">
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={8}>
                                <Form.Item name="swift" label="SWIFT">
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default SettingsProfile;
