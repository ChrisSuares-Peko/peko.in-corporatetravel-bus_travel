import React from 'react';

import { InfoCircleFilled } from '@ant-design/icons';
import { Alert, Typography, Space, List } from 'antd';

const { Paragraph, Title } = Typography;

type NoteProps = {
    title: string;
    description: string;
    points?: string[];
};

const InformationNote: React.FC<NoteProps> = ({ title, description, points }) => (
    <Alert
        message={
            <Space direction="vertical" size="middle" className="w-full my-2 mb-4">
                <Space className="w-full">
                    <InfoCircleFilled
                        style={{
                            fontSize: 18,
                            marginTop: 15,
                            marginLeft: 10,
                            marginBottom: 10,
                            color: '#faad14',
                        }}
                    />
                    <Title level={5} style={{ marginTop: 10, marginLeft: 10, marginBottom: 10 }}>
                        {title}
                    </Title>
                </Space>
                <Paragraph
                    className="font-helvetica md:text-[13px] sm:ml-12 font-medium"
                    style={{ marginBottom: 0 }}
                >
                    {description}
                </Paragraph>
                {points && (
                    <List
                        className="font-helvetica md:text-[13px] sm:ml-8 font-medium w-full"
                        bordered={false}
                        dataSource={points}
                        renderItem={item => (
                            <List.Item
                                style={{
                                    borderBottom: 'none',
                                    paddingLeft: 20,
                                    paddingRight: 0,
                                    paddingTop: 1,
                                    paddingBottom: 1,
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                }}
                            >
                                <span
                                    style={{
                                        display: 'inline-block',
                                        width: 20,
                                        textAlign: 'center',
                                        marginRight: 5,
                                        fontSize: 14,
                                        lineHeight: '14px',
                                    }}
                                >
                                    &#x2022;
                                </span>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        flex: 1,
                                    }}
                                >
                                    {item}
                                </span>
                            </List.Item>
                        )}
                    />
                )}
            </Space>
        }
        type="warning"
        showIcon={false}
        banner
        className="mt-7 mx-2 w-full custom-alert"
    />
);

export default InformationNote;
