import React from 'react';

import { Col, Flex, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import DataSVG from '../../assets/icons/DataBlack.svg';
import MessageSVG from '../../assets/icons/MessageBlack.svg';
import PhoneSVG from '../../assets/icons/PhoneBlack.svg';
import { EsimUsage } from '../../types/orderDetails';

type Props = {
    usage: EsimUsage;
};

const DetailsRight = ({ usage }: Props) => {
    const PackageDetails = [
        {
            icon: DataSVG,
            title: `${usage && (usage.remaining / 1024).toFixed(2)} GB` ?? 'N/A',
            subTitle: 'Remaining Data',
            bg: 'bg-esimInfoCardYellow',
        },
        {
            icon: PhoneSVG,
            title: usage?.is_unlimited ? 'Unlimited' : `${usage?.total_voice} Min`,
            subTitle: 'Remaining Minutes',
            bg: 'bg-esimInfoCardPink',
        },
        {
            icon: MessageSVG,
            title: usage?.is_unlimited ? 'Unlimited' : `${usage?.remaining_text} SMS`,
            subTitle: 'Remaining SMS',
            bg: 'bg-esimInfoCardPurple',
        },
    ];
    return (
        <Row gutter={[20, 20]} justify="space-around">
            {PackageDetails.map((item, i) => (
                <Col xs={24} md={8} key={i} className="w-full p-0 m-0">
                    <Flex
                        className={`${item.bg} xs:w-full xs:h-36 md:h-40 rounded-2xl px-4`}
                        key={i}
                    >
                        <Flex
                            className="w-full h-full ms-1"
                            justify="center"
                            align="self-start"
                            vertical
                        >
                            <Flex
                                className="bg-white h-10 w-10 rounded-full p-4"
                                justify="center"
                                align="center"
                            >
                                <ReactSVG src={item.icon} className="text-textBlack" />
                            </Flex>
                            <Typography.Text className="text-xl text-textBlack font-semibold mt-4">
                                {item.title}
                            </Typography.Text>
                            <Typography.Text className="text-base text-textBlack">
                                {item.subTitle}
                            </Typography.Text>
                        </Flex>
                    </Flex>
                </Col>
            ))}
        </Row>
    );
};

export default DetailsRight;
