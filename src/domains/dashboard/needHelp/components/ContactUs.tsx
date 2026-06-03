import { Col, Flex, Grid, Image, List, Row, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';

import useScreenSize from '@src/hooks/useScreenSize';

import { mail, phone, whatsapp } from '../assets';
import tour from '../assets/tour.svg';
import useEnableProductTour from '../hooks/useEnableProductTour';
import { contactUsData } from '../utils/data';

const ContactUs = () => {
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { handleUpdateTour } = useEnableProductTour();
    const { md } = useScreenSize();
    return (
        <Row
            className="h-full rounded-md sm:mt-8 sm:bg-contactUsBg lg:px-10"
            justify="center"
            align="middle"
        >
            <Col className="pt-2 sm:p-10" xs={24} lg={16}>
                <Space direction="vertical" className="lg:mt-10">
                    <Typography.Text className="text-xl sm:font-semibold sm:text-2xl ">
                        👋 Help Center
                    </Typography.Text>
                    <Typography.Paragraph className="mt-2 max-w-[30rem] ps-1">
                        <Typography.Text type="danger">
                            We are glad to have you here!&nbsp;
                        </Typography.Text>
                        Our dedicated support team is diligently working to assist you. Your
                        feedback is valuable to us as it drives us forward. For further assistance
                        or any queries, please don&rsquo;t hesitate to get in touch with us.
                    </Typography.Paragraph>
                </Space>
                <Flex className="grid grid-cols-3 gap-3 mt-6 mb-5 sm:my-14">
                    <a href="tel:+97145401266" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <Flex
                            vertical
                            align="center"
                            justify="center"
                            className="w-full h-full py-2 border rounded-lg sm:border-none transition duration-150 transform hover:scale-105"
                        >
                            <Image src={phone} preview={false} width={screens.xs ? 25 : 50} />
                            <Typography.Text className="mt-2 text-xs sm:text-base">
                                Call Us at
                            </Typography.Text>
                            <Typography.Text className="text-xs sm:text-lg sm:font-medium">
                                +971 454 012 66
                            </Typography.Text>
                        </Flex>
                    </a>
                    <a
                        target="_blank"
                        rel="noreferrer"
                        href="mailto:help@peko.one"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <Flex
                            vertical
                            align="center"
                            justify="center"
                            className="w-full h-full py-2 border rounded-lg sm:border-none transition duration-150 transform hover:scale-105"
                        >
                            <Image src={mail} preview={false} width={screens.xs ? 25 : 50} />
                            <Typography.Text className="mt-2 text-xs sm:text-base">
                                Write to us on{' '}
                            </Typography.Text>
                            <Typography.Text className="text-xs sm:text-lg sm:font-medium">
                                help@peko.one
                            </Typography.Text>
                        </Flex>
                    </a>
                    <a
                        href="https://wa.me/+971800697356"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                        <Flex
                            vertical
                            align="center"
                            justify="center"
                            className="w-full h-full py-2 border rounded-lg sm:border-none transition duration-150 transform hover:scale-105"
                        >
                            <Image src={whatsapp} preview={false} width={screens.xs ? 25 : 50} />
                            <Typography.Text className="mt-2 text-xs sm:text-base">
                                Chat with us on
                            </Typography.Text>
                            <Typography.Text className="text-xs sm:text-lg sm:font-medium">
                                WhatsApp
                            </Typography.Text>
                        </Flex>
                    </a>
                </Flex>
            </Col>
            <Col xs={24} lg={6} className="sm:px-8 ">
                <List
                    size="small"
                    bordered={!screens.xs}
                    split={false}
                    dataSource={contactUsData}
                    className="px-2 py-3"
                    header={
                        <Typography.Text className="pb-2 text-lg font-medium text-brandColor">
                            FAQ
                        </Typography.Text>
                    }
                    renderItem={item => (
                        <List.Item
                            style={{ paddingLeft: screens.xs ? 0 : '' }}
                            className="m-0 sm:p-2"
                        >
                            <Link
                                to={`${item.link}?faqCategory=${encodeURIComponent(item.text)}`}
                                className="removeDecorationLink"
                            >
                                {item.text}
                            </Link>
                        </List.Item>
                    )}
                />
                {md && (
                    <Flex
                        className="py-5 cursor-pointer"
                        gap={8}
                        onClick={handleUpdateTour}
                        justify="center"
                        align="center"
                    >
                        <Image src={tour} preview={false} />
                        <Typography.Text className="font-medium text-brandColor text-base">
                            Give me a product tour
                        </Typography.Text>
                    </Flex>
                )}
            </Col>
        </Row>
    );
};

export default ContactUs;
