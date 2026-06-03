import type { FC } from 'react';

import { Button, Col, Row, Form, Flex, Radio, Typography } from 'antd';
import { ErrorMessage, Formik } from 'formik';

import { Step4Schema } from '../../../schema/index';
import { Step4Types } from '../../../types/types';
import FormHeader from '../FormHeader';

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    totalSteps: number;
    btnLoading: boolean;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    step4Data: Step4Types | undefined;
}

interface StepFormValues {
    acceptingDeposits?: string;
    makingInvestments?: string;
    advancingLoans?: string;
    currencyExchanges?: string;
    bankingLicense?: string;
    takingHedgingPosition?: string;
    managingCapitalAdequacy?: string;
    raisingFunds?: string;
    incomeFromRoyalties?: string;
    franchiseIncome?: string;
    incomeFromIntangibleAssets?: string;
    incomeFromCapitalGains?: string;
    expertCompetency?: string;
    controlOverResearch?: string;
    inhouseDevelopedIP?: string;
    purchasedIPFromGroup?: string;
    soldIPToGroup?: string;
    decisionsByNonResidentDirectors?: string;
    incomeFromDividends?: string;
    incomeFromCapitalGainsEquity?: string;
    equityInterestHolding?: string;
    realEstateInterest?: string;
    incomeFromBonds?: string;
    reportToRegulatoryAuthorities?: string;
    groupPosition?: string;
    servicesToGroupMembers?: string;
    seniorManagementServices?: string;
    strategicPlansForGroup?: string;
    anyITorHRServicesToGroupMembers?: string;
    investmentFund?: string;
    investmentAdvisoryServices?: string;
    fundAdministrationServices?: string;
    fundManagementServices?: string;
    hedgingOnInvestments?: string;
    reportOnInvestments?: string;
    riskReservesCalculation?: string;
    interestBearingLoanFacilities?: string;
    hirePurchaseAgreements?: string;
    assetsToBeLeased?: string;
    incomeFromCapitalGainsOnLoans?: string;
    termsAndDurationOfLease?: string;
    interestBearingLoanFacilitiesToGroupMembers?: string;
    goodsPurchasedFromForeignConnectedPersons?: string;
    importsAndStorageInState?: string;
    administrationToForeignConnectedPersons?: string;
}

const Step4: FC<StepsProps> = ({
    current,
    setCurrent,
    totalSteps,
    btnLoading,
    handleFormSubmit,
    step4Data,
}) => {
    const handleSave = (values: any) => {
        handleFormSubmit(4, values, true);
    };
    // Function to generate initial form values
    const getInitialValues = (): StepFormValues => ({
        acceptingDeposits: step4Data?.acceptingDeposits || '',
        makingInvestments: step4Data?.makingInvestments || '',
        advancingLoans: step4Data?.advancingLoans || '',
        currencyExchanges: step4Data?.currencyExchanges || '',
        bankingLicense: step4Data?.bankingLicense || '',
        takingHedgingPosition: step4Data?.takingHedgingPosition || '',
        managingCapitalAdequacy: step4Data?.managingCapitalAdequacy || '',
        raisingFunds: step4Data?.raisingFunds || '',
        incomeFromRoyalties: step4Data?.incomeFromRoyalties || '',
        franchiseIncome: step4Data?.franchiseIncome || '',
        incomeFromIntangibleAssets: step4Data?.incomeFromIntangibleAssets || '',
        incomeFromCapitalGains: step4Data?.incomeFromCapitalGains || '',
        expertCompetency: step4Data?.expertCompetency || '',
        controlOverResearch: step4Data?.controlOverResearch || '',
        inhouseDevelopedIP: step4Data?.inhouseDevelopedIP || '',
        purchasedIPFromGroup: step4Data?.purchasedIPFromGroup || '',
        soldIPToGroup: step4Data?.soldIPToGroup || '',
        decisionsByNonResidentDirectors: step4Data?.decisionsByNonResidentDirectors || '',
        incomeFromDividends: step4Data?.incomeFromDividends || '',
        incomeFromCapitalGainsEquity: step4Data?.incomeFromCapitalGainsEquity || '',
        equityInterestHolding: step4Data?.equityInterestHolding || '',
        realEstateInterest: step4Data?.realEstateInterest || '',
        incomeFromBonds: step4Data?.incomeFromBonds || '',
        reportToRegulatoryAuthorities: step4Data?.reportToRegulatoryAuthorities || '',
        groupPosition: step4Data?.groupPosition || '',
        servicesToGroupMembers: step4Data?.servicesToGroupMembers || '',
        seniorManagementServices: step4Data?.seniorManagementServices || '',
        strategicPlansForGroup: step4Data?.strategicPlansForGroup || '',
        anyITorHRServicesToGroupMembers: step4Data?.anyITorHRServicesToGroupMembers || '',
        investmentFund: step4Data?.investmentFund || '',
        investmentAdvisoryServices: step4Data?.investmentAdvisoryServices || '',
        fundAdministrationServices: step4Data?.fundAdministrationServices || '',
        fundManagementServices: step4Data?.fundManagementServices || '',
        hedgingOnInvestments: step4Data?.hedgingOnInvestments || '',
        reportOnInvestments: step4Data?.reportOnInvestments || '',
        riskReservesCalculation: step4Data?.riskReservesCalculation || '',
        interestBearingLoanFacilities: step4Data?.interestBearingLoanFacilities || '',
        hirePurchaseAgreements: step4Data?.hirePurchaseAgreements || '',
        assetsToBeLeased: step4Data?.assetsToBeLeased || '',
        incomeFromCapitalGainsOnLoans: step4Data?.incomeFromCapitalGainsOnLoans || '',
        termsAndDurationOfLease: step4Data?.termsAndDurationOfLease || '',
        interestBearingLoanFacilitiesToGroupMembers:
            step4Data?.interestBearingLoanFacilitiesToGroupMembers || '',
        goodsPurchasedFromForeignConnectedPersons:
            step4Data?.goodsPurchasedFromForeignConnectedPersons || '',
        importsAndStorageInState: step4Data?.importsAndStorageInState || '',
        administrationToForeignConnectedPersons:
            step4Data?.administrationToForeignConnectedPersons || '',
    });

    return (
        <Formik<StepFormValues>
            initialValues={getInitialValues()}
            validationSchema={Step4Schema}
            onSubmit={(values, { setFieldTouched }) => {
                // Mark all fields as touched to trigger validation
                Object.keys(values).forEach(field => {
                    setFieldTouched(field, true);
                });
                console.log('Form Values:', values);
                handleFormSubmit(4, values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, errors, values, setFieldTouched, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title="Relevant Activity Test:"
                        />
                        <Typography.Paragraph className=" text-base font-medium mt-5">
                            Banking Business
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Accepting Deposits" required>
                                    <Radio.Group
                                        name="acceptingDeposits"
                                        value={values.acceptingDeposits}
                                        onChange={e => {
                                            setFieldTouched('acceptingDeposits', true);
                                            setFieldValue('acceptingDeposits', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="acceptingDeposits"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Making of investments for the account and at the risk of the Licensee."
                                    required
                                >
                                    <Radio.Group
                                        name="makingInvestments"
                                        value={values.makingInvestments}
                                        onChange={e => {
                                            setFieldTouched('makingInvestments', true);
                                            setFieldValue('makingInvestments', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="makingInvestments"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Advancing Loans or arranging overdraft" required>
                                    <Radio.Group
                                        name="advancingLoans"
                                        value={values.advancingLoans}
                                        onChange={e => {
                                            setFieldTouched('advancingLoans', true);
                                            setFieldValue('advancingLoans', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="advancingLoans"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Providing Currency Exchanges,money transfer services, marketing licensed financial activities."
                                    required
                                >
                                    <Radio.Group
                                        name="currencyExchanges"
                                        value={values.currencyExchanges}
                                        onChange={e => {
                                            setFieldTouched('currencyExchanges', true);
                                            setFieldValue('currencyExchanges', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="currencyExchanges"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Banking & Financial license by the following regulators."
                                    required
                                >
                                    <Radio.Group
                                        name="bankingLicense"
                                        value={values.bankingLicense}
                                        onChange={e => {
                                            setFieldTouched('bankingLicense', true);
                                            setFieldValue('bankingLicense', e.target.value);
                                        }}
                                    >
                                        <Radio value="Central Bank">Central Bank</Radio>
                                        <Radio value="DFSA">DFSA</Radio>
                                        <Radio value="FSRA">FSRA</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="bankingLicense"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Taking Hedging Position." required>
                                    <Radio.Group
                                        name="takingHedgingPosition"
                                        value={values.takingHedgingPosition}
                                        onChange={e => {
                                            setFieldTouched('takingHedgingPosition', true);
                                            setFieldValue('takingHedgingPosition', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="takingHedgingPosition"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="Managing & Testing Capital Adequacy" required>
                                    <Radio.Group
                                        name="managingCapitalAdequacy"
                                        value={values.managingCapitalAdequacy}
                                        onChange={e => {
                                            setFieldTouched('managingCapitalAdequacy', true);
                                            setFieldValue(
                                                'managingCapitalAdequacy',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="managingCapitalAdequacy"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Raising Funds" required>
                                    <Radio.Group
                                        name="raisingFunds"
                                        value={values.raisingFunds}
                                        onChange={e => {
                                            setFieldTouched('raisingFunds', true);
                                            setFieldValue('raisingFunds', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="raisingFunds"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Intellectual Property Business-IP
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Income Coming from Royalties" required>
                                    <Radio.Group
                                        name="incomeFromRoyalties"
                                        value={values.incomeFromRoyalties}
                                        onChange={e => {
                                            setFieldTouched('incomeFromRoyalties', true);
                                            setFieldValue('incomeFromRoyalties', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromRoyalties"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Any Franchise Income" required>
                                    <Radio.Group
                                        name="franchiseIncome"
                                        value={values.franchiseIncome}
                                        onChange={e => {
                                            setFieldTouched('franchiseIncome', true);
                                            setFieldValue('franchiseIncome', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="franchiseIncome"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Income From Licensing Intangible Assets" required>
                                    <Radio.Group
                                        name="incomeFromIntangibleAssets"
                                        value={values.incomeFromIntangibleAssets}
                                        onChange={e => {
                                            setFieldTouched('incomeFromIntangibleAssets', true);
                                            setFieldValue(
                                                'incomeFromIntangibleAssets',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromIntangibleAssets"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Income From Capital gains of IP" required>
                                    <Radio.Group
                                        name="incomeFromCapitalGains"
                                        value={values.incomeFromCapitalGains}
                                        onChange={e => {
                                            setFieldTouched('incomeFromCapitalGains', true);
                                            setFieldValue('incomeFromCapitalGains', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromCapitalGains"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Competency & Experience of Experts/employees developing the IP"
                                    required
                                >
                                    <Radio.Group
                                        name="expertCompetency"
                                        value={values.expertCompetency}
                                        onChange={e => {
                                            setFieldTouched('expertCompetency', true);
                                            setFieldValue('expertCompetency', e.target.value);
                                        }}
                                    >
                                        <Radio value="Central Bank">Central Bank</Radio>
                                        <Radio value="DFSA">DFSA</Radio>
                                        <Radio value="FSRA">FSRA</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="expertCompetency"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Degree of control over research & Development happening in UAE"
                                    required
                                >
                                    <Radio.Group
                                        name="controlOverResearch"
                                        value={values.controlOverResearch}
                                        onChange={e => {
                                            setFieldTouched('controlOverResearch', true);
                                            setFieldValue('controlOverResearch', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="controlOverResearch"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Inhouse developed IP" required>
                                    <Radio.Group
                                        value={values.inhouseDevelopedIP}
                                        name="inhouseDevelopedIP"
                                        onChange={e => {
                                            setFieldTouched('inhouseDevelopedIP', true);
                                            setFieldValue('inhouseDevelopedIP', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="inhouseDevelopedIP"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="IP Purchased from a group company" required>
                                    <Radio.Group
                                        name="purchasedIPFromGroup"
                                        value={values.purchasedIPFromGroup}
                                        onChange={e => {
                                            setFieldTouched('purchasedIPFromGroup', true);
                                            setFieldValue('purchasedIPFromGroup', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="purchasedIPFromGroup"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="IP Sold to a group company" required>
                                    <Radio.Group
                                        name="soldIPToGroup"
                                        value={values.soldIPToGroup}
                                        onChange={e => {
                                            setFieldTouched('soldIPToGroup', true);
                                            setFieldValue('soldIPToGroup', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="soldIPToGroup"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Periodic Decisions by non resident directors for high risk IP"
                                    required
                                >
                                    <Radio.Group
                                        name="decisionsByNonResidentDirectors"
                                        value={values.decisionsByNonResidentDirectors}
                                        onChange={e => {
                                            setFieldTouched(
                                                'decisionsByNonResidentDirectors',
                                                true
                                            );
                                            setFieldValue(
                                                'decisionsByNonResidentDirectors',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="decisionsByNonResidentDirectors"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Holding Company Business
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee earn Income From Dividends of Equity interest"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeFromDividends"
                                        value={values.incomeFromDividends}
                                        onChange={e => {
                                            setFieldTouched('incomeFromDividends', true);
                                            setFieldValue('incomeFromDividends', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromDividends"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee earn Income from capital gain of Equity Interest"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeFromCapitalGainsEquity"
                                        value={values.incomeFromCapitalGainsEquity}
                                        onChange={e => {
                                            setFieldTouched('incomeFromCapitalGainsEquity', true);
                                            setFieldValue(
                                                'incomeFromCapitalGainsEquity',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromCapitalGainsEquity"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Holding of equity interest only" required>
                                    <Radio.Group
                                        name="equityInterestHolding"
                                        value={values.equityInterestHolding}
                                        onChange={e => {
                                            setFieldTouched('equityInterestHolding', true);
                                            setFieldValue('equityInterestHolding', e.target.value);
                                        }}
                                    >
                                        <Radio value="domestic">domestic</Radio>
                                        <Radio value="foreign">foreign</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="equityInterestHolding"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee holds interest in real estate"
                                    required
                                >
                                    <Radio.Group
                                        name="realEstateInterest"
                                        value={values.realEstateInterest}
                                        onChange={e => {
                                            setFieldTouched('realEstateInterest', true);
                                            setFieldValue('realEstateInterest', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="realEstateInterest"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee earn Income from Bonds,Govt securities"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeFromBonds"
                                        value={values.incomeFromBonds}
                                        onChange={e => {
                                            setFieldTouched('incomeFromBonds', true);
                                            setFieldValue('incomeFromBonds', e.target.value);
                                        }}
                                    >
                                        <Radio value="Central Bank">Central Bank</Radio>
                                        <Radio value="DFSA">DFSA</Radio>
                                        <Radio value="FSRA">FSRA</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromBonds"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee Report to Regulatory authorities"
                                    required
                                >
                                    <Radio.Group
                                        name="reportToRegulatoryAuthorities"
                                        value={values.reportToRegulatoryAuthorities}
                                        onChange={e => {
                                            setFieldTouched('reportToRegulatoryAuthorities', true);
                                            setFieldValue(
                                                'reportToRegulatoryAuthorities',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="DMCC">DMCC</Radio>
                                        <Radio value="DIFC">DIFC</Radio>
                                        <Radio value="ADGM">ADGM</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="reportToRegulatoryAuthorities"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Headquarter Business
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Licensee's Group position" required>
                                    <Radio.Group
                                        name="groupPosition"
                                        value={values.groupPosition}
                                        onChange={e => {
                                            setFieldTouched('groupPosition', true);
                                            setFieldValue('groupPosition', e.target.value);
                                        }}
                                    >
                                        <Radio value="parent">parent</Radio>
                                        <Radio value="subsidiary">subsidiary</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="groupPosition"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Any Services (IT or HR)provided to group members inside or outside UAE with or without fee"
                                    required
                                >
                                    <Radio.Group
                                        name="servicesToGroupMembers"
                                        value={values.servicesToGroupMembers}
                                        onChange={e => {
                                            setFieldTouched('servicesToGroupMembers', true);
                                            setFieldValue('servicesToGroupMembers', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="servicesToGroupMembers"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Investment Fund management Business
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee provide senior management services to group companies ( Foreign or local)"
                                    required
                                >
                                    <Radio.Group
                                        name="seniorManagementServices"
                                        value={values.seniorManagementServices}
                                        onChange={e => {
                                            setFieldTouched('seniorManagementServices', true);
                                            setFieldValue(
                                                'seniorManagementServices',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="seniorManagementServices"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee provide strategic plans to group companies ( foreign or local) and exercise control with or without fee"
                                    required
                                >
                                    <Radio.Group
                                        name="strategicPlansForGroup"
                                        value={values.strategicPlansForGroup}
                                        onChange={e => {
                                            setFieldTouched('strategicPlansForGroup', true);
                                            setFieldValue('strategicPlansForGroup', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="strategicPlansForGroup"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Any Services (IT or HR)provided to group members inside or outside UAE with or without fee"
                                    required
                                >
                                    <Radio.Group
                                        name="anyITorHRServicesToGroupMembers"
                                        value={values.anyITorHRServicesToGroupMembers}
                                        onChange={e => {
                                            setFieldTouched(
                                                'anyITorHRServicesToGroupMembers',
                                                true
                                            );
                                            setFieldValue(
                                                'anyITorHRServicesToGroupMembers',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="anyITorHRServicesToGroupMembers"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Do licensee has any investment fund?" required>
                                    <Radio.Group
                                        name="investmentFund"
                                        value={values.investmentFund}
                                        onChange={e => {
                                            setFieldTouched('investmentFund', true);
                                            setFieldValue('investmentFund', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="investmentFund"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Investment advisory services inside or outside UAE"
                                    required
                                >
                                    <Radio.Group
                                        name="investmentAdvisoryServices"
                                        value={values.investmentAdvisoryServices}
                                        onChange={e => {
                                            setFieldTouched('investmentAdvisoryServices', true);
                                            setFieldValue(
                                                'investmentAdvisoryServices',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="investmentAdvisoryServices"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Fund administration services" required>
                                    <Radio.Group
                                        name="fundAdministrationServices"
                                        value={values.fundAdministrationServices}
                                        onChange={e => {
                                            setFieldTouched('fundAdministrationServices', true);
                                            setFieldValue(
                                                'fundAdministrationServices',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="fundAdministrationServices"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do Licensee provide Investment fund management services ( decision related to divestment, investment, risk related decisions on behalf of foreign or domestic funds)"
                                    required
                                >
                                    <Radio.Group
                                        name="fundManagementServices"
                                        value={values.fundManagementServices}
                                        onChange={e => {
                                            setFieldTouched('fundManagementServices', true);
                                            setFieldValue('fundManagementServices', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="fundManagementServices"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Taking Hedging Position on investment risks"
                                    required
                                >
                                    <Radio.Group
                                        name="hedgingOnInvestments"
                                        value={values.hedgingOnInvestments}
                                        onChange={e => {
                                            setFieldTouched('hedgingOnInvestments', true);
                                            setFieldValue('hedgingOnInvestments', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="hedgingOnInvestments"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee prepare reports to Regulatory bodies on investment"
                                    required
                                >
                                    <Radio.Group
                                        name="reportOnInvestments"
                                        value={values.reportOnInvestments}
                                        onChange={e => {
                                            setFieldTouched('reportOnInvestments', true);
                                            setFieldValue('reportOnInvestments', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="reportOnInvestments"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item label="Do licensee calculate Risk & Reserves" required>
                                    <Radio.Group
                                        name="riskReservesCalculation"
                                        value={values.riskReservesCalculation}
                                        onChange={e => {
                                            setFieldTouched('riskReservesCalculation', true);
                                            setFieldValue(
                                                'riskReservesCalculation',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="riskReservesCalculation"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Lease Finance Business
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee offer loans in consideration of interest & processing fee)"
                                    required
                                >
                                    <Radio.Group
                                        name="interestBearingLoanFacilities"
                                        value={values.interestBearingLoanFacilities}
                                        onChange={e => {
                                            setFieldTouched('interestBearingLoanFacilities', true);
                                            setFieldValue(
                                                'interestBearingLoanFacilities',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="parent">parent</Radio>
                                        <Radio value="subsidiary">subsidiary</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="interestBearingLoanFacilities"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee offer hire purchase agreements in relation to assets other than loan."
                                    required
                                >
                                    <Radio.Group
                                        name="hirePurchaseAgreements"
                                        value={values.hirePurchaseAgreements}
                                        onChange={e => {
                                            setFieldTouched('hirePurchaseAgreements', true);
                                            setFieldValue('hirePurchaseAgreements', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="hirePurchaseAgreements"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee identify assets to be acquired to be leased?"
                                    required
                                >
                                    <Radio.Group
                                        name="assetsToBeLeased"
                                        value={values.assetsToBeLeased}
                                        onChange={e => {
                                            setFieldTouched('assetsToBeLeased', true);
                                            setFieldValue('assetsToBeLeased', e.target.value);
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="assetsToBeLeased"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee earn income from capital gains upon conversion of loans into share capital or late payment penalties"
                                    required
                                >
                                    <Radio.Group
                                        name="incomeFromCapitalGainsOnLoans"
                                        value={values.incomeFromCapitalGainsOnLoans}
                                        onChange={e => {
                                            setFieldTouched('incomeFromCapitalGainsOnLoans', true);
                                            setFieldValue(
                                                'incomeFromCapitalGainsOnLoans',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="incomeFromCapitalGainsOnLoans"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee set the terms and duration of any finance lease?"
                                    required
                                >
                                    <Radio.Group
                                        name="termsAndDurationOfLease"
                                        value={values.termsAndDurationOfLease}
                                        onChange={e => {
                                            setFieldTouched('termsAndDurationOfLease', true);
                                            setFieldValue(
                                                'termsAndDurationOfLease',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="termsAndDurationOfLease"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee provide any of interest bearing loan facilities to group member?"
                                    required
                                >
                                    <Radio.Group
                                        name="interestBearingLoanFacilitiesToGroupMembers"
                                        value={values.interestBearingLoanFacilitiesToGroupMembers}
                                        onChange={e => {
                                            setFieldTouched(
                                                'interestBearingLoanFacilitiesToGroupMembers',
                                                true
                                            );
                                            setFieldValue(
                                                'interestBearingLoanFacilitiesToGroupMembers',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="interestBearingLoanFacilitiesToGroupMembers"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Typography.Paragraph className=" text-base font-medium ">
                            Distribution & Service businesses
                        </Typography.Paragraph>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee purchased goods ( components, Items for resale) from Foreign connected person"
                                    required
                                >
                                    <Radio.Group
                                        name="goodsPurchasedFromForeignConnectedPersons"
                                        value={values.goodsPurchasedFromForeignConnectedPersons}
                                        onChange={e => {
                                            setFieldTouched(
                                                'goodsPurchasedFromForeignConnectedPersons',
                                                true
                                            );
                                            setFieldValue(
                                                'goodsPurchasedFromForeignConnectedPersons',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="parent">parent</Radio>
                                        <Radio value="subsidiary">subsidiary</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="goodsPurchasedFromForeignConnectedPersons"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee imports and store in the state?"
                                    required
                                >
                                    <Radio.Group
                                        name="importsAndStorageInState"
                                        value={values.importsAndStorageInState}
                                        onChange={e => {
                                            setFieldTouched('importsAndStorageInState', true);
                                            setFieldValue(
                                                'importsAndStorageInState',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="importsAndStorageInState"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    label="Do licensee provide administration & to foreign connected persons outside UAE"
                                    required
                                >
                                    <Radio.Group
                                        name="administrationToForeignConnectedPersons"
                                        value={values.administrationToForeignConnectedPersons}
                                        onChange={e => {
                                            setFieldTouched(
                                                'administrationToForeignConnectedPersons',
                                                true
                                            );
                                            setFieldValue(
                                                'administrationToForeignConnectedPersons',
                                                e.target.value
                                            );
                                        }}
                                    >
                                        <Radio value="yes">Yes</Radio>
                                        <Radio value="no">No</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <ErrorMessage
                                    name="administrationToForeignConnectedPersons"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                        </Row>
                    </Flex>
                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(current - 1)}
                        >
                            Back
                        </Button>
                        <Button
                            type="default"
                            className="md:w-32 xs:w-36"
                            danger
                            onClick={() => {
                                handleSave(values);
                            }}
                            loading={btnLoading}
                        >
                            Save
                        </Button>
                        <Button
                            type="primary"
                            className="md:w-32 xs:w-36"
                            danger
                            htmlType="submit"
                            loading={btnLoading}
                        >
                            Next
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default Step4;
