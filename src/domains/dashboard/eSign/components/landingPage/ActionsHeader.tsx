import React, { useState } from 'react';

import { Row, Typography, Col, Flex, Image } from 'antd';

import IFrameModal from '@components/molecular/modals/IFrameModal';
import LandingPageImg from '@domains/dashboard/eSign/assets/landing.png';
import eSignsAvailable from '@src/domains/dashboard/eSign/assets/eSignsAvailable.svg';
import eSignsLeft from '@src/domains/dashboard/eSign/assets/eSignsLeft.svg';
import eSignsUsed from '@src/domains/dashboard/eSign/assets/eSignsUsed.svg';
import DashboardCard from '@src/domains/dashboard/Invoice/components/DashboardCard';
import useScreenSize from '@src/hooks/useScreenSize';
import useGetAddonDetails from '@src/hooks/useSubscriptionAddons';
import { accessKeys } from '@utils/accessKeys';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import ESignLimitBar from './ESignLimitBar';
import FeaturesCard from './FeaturesCard';
import useGetESignCount from '../../hooks/useGetESignCount';
import { featureRow } from '../../utils';

type Props = {};

const ActionsHeader = (props: Props) => {
    const { md } = useScreenSize();
    const { count, isLoading: countLoading } = useGetESignCount();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { addonData, isLoading: addOnLoading } = useGetAddonDetails(
        accessKeys.eSign,
        packageAccessKeys.eSign
    );
    const eSignLeft = Math.max(0, Number(addonData?.maxLimit) - Number(count));

    return (
        <>
            <Row justify="space-between" align="middle" className="pb-6 bg-white border-gray-200">
                <Typography.Text className="text-xl font-medium">eSign</Typography.Text>
                {/* <Button onClick={() => setIsModalVisible(true)} danger>
                    Tutorial
                </Button> */}
            </Row>

            <Row className="flex flex-col md:flex-row ">
                <Col xl={10} sm={24}>
                    <Flex className="flex flex-col items-center gap-6 mb-4 text-center rounded-3xl py-14 xl:h-full md:h-auto h-68 md:mb-0 bg-stone-50 md:mr-2">
                        <Image
                            src={LandingPageImg}
                            preview={false}
                            alt="eSign"
                            width={md ? '12rem' : '12rem'}
                            height={md ? '12rem' : '12rem'}
                        />
                        <Typography.Text
                            // style={{ lineHeight: '3.8rem' }}
                            className="text-2xl font-medium leading-relaxed text-gray-700 md:text-2xl xxl:text-3xl xl:px-10 sm:px-0"
                        >
                            Experience the Power of eSign
                        </Typography.Text>
                        <Typography.Text className="px-4 text-xs leading-relaxed text-gray-500 text-start md:text-sm xl:px-10">
                            The #1 way to digitally sign documents that are legally valid in UAE.
                            Sign any type of document such as Offer Letters, Invoices, Form 16s and
                            more. Adopt eSign, get rid of paper and make your business faster,
                            simpler and contribute positively to the environment.
                        </Typography.Text>
                    </Flex>
                </Col>
                <Col xl={14} sm={24}>
                    <Row className="flex flex-col items-center justify-center flex-1 space-y-4 md:ml-6 xl:mt-0 sm:mt-6">
                        <Col className="grid w-full grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
                            <DashboardCard
                                title="Total eSigns available"
                                value={addonData?.maxLimit.toString() || '0'}
                                currency=""
                                bgColor="bg-magnolia"
                                icon={eSignsAvailable}
                            />
                            <DashboardCard
                                title="Total eSigns used"
                                value={count?.toString() || '0'}
                                currency=""
                                bgColor="bg-seashell"
                                icon={eSignsUsed}
                            />
                            <DashboardCard
                                title="Total eSigns left"
                                value={eSignLeft.toString()}
                                currency=""
                                bgColor="#FFFBE4"
                                icon={eSignsLeft}
                            />
                        </Col>
                        <Col className="grid w-full gap-4 ">
                            <ESignLimitBar
                                addOnLoading={addOnLoading}
                                countLoading={countLoading}
                                count={count!}
                                addonData={addonData!}
                            />
                        </Col>
                        <Col className="grid w-full grid-cols-3 gap-4 sm:grid-cols-3 xl:grid-cols-3">
                            {featureRow.map((item, i) => (
                                <FeaturesCard
                                    key={i}
                                    icon={item.image}
                                    title={item.title}
                                    path={item.link}
                                    accessLimit={item.accessLimit}
                                    eSignLeft={eSignLeft}
                                />
                            ))}
                        </Col>
                    </Row>
                </Col>
            </Row>
            {isModalVisible && (
                <IFrameModal
                    open={isModalVisible}
                    handleCancel={() => setIsModalVisible(false)}
                    videoUrl="https://www.loom.com/embed/d4f22eacea2943fbaa4dd3ca0f15dd48?sid=87aac601-1562-4ea1-ac3b-dd7792d79e10"
                    // modalTitle='How to use eSign'
                />
            )}
        </>
    );
};

export default ActionsHeader;
