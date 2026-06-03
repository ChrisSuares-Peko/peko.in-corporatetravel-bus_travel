import { Col, Flex, Row, Typography } from 'antd';

import CardRow from '../components/CardRow';
import SocialLinks from '../components/SocialLinks';
import { data } from '../utils/impactReport/data';

const ImpactReport = () => (
    <Row className="mt-10">
        <Col xs={24} md={24}>
            <Flex gap={45} align="center" vertical>
                <Typography.Text className="text-3xl font-light ">
                    You have made a great Impact
                </Typography.Text>
                <Typography.Text className="-mt-6 text-4xl">
                    By neutralising 1 carbon credit
                </Typography.Text>
                <Typography.Text className="-mt-6 text-xl font-normal">
                    Your action is equivalent to:
                </Typography.Text>
            </Flex>
        </Col>
        <Col className="mt-10 md:px-20" xs={24} md={24}>
            <CardRow data={data} />
        </Col>
        <Col className="mt-10 " xs={24} md={24}>
            <Flex justify="center" gap="large" className="mt-8">
                <Typography.Text className="text-2xl">
                    Let’s keep doing the great work
                </Typography.Text>
            </Flex>
        </Col>
        {/* <Col className="mt-10" xs={24} md={24}>
            <Flex justify="center" gap={30}>
                <Row gutter={[20, 20]}>
                    <Col xs={12}>
                        <Card
                            size="small"
                            className="p-3 border min-h-30 md:min-w-52 border-1 rounded-xl"
                            bordered={false}
                        >
                            <Flex
                                justify="center"
                                align="center"
                                gap="middle"
                                className="mt-6"
                                vertical
                            >
                                <ReactSVG src={PdfSVG} />
                                <Typography.Text className="text-sm text-center">
                                    Download your <br /> impact reports in pdf
                                </Typography.Text>
                                <Button danger type="default" className="px-10">
                                    Download
                                </Button>
                            </Flex>
                        </Card>
                    </Col>
                    <Col xs={12}>
                        <Card
                            size="small"
                            className="p-3 border min-h-30 border-1 md:min-w-52 rounded-xl"
                            bordered={false}
                        >
                            <Flex
                                justify="center"
                                align="center"
                                gap="middle"
                                className="mt-6"
                                vertical
                            >
                                <ReactSVG src={CertificateSVG} />
                                <Typography.Text className="text-sm text-center">
                                    Download your <br /> certificate
                                </Typography.Text>
                                <Button danger type="default" className="px-10 ">
                                    Download
                                </Button>
                            </Flex>
                        </Card>
                    </Col>
                </Row>
            </Flex>
        </Col> */}
        <Col className="mt-6 " xs={24} md={24}>
            <Flex justify="center" align="center" gap="large" vertical>
                <Typography.Text className="text-2xl text-green-900">
                    Share your impact
                </Typography.Text>
                <SocialLinks />
            </Flex>
        </Col>
    </Row>
);
export default ImpactReport;
