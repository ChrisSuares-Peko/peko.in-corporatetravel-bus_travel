import { Row, Col, Grid, Image, Typography, Flex } from 'antd';

import logoSVG from '../../assets/logoSSCO.svg';

const { useBreakpoint } = Grid;

const BrandLogoSection = () => {
    const screens = useBreakpoint();
    const height = screens.md ? 60 : 30;
    const width = screens.md ? 200 : 120;

    return (
        <Row justify="end">
            <Col>
                <Flex vertical>
                    <Typography.Text className="text-xs ml-3 ">Partnered With</Typography.Text>
                    <Image
                        src={logoSVG}
                        alt="logo"
                        width={width}
                        height={height}
                        preview={false}
                        className="mt-1"
                    />
                </Flex>
            </Col>
        </Row>
    );
};

export default BrandLogoSection;
