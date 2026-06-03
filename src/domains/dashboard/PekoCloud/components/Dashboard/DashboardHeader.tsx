import { ExportOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Row, Typography, theme } from 'antd';
import { Link } from 'react-router-dom';
import { ReactSVG } from 'react-svg';

import SettingsIcon from '@domains/dashboard/PekoCloud/assets/icons/settings.svg';
import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { showToast } from '@src/slices/apiSlice';

const DashboardHeader = () => {
    const {
        token: { colorPrimary },
    } = theme.useToken();

    const dispatch = useAppDispatch();

    const displayMessage = () => {
        dispatch(showToast({ variant: 'info', description: 'Coming soon' }));
    };

    return (
        <Col span={24} className="">
            <Row className="pb-8 " align="middle" justify="space-between" gutter={[20, 20]}>
                <Flex gap="middle" vertical>
                    <Typography.Text className="text-xl font-medium ms-3">
                        Peko Cloud
                    </Typography.Text>
                </Flex>
                <Row justify="end" align="middle" className="xs:w-full md:w-auto gap-5 lg:gap-5">
                    <Button
                        onClick={displayMessage}
                        type="primary"
                        danger
                        className="text-sm text text-bgOrange"
                        icon={<ExportOutlined />}
                    >
                        Share necessary details
                    </Button>

                    <Link className=" md:mx-0" to={`${paths.pekoCloud.settings}`}>
                        <Flex align="center" gap={10}>
                            <ReactSVG src={SettingsIcon} />
                            <Typography.Text className="text-sm" style={{ color: colorPrimary }}>
                                Settings
                            </Typography.Text>
                        </Flex>
                    </Link>
                </Row>
            </Row>
        </Col>
    );
};

export default DashboardHeader;
