import React from 'react';

import { Col, Image, Row, Typography } from 'antd';

import { imageRow1, imageRow2, imageRow3 } from '../utils/data';

const PekoClubHeader = () => (
    <Row gutter={[30, 30]}>
        <Col span={14}>
            <Typography.Text className="text-3xl font-thin">
                Welcome to the Peko Club
            </Typography.Text>
            <Typography.Paragraph className="font-extralight mt-10 text-xl leading-9  w-3/4 text-textGrey">
                Peko Club is a subscription-based service that offers a diverse range of benefits
                and experiences to its members. As a member of Peko Club, individuals gain access to
                exclusive perks, rewards, and privileges across various categories, including
                dining, entertainment, travel, shopping, and lifestyle.
            </Typography.Paragraph>
        </Col>
        <Col span={10} className="">
            <Row>
                {imageRow1.map((item, i) => (
                    <Col key={i} span={6} className="">
                        <Image src={item} height={110} width={110} preview={false} />
                    </Col>
                ))}
            </Row>
            <Row className="justify-end">
                {imageRow2.map((item, i) => (
                    <Col key={i} span={6} className="mt-2">
                        <Image src={item} height={110} width={110} preview={false} />
                    </Col>
                ))}
            </Row>
            <Row className="justify-end">
                {imageRow3.map((item, i) => (
                    <Col key={i} span={6} className="mt-2">
                        <Image src={item} height={110} width={110} preview={false} />
                    </Col>
                ))}
            </Row>
            {/* <Row className="justify-end">
                {imageRow4.map((item, i) => (
                    <Col key={i} span={6} className="mt-2">
                        <Image src={item} height={110} width={110} preview={false} />
                    </Col>
                ))}
            </Row> */}
        </Col>
    </Row>
);

export default PekoClubHeader;
