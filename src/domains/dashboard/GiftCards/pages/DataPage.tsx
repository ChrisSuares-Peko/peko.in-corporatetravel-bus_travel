import React, { useState } from 'react';

import {
    Button,
    Col,
    Flex,
    Image,
    Input,
    InputNumber,
    Radio,
    RadioChangeEvent,
    Row,
    Space,
    Tabs,
    TabsProps,
    Tag,
    Typography,
    theme,
} from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

import '../styles/Style.css';

import image from '@domains/dashboard/GiftCards/assets/images/amazonGiftCard.png';

import AboutTab from '../components/AboutTab';
import GiftCard from '../components/GiftCard';
import HowToUseTab from '../components/HowToUseTab';
import LocationTab from '../components/LocationTab';
import TermsAndConditionTab from '../components/TermsAndConditionTab';
import GetGiftDetails from '../hooks/useGiftDetailsApi';
import { giftCardData, giftCardPrice, sampleText } from '../utils/data';

const Details = () => {
    const { id } = useParams();
    let data;
    let isLoading;
    if (id) {
        ({ data, isLoading } = GetGiftDetails(id));
    }
    const [selected, setSelected] = useState(0);
    const navigate = useNavigate();
    const {
        token: { colorPrimary },
    } = theme.useToken();
    const [value, setValue] = useState(1);

    const onChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'About this Gift Cards',
            children: <AboutTab text={sampleText} />,
        },
        {
            key: '2',
            label: 'How to Use',
            children: <HowToUseTab text={data?.mainGiftCard.redemption_instructions} />,
        },
        {
            key: '3',
            label: 'Terms & Condition ',
            children: <TermsAndConditionTab text={sampleText} />,
        },
        {
            key: '4',
            label: 'Location',
            children: <LocationTab text={sampleText} />,
        },
    ];

    function handleClick(item: number) {
        setSelected(item);
    }
    function handleBuyClick() {
        navigate('/gift-cards/checkout');
    }
    return (
        <Row className="px-0 sm:px-6">
            <Col xs={24}>
                <Flex className="flex-col md:flex-row">
                    <Flex vertical gap={20}>
                        <Image preview={false} src={image} />
                        <Flex className="md:mt-4" gap={6}>
                            <Tag className="p-2 px-3 text-sm text-center text-green-500 border border-green-500">
                                Online
                            </Tag>
                            <Tag className="p-2 px-3 text-sm text-center text-yellow-500 border border-yellow-500">
                                InStore
                            </Tag>
                        </Flex>
                    </Flex>
                    <Flex vertical gap={20} className="mt-3 md:px-8 md:mt-0">
                        <Typography.Title level={2} className="">
                            Samsung
                        </Typography.Title>
                        <Flex>
                            <Radio.Group onChange={onChange} value={value}>
                                <Space direction="horizontal">
                                    <Radio value={1}>Gift a Friend</Radio>
                                    <Radio value={2}>Buy for Self</Radio>
                                </Space>
                            </Radio.Group>
                        </Flex>
                        <Flex vertical>
                            <Typography.Text className="text-xs font-normal  text-zinc-600">
                                Enter Amount:
                            </Typography.Text>
                            <Flex className="flex-wrap mt-2" gap={8}>
                                <Input placeholder="Enter Amount:" className="w-32 mr-1" />

                                {giftCardPrice.map((item, i) => (
                                    <Tag
                                        key={i}
                                        onClick={() => handleClick(item)}
                                        className={`text-center p-2  text-sm  h-fit items-center cursor-pointer ${
                                            selected === item
                                                ? 'border border-red-500 bg-stone-50 text-red-500'
                                                : 'text-zinc-400 '
                                        }`}
                                    >
                                        {`AED ${item}`}
                                    </Tag>
                                ))}
                            </Flex>
                        </Flex>
                        <Flex gap={8} align="center">
                            <InputNumber min={1} max={10} defaultValue={1} />

                            <Button
                                type="primary"
                                danger
                                style={{
                                    backgroundColor: colorPrimary,
                                    color: 'white',
                                }}
                                onClick={() => handleBuyClick()}
                            >
                                Buy Now
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Col>
            <Col xs={24} className="mt-5 md:mt-10">
                <Tabs defaultActiveKey="1" items={items} />
            </Col>
            <Row className="mt-8 overflow-x-auto">
                <Typography.Title level={4}>Related Gift Cards</Typography.Title>
                <Flex
                    className="flex mt-5 space-x-4"
                    id="scrollbar"
                    style={{
                        overflowX: 'auto',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {giftCardData.map((item, i) => (
                        <Col xs={12} sm={8} md={6} xl={4} key={i}>
                            <GiftCard
                                image={image}
                                id={i}
                                name={item.title}
                                description={item.description}
                            />
                        </Col>
                    ))}
                </Flex>
            </Row>
        </Row>
    );
};

export default Details;
