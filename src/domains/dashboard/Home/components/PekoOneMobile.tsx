import React from 'react';

import { Button, Col, Image, Row, Typography } from 'antd';
import { Link } from 'react-router-dom';

import DashboardSnap from '@assets/DashboardSnap.png';
import PekoOne from '@assets/PekoOne.png';
import { paths } from '@src/routes/paths';

const PekoOneMobile = () => {
    const { Text } = Typography;

    return (
        <div
            className="relative flex-wrap overflow-hidden pt-7 banner-gradient rounded-2xl max-h-56"
            style={{ padding: '0.8rem', paddingRight: '0rem', paddingBottom: 0 }}
        >
            <Row gutter={16}>
                <Col span={16}>
                    <div className="flex flex-col w-full gap-2 px-2">
                        <Text className="text-lg font-medium line-clamp-2">
                            Upgrade to{' '}
                            <Image
                                src={PekoOne}
                                preview={false}
                                className=""
                                style={{ width: 'auto', height: '1.2rem', maxHeight: '1.6rem' }}
                            />
                        </Text>
                        <Text
                            className="max-w-full text-[0.6rem] font-normal line-clamp-5"
                            style={{ lineHeight: '1.1rem' }}
                        >
                            Choose your plan, simplify your processes, and enjoy a seamless journey
                            with Peko. Upgrade today for a more efficient way to manage your tasks
                            with ease.
                        </Text>
                        <Link to={paths.dashboard.plans} className="mb-5">
                            <Button
                                danger
                                type="primary"
                                size="small"
                                className="w-24 text-xs font-medium"
                            >
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </Col>
                <Col span={8} className="relative flex items-end justify-end overflow-hidden">
                    <Image
                        src={DashboardSnap}
                        preview={false}
                        className="pt-3 rounded-br-xl"
                        style={{
                            width: '150%',
                            height: 'auto',
                            maxWidth: '19rem',
                            transform: 'translateX(-10%)',
                            objectFit: 'cover',
                            bottom: 0,
                            right: 0,
                        }}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default PekoOneMobile;
