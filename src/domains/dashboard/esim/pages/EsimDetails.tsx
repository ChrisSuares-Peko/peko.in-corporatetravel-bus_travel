import { Button, Col, Divider, Flex, Row } from 'antd';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';

import animation from '@assets/animation/EsimLoader.json';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import DetailsLeft from '../components/esimDetails/DetailsLeft';
import DetailsRight from '../components/esimDetails/DetailsRight';
import EsimDetailsAdditionalInfoList from '../components/esimDetails/EsimDetailAdditionalInfo';
import EsimTab from '../components/esimDetails/EsimTab';
import useGetOrderDetails from '../hooks/useGetEsimDetails';

type Props = {};

const EsimDetails = (props: Props) => {
    const state = useAppSelector(item => item.reducer.esim.esimDetails);
    const { data, isLoading } = useGetOrderDetails(state.iccid, state.id);
    const navigate = useNavigate();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    return (
        <Row>
            {isLoading ? (
                <Lottie options={defaultOptions} height={400} width={600} isClickToPauseDisabled />
            ) : (
                <>
                    <Col xs={24} md={24}>
                        <Flex className="mb-6" justify="end">
                            <Button
                                type="primary"
                                danger
                                onClick={() =>
                                    navigate(paths.esim.topup, {
                                        state: {
                                            iccid: data.simDetails.iccid,
                                            operator: data.packageDetails.operatorName,
                                            image: data.packageDetails.operatorImage,
                                            packageType: data.packageDetails?.packageType,
                                            region: data.packageDetails?.region,
                                            countries: data.packageDetails?.countries,
                                        },
                                    })
                                }
                            >
                                Top-Up eSIM
                            </Button>
                        </Flex>
                    </Col>
                    <Col xs={24} md={6}>
                        <DetailsLeft
                            usage={data && data.usage}
                            image={data && data.packageDetails.operatorImage}
                            operator={data && data.packageDetails.operatorName}
                        />
                    </Col>
                    <Col xs={0} md={1} />
                    <Col xs={24} md={17}>
                        <DetailsRight usage={data && data.usage} />
                        <Divider className="mt-12" />
                        <EsimDetailsAdditionalInfoList
                            details={data && data.packageDetails}
                            esimDetails={data && data?.simDetails}
                        />
                    </Col>
                    <Divider className="mt-6" />
                    <Col span={24}>
                        <EsimTab QRurl={data && data.simDetails.qrcode_url} />
                    </Col>
                </>
            )}
        </Row>
    );
};

export default EsimDetails;
