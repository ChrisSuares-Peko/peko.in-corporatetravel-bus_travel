import { createRef, useRef, useState, useEffect } from 'react';

import { Col, Flex, Grid, Row, Spin, Typography, Skeleton } from 'antd';
import Lottie from 'react-lottie';

import animation from '@assets/animation/Flight-Loader.json';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';

import AdaptiveAirlineDetail from './AdaptiveAirlineDetail';
import AirlineDetailBody from '../components/AirlineDetailBody';
import PriceCard from '../components/PriceCard';
import useForm from '../hooks/useForm';
import { useGetFareRules } from '../hooks/useGetFareRules';
import { resetSelectedAncillaries } from '../slices/airlineSlice';

const { useBreakpoint } = Grid;

const AirlineDetail = () => {
    const dispatch = useAppDispatch();
    const screens = useBreakpoint();
    const airlineForm = useAppSelector(state => state.reducer.airline.formData);
    const { adultCount, childCount, infantCount } = airlineForm.passengerData;
    const { handleSubmission } = useForm();
    const { fareRules, isLoading } = useGetFareRules();

    const [isLcc, setIsLcc] = useState<boolean>(false);
    const [showSpinner, setShowSpinner] = useState<boolean>(false);
    const formRef = useRef(
        Array.from({ length: adultCount + childCount + infantCount }, () => createRef())
    );
    const formRef1 = useRef(null);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    };

    useEffect(() => {
        dispatch(resetSelectedAncillaries());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const renderComponent = () => {
        if (screens.md || screens.lg || screens.xl) {
            return (
                <>
                    {isLoading ? (
                        <Col xl={17}>
                            <Skeleton />
                        </Col>
                    ) : (
                        <Flex vertical className="gap-8">
                            <Spin
                                className="mt-48"
                                indicator={
                                    <Lottie options={defaultOptions} height={80} width={600} />
                                }
                                spinning={showSpinner}
                            >
                                <Typography.Paragraph className="text-xl font-medium leading-7">
                                    Review your itinerary
                                </Typography.Paragraph>
                                <Row className="gap-5 mt-6 justify-between">
                                    <AirlineDetailBody
                                        showSpinner={setShowSpinner}
                                        isLcc={isLcc}
                                        setIsLcc={setIsLcc}
                                        formRef={formRef}
                                        formRef1={formRef1}
                                        handleSubmission={handleSubmission}
                                        fareRules={fareRules}
                                        isLoading={isLoading}
                                    />
                                    <PriceCard
                                        showSpinner={setShowSpinner}
                                        isLcc={isLcc}
                                        formRef={formRef}
                                        formRef1={formRef1}
                                        handleSubmission={handleSubmission}
                                    />
                                </Row>
                            </Spin>
                        </Flex>
                    )}
                </>
            );
        }
        if (screens.xs || screens.sm) {
            return <AdaptiveAirlineDetail handleSubmission={handleSubmission} />;
        }
        return <Skeleton />;
    };
    return (
        <Row>
            <Col span={24}>{renderComponent()}</Col>
        </Row>
    );
};

export default AirlineDetail;
