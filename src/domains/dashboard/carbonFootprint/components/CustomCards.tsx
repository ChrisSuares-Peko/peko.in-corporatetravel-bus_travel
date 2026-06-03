import { Card, Col, Flex, Row, Typography } from 'antd';
import { ReactSVG } from 'react-svg';

import {
    TreeSVG,
    GassSVG,
    PhoneSVG,
    BBQSVG,
    FireSVG,
    FrontCarSVG,
    RefrigeratorsSVG,
    SideCarSVG,
    TripSVG,
    TrashSVG,
} from '@domains/dashboard/carbonFootprint/assets/icons/impactReport/index';

const CustomCard = () => (
    <Row gutter={[30, 30]}>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={TreeSVG} />
                    <Typography.Text className="text-lg font-medium text-center ">
                        900
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center ">
                        Trees planted
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col xs={24} md={24}>
            <Flex gap={45} align="center" vertical>
                <Typography.Text className="text-xl font-normal ">
                    Your action has neutralized carbon footprint equivalent to:
                </Typography.Text>
            </Flex>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={GassSVG} />
                    <Typography.Text className="text-lg font-medium text-center ">
                        428L
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center ">of gasoline</Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={PhoneSVG} />
                    <Typography.Text className="mt-2 text-xs text-center">
                        Power required to charge
                    </Typography.Text>
                    <Flex gap={5}>
                        <Typography.Text className="text-lg font-medium text-center">
                            127,000
                        </Typography.Text>
                        <Typography.Text className="mt-2 text-xs text-center">
                            smartphones
                        </Typography.Text>
                    </Flex>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={BBQSVG} />
                    <Typography.Text className="mt-1 text-lg font-medium text-center">
                        40
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center">
                        BBQ propane tanks
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={FireSVG} />
                    <Typography.Text className="mt-2 text-lg font-medium text-center">
                        12
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center">
                        fire extinguishers
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={FrontCarSVG} />
                    <Typography.Text className="mt-2 text-lg font-medium text-center">
                        6,000 km
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center">
                        of fuel usage by a diesel car
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={RefrigeratorsSVG} />
                    <Flex gap={5}>
                        <Typography.Text className="mt-2 text-xs text-center">
                            Emissions by{' '}
                        </Typography.Text>
                        <Typography.Text className="text-lg font-medium text-center">
                            11
                        </Typography.Text>
                    </Flex>
                    <Typography.Text className="text-xs text-center">
                        refrigerators for a year{' '}
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={SideCarSVG} />
                    <Typography.Text className="text-xs text-center">
                        Fueling up an SUV
                    </Typography.Text>

                    <Typography.Text className="text-lg font-medium text-center">
                        46 times
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={TripSVG} />
                    <Typography.Text className="mt-2 text-xs text-center">
                        Emissions released by
                    </Typography.Text>

                    <Typography.Text className="text-lg font-medium text-center">
                        72 Trips
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center">
                        {' '}
                        from Amsterdam to Rome
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>

        <Col className="flex justify-center md:block" xs={12} md={8} lg={8} xl={6}>
            <Card className="flex self-center justify-center w-full align-middle border-0 min-h-40 rounded-xl bg-impactReportCardBg">
                <Flex align="center" justify="center" vertical className="h-full" gap={6}>
                    <ReactSVG src={TrashSVG} />
                    <Typography.Text className="mt-2 text-lg font-medium text-center">
                        1500 kg2
                    </Typography.Text>
                    <Typography.Text className="text-xs text-center">
                        of plastic waste dumped in water bodies
                    </Typography.Text>
                </Flex>
            </Card>
        </Col>
    </Row>
);

export default CustomCard;
