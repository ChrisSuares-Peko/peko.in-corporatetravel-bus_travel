import React from 'react';

import { Col, Grid, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import PlanPurchase from '../components/neutralize/PlanPurchase';
import ProjectDetailsCard from '../components/neutralize/ProjectDetailsCard';
import SketetonForNeutralize from '../components/neutralize/SketetonForNeutralize';
import useForm from '../hooks/useForm';
import useGetNeutriliseData from '../hooks/useGetNeutriliseData';

const { useBreakpoint } = Grid;

const Neutralize = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { handleSubmission, loader } = useForm();
    const { state } = useLocation();
    const screens = useBreakpoint();
    const width = screens.md ? 60 : 20;
    const vertical = !screens.md;
    const {
        projectData,
        isLoading,
        calculatedRate,
        co2FootPrint,
        amount,
        credit,
        handleAmountChange,
        handleCreditChange,
        handleNeutrilizefull,
        ConversionUsdToAed,
        selectedPackage,
        handleSelectPackage,
        click,
        percentage,
        value,
    } = useGetNeutriliseData(state?.id);
    const handleSubmit = () => {
        const selectedPackageId =
            selectedPackage !== null ? projectData?.packages[selectedPackage]?.id : null;
        const selectedPackageAmount =
            selectedPackage !== null && projectData?.packages[selectedPackage].amount;
        const selectedPackageCredit =
            selectedPackage !== null && projectData?.packages[selectedPackage].credits;

        const formData = {
            amountInAed: click
                ? calculatedRate
                : amount || selectedPackageAmount * ConversionUsdToAed,
            amount: click
                ? calculatedRate / ConversionUsdToAed
                : amount / ConversionUsdToAed || selectedPackageAmount,
            co2Offset: click ? co2FootPrint : credit || selectedPackageCredit,
            credits: click ? co2FootPrint : credit || selectedPackageCredit,
            selectedPackage: { id: selectedPackageId },
            selectedProject: { id: state?.id },
            projectName: projectData?.name,
        };
        if (formData.amount < 1 || formData.credits < 1) {
            dispatch(
                showToast({
                    description: 'Amount and credits must be greater than 0',
                    variant: 'warning',
                })
            );
        } else if (formData.amount) {
            handleSubmission(formData);
        } else {
            dispatch(
                showToast({
                    description: 'Please select a plan',
                    variant: 'warning',
                })
            );
        }
    };
    return isLoading ? (
        <SketetonForNeutralize />
    ) : (
        <Content className="">
            <Row gutter={[width, 20]}>
                <Col xs={24} md={10} lg={12} xl={10}>
                    <ProjectDetailsCard projectDetails={projectData} />
                </Col>
                <Col xs={24} md={14} lg={12}>
                    <PlanPurchase
                        projectData={projectData}
                        exchangeRate={ConversionUsdToAed}
                        handleCreditChange={handleCreditChange}
                        handleSelectPackage={handleSelectPackage}
                        handleSubmit={handleSubmit}
                        credit={credit}
                        amount={amount}
                        handleAmountChange={handleAmountChange}
                        handleNeutrilizefull={handleNeutrilizefull}
                        loader={loader}
                        selectedPackage={selectedPackage}
                        calculatedRate={calculatedRate}
                        co2FootPrint={co2FootPrint}
                        percentage={percentage}
                        value={value}
                    />
                </Col>
            </Row>
        </Content>
    );
};

export default Neutralize;
