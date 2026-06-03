// ESRRegistration.js (or .tsx for TypeScript)

import React, { useState } from 'react';

import { Card, Flex, Layout, Skeleton } from 'antd';

import BrandLogoSection from '../components/landingPage/BrandLogoSection';
import KeyAdditionalNotes from '../components/landingPage/KeyAdditionalNotes';
import MainHeadSection from '../components/landingPage/MainHeadSection';
import NotificationFilingInfo from '../components/landingPage/NotificationFilingInfo';
import PrimaryAssessment from '../components/landingPage/PrimaryAssessment';
import RegistrationOverview from '../components/landingPage/RegistrationOverview';
import ReturnFilingInfo from '../components/landingPage/ReturnFilingInfo';
import SubFooter from '../components/landingPage/SubFooter';
import { useGetDataByFisicalYear } from '../hooks/useGetDataByFisicalYear';
import { fiscalYearOptions } from '../utils/data';

const ESRRegistration = () => {
    const [dropdownData, setDropdownData] = useState(fiscalYearOptions[0].value);
    const { isLoading, yearData } = useGetDataByFisicalYear(dropdownData);
    return (
        <Layout className="bg-white space-y-8">
            <BrandLogoSection />
            <MainHeadSection />
            <RegistrationOverview
                fiscalYearOptions={fiscalYearOptions}
                dropdownData={dropdownData}
                setDropDownData={setDropdownData}
            />

            {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                    <Card
                        className="md:mx-20 my-0 md:my-5 border-2 border-gray-150 rounded-xl md:rounded-lg "
                        key={index}
                    >
                        <Flex className="justify-between" align="center">
                            <Flex vertical gap={10}>
                                <Skeleton.Avatar size="default" active />
                                <Skeleton.Input active size="default" />
                            </Flex>
                            <Skeleton.Avatar size="large" active />
                        </Flex>
                    </Card>
                ))}
            {!isLoading && yearData && (
                <>
                    <PrimaryAssessment yearData={yearData[0]} dropdownData={dropdownData} />
                    <NotificationFilingInfo yearData={yearData[1]} dropdownData={dropdownData} />
                    <ReturnFilingInfo yearData={yearData[2]} dropdownData={dropdownData} />
                </>
            )}
            <KeyAdditionalNotes />
            <SubFooter />
        </Layout>
    );
};

export default ESRRegistration;
