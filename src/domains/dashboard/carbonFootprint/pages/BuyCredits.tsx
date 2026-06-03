import React from 'react';

import { Col, Grid, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';

import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import PlanPurchase from '../components/neutralize/PlanPurchase';
import ProjectDetailsCard from '../components/neutralize/ProjectDetailsCard';
import SketetonForNeutralize from '../components/neutralize/SketetonForNeutralize';
import useForm from '../hooks/useForm';
import useGetSelectProjects from '../hooks/useGetSelectProjects';

const { useBreakpoint } = Grid;

const BuyCredits = () => {
    const dispatch = useAppDispatch();
    const { handleSubmission, loader } = useForm();
    const screens = useBreakpoint();
    const width = screens.md ? 60 : 20;
    const vertical = !screens.md;
    const {
        selectData,
        loading,
        selected,
        changeSelectedOption,
        projectData,
        amount,
        credit,
        ConversionUsdToAed,
        handleAmountChange,
        handleCreditChange,
        value,
        selectedPackage,
        handleSelectPackage,
    } = useGetSelectProjects();

    const handleSubmit = () => {
        const selectedPackageId =
            selectedPackage !== null ? projectData?.packages[selectedPackage]?.id : null;
        const selectedPackageAmount =
            selectedPackage !== null && projectData?.packages[selectedPackage].amount;
        const selectedPackageCredit =
            selectedPackage !== null && projectData?.packages[selectedPackage].credits;

        const formData = {
            amountInAed: amount || selectedPackageAmount * ConversionUsdToAed,
            amount: amount / ConversionUsdToAed || selectedPackageAmount,
            co2Offset: credit || selectedPackageCredit,
            credits: credit || selectedPackageCredit,
            selectedPackage: { id: selectedPackageId },
            selectedProject: { id: selected },
            projectName: projectData?.name,
        };
        if (formData.amount) handleSubmission(formData);
        else
            dispatch(
                showToast({
                    description: 'Please Select a plan',
                    variant: 'warning',
                })
            );
    };
    return loading ? (
        <SketetonForNeutralize />
    ) : (
        <Content className="">
            <Row gutter={[width, 20]}>
                <Col xs={24} md={10} lg={12} xl={10} xxl={10}>
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
                        loader={loader}
                        selectedPackage={selectedPackage}
                        changeSelectedOption={changeSelectedOption}
                        selectData={selectData}
                        selected={selected}
                        value={value}
                    />
                </Col>
            </Row>
        </Content>
    );
};

export default BuyCredits;
