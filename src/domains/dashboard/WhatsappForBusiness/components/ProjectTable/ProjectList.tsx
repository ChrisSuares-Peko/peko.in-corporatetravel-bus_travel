import React, { useState, useMemo, useEffect } from 'react';

import { Button, Col, Flex, Form, Radio, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useGetDetailsSubscription } from '@src/domains/dashboard/IndividualPlan/hooks/useGetDetailsSubscription';
import { PlanType } from '@src/domains/dashboard/plans/types';
import { calculateDiscount } from '@src/domains/dashboard/plans/utils';
import { useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';
import { packageAccessKeys } from '@utils/packageAccessKeys';

import WebTable from './WebTable';
import GetAllProjects from '../../hooks/useGetProjects';
import useWhatsAppSubscriptionPayment from '../../hooks/useSubscriptionPayment';
import { PlanMode } from '../../types';
import { FirstPlanFeatures, SecondPlanFeatures } from '../../utils';
import PlanCard from '../pricingPlan/PlanCard';

const ProjectList = () => {
    const serviceKey = packageAccessKeys['Whatsapp for Business'];
    const { id } = useAppSelector(state => state.reducer.auth);
    const { packages } = useGetDetailsSubscription({ accessKey: serviceKey });

    const initialPackage = packages?.[0];
    const initialPlanId = (initialPackage && initialPackage.id) || 15;
    const initialPrice = initialPackage?.packagePrices?.monthly || 49;
    const initialDiscount = initialPackage?.discount?.monthly || 39;

    const { discountedAmount: initialAmount } = calculateDiscount(initialPrice, initialDiscount);

    const [searchValue, setSearchValue] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [selectedType, setSelectedType] = useState(PlanMode.Basic);
    const [seletedDuration, setSeletedDuration] = useState(PlanType.Monthly);
    const [planId, setPlanId] = useState<number>(initialPlanId);
    const [price, setPrice] = useState<number | string>(initialPrice);
    const [discountedAmount, setDiscountedAmount] = useState<number>(initialAmount);
    const [projectName, setProjectName] = useState('');
    const [Page, setPage] = useState(1);

    // Loading state for button and API calls
    const [buttonLoading, setButtonLoading] = useState(false);

    const {
        projectData,
        isLoading: projectsLoading,
        count,
        currentPage,
    } = GetAllProjects(refresh, Page);
    const { handleSubmission } = useWhatsAppSubscriptionPayment();

    useEffect(() => {
        setDiscountedAmount(initialAmount);
    }, [initialAmount]);

    const navigate = useNavigate();

    const handleSelectPlan = (
        plan: PlanMode,
        planid: number,
        Price: string | number,
        DiscountedAmount: number
    ) => {
        setSelectedType(plan);
        setPlanId(planid);
        setPrice(Price);
        setDiscountedAmount(DiscountedAmount);
    };

    const handleSelectDuration = (Duration: PlanType) => {
        setSeletedDuration(Duration);
        const selectedPackage = packages?.find(p => p.id === planId);
        const newPrice =
            Duration === PlanType.Monthly
                ? selectedPackage?.packagePrices?.monthly
                : selectedPackage?.packagePrices?.annually;
        const newDiscount =
            Duration === PlanType.Monthly
                ? selectedPackage?.discount?.monthly
                : selectedPackage?.discount?.annually;
        const { discountedAmount: newAmount } = calculateDiscount(newPrice || 0, newDiscount || 0);
        setPrice(newPrice || 0);
        setDiscountedAmount(newAmount);
    };

    const handleCreateNewProject = async (values: { name: string }) => {
        setButtonLoading(true);
        const details = {
            url: `${paths.dashboard.moreServices}/${paths.whatsappForBusiness.index}`,
            service: 'WhatsApp For Business',
        };
        sessionStorage.setItem('PurchaseUrl', JSON.stringify(details));

        const prefixedName = `${values.name}_${id}`;

        await handleSubmission(
            prefixedName,
            selectedType,
            seletedDuration,
            planId,
            discountedAmount
        );
        setButtonLoading(false);
    };

    const validationSchema = Yup.object().shape({
        name: Yup.string().trim().required('Name is required'),
    });

    const filteredProjectData = useMemo(() => {
        if (!searchValue) return projectData;
        return projectData?.filter(project =>
            project.name.toLowerCase().includes(searchValue.toLowerCase())
        );
    }, [projectData, searchValue]);

    const refreshProjects = () => {
        setRefresh(prev => !prev);
    };

    return (
        <Col>
            <Flex justify="space-between" className="mb-5">
                <Typography.Text className="font-medium sm:text-xl">My Projects</Typography.Text>
                <Button type="primary" danger onClick={() => setIsModalVisible(true)}>
                    Create New Project
                </Button>
            </Flex>
            <WebTable
                projectData={filteredProjectData}
                isLoading={projectsLoading}
                refreshProjects={refreshProjects}
                count={count}
                currentPage={currentPage}
                setPage={page => setPage(page)}
            />
            <CustomModalWithForm
                open={isModalVisible}
                handleCancel={() => setIsModalVisible(false)}
                initialValues={{ name: '', projectType: '' }}
                modalTitle="Create New Project"
                handleFormSubmit={handleCreateNewProject}
                validationSchema={validationSchema}
                isLoading={buttonLoading}
                width={720}
            >
                <Flex vertical className="w-full">
                    <Form layout="vertical">
                        <TextInput
                            name="name"
                            label="Enter Name"
                            type="text"
                            placeholder="Enter Name"
                            isRequired
                            classes="rounded-sm"
                            handleChange={e => setProjectName(e)} // Update state when name is typed
                        />

                        {/* New Disabled Input with User ID */}
                        <TextInput
                            name="userId"
                            label={`Your project name will be displayed as: ${projectName}_${id}.`}
                            type="text"
                            values={`${projectName}_${id}`} // Show user ID
                            isDisabled // Disable input
                            classes="rounded-sm"
                        />

                        <Form.Item label="Billing cycle">
                            <Radio.Group
                                name="billing_cycle"
                                onChange={e => handleSelectDuration(e.target.value)}
                                value={seletedDuration}
                            >
                                <Radio value={PlanType.Monthly}>Monthly</Radio>
                                <Radio value={PlanType.Annually}>Yearly</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Row justify="start" className="flex gap-28">
                            {Array.isArray(packages) && packages.length
                                ? packages.map((plan, index) => {
                                      let features;
                                      if (index === 0) {
                                          features = FirstPlanFeatures;
                                      } else if (index === 1) {
                                          features = SecondPlanFeatures;
                                      }
                                      return (
                                          <PlanCard
                                              key={plan.id}
                                              planId={plan.id}
                                              planName={plan.packageName as PlanMode}
                                              price={
                                                  seletedDuration === PlanType.Monthly
                                                      ? plan?.packagePrices?.monthly
                                                      : plan?.packagePrices?.annually
                                              }
                                              discount={
                                                  seletedDuration === PlanType.Monthly
                                                      ? plan?.discount?.monthly
                                                      : plan?.discount?.annually
                                              }
                                              selectedType={selectedType}
                                              seletedDuration={seletedDuration}
                                              feature={features!}
                                              onSelectPlan={handleSelectPlan}
                                          />
                                      );
                                  })
                                : ''}
                        </Row>
                    </Form>
                </Flex>
            </CustomModalWithForm>
        </Col>
    );
};

export default ProjectList;
