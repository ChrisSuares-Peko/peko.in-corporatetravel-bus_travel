import React from 'react';

import { Button, Flex, Form, Skeleton, Typography } from 'antd';
import { Formik } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import useSettingsApi from '../../hooks/HrSettings/useSettingsApi';
import { leaveSummarySchema } from '../../schema/hrSettings';

const LeaveSummaryForm = () => {
    const { leaveSummaryApi, leaveSummmary: data, isLoading } = useSettingsApi();

    const defaultLeaves = {
        annualLeave: 30,
        sickLeave: 15,
        HajjAndUmrahLeave: 5,
    };

    return isLoading ? (
        <Skeleton />
    ) : (
        <Flex vertical gap={20} className="zpt-6">
            <Typography.Text className="font-medium mt-3" style={{ fontSize: '0.9rem' }}>
                Maximum Paid Leave Settings
            </Typography.Text>
            <Formik
                initialValues={{
                    annualLeave: data?.leaveSettings?.annualLeave || defaultLeaves.annualLeave,
                    sickLeave: data?.leaveSettings?.sickLeave || defaultLeaves.sickLeave,
                    parentalLeave: data?.leaveSettings?.parentalLeave || 0,
                    sabbaticalLeave: data?.leaveSettings?.sabbaticalLeave || 0,
                    studyLeave: data?.leaveSettings?.studyLeave || 0,
                    HajjAndUmrahLeave:
                        data?.leaveSettings?.HajjAndUmrahLeave || defaultLeaves.HajjAndUmrahLeave,
                    maternityLeave: data?.leaveSettings?.maternityLeave || 0,
                    officialLeavesAndVacations:
                        data?.leaveSettings?.officialLeavesAndVacations || 0,
                    otherPaidLeaves: data?.leaveSettings?.otherPaidLeaves || 0,
                    eligibilityTimePeriod: data?.leaveSettings?.eligibilityTimePeriod || 0,
                }}
                enableReinitialize
                validationSchema={leaveSummarySchema}
                onSubmit={async (values, { resetForm }) => {
                    const updatedLeaves = {
                        leaveSettings: {
                            annualLeave: values.annualLeave,
                            sickLeave: values.sickLeave,
                            parentalLeave: values.parentalLeave,
                            sabbaticalLeave: values.sabbaticalLeave,
                            studyLeave: values.studyLeave,
                            HajjAndUmrahLeave: values.HajjAndUmrahLeave,
                            maternityLeave: values.maternityLeave,
                            officialLeavesAndVacations: values.officialLeavesAndVacations,
                            otherPaidLeaves: values.otherPaidLeaves,
                            eligibilityTimePeriod: values.eligibilityTimePeriod,
                        },
                    };
                    await leaveSummaryApi(updatedLeaves);
                }}
            >
                {({ handleSubmit, isSubmitting }) => (
                    <Form layout="vertical" className="w-full md:w-[40rem]" onFinish={handleSubmit}>
                        <Flex vertical className="w-full md:w-[40rem]">
                            <Flex className="md:justify-between flex-col md:flex-row">
                                <TextInput
                                    name="annualLeave"
                                    placeholder="Enter annual leave"
                                    label="Annual Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                    isRequired
                                />
                                <TextInput
                                    name="sickLeave"
                                    placeholder="Enter sick leave"
                                    label="Sick Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                            </Flex>
                            <Flex className="md:justify-between flex-col md:flex-row">
                                <TextInput
                                    name="parentalLeave"
                                    placeholder="Enter parental leave"
                                    label="Parental Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                                <TextInput
                                    name="sabbaticalLeave"
                                    placeholder="Sabbatical leave"
                                    label="Sabbatical Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                            </Flex>
                            <Flex className="md:justify-between flex-col md:flex-row">
                                <TextInput
                                    name="studyLeave"
                                    placeholder="Enter study Leave"
                                    label="Study Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                                <TextInput
                                    name="HajjAndUmrahLeave"
                                    placeholder="Enter religious leave"
                                    label="Hajj and Umrah/Religious Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                            </Flex>
                            <Flex className="md:justify-between flex-col md:flex-row">
                                <TextInput
                                    name="maternityLeave"
                                    placeholder="Enter maternity Leave"
                                    label="Maternity Leave"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                                <TextInput
                                    name="officialLeavesAndVacations"
                                    placeholder="Enter official leaves and vacations"
                                    label="Official Leaves and Vacations"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                            </Flex>
                            <Flex className="md:justify-between flex-col md:flex-row">
                                <TextInput
                                    name="otherPaidLeaves"
                                    placeholder="Enter other paid leaves"
                                    label="Other Paid Leaves"
                                    type="text"
                                    classes="w-full md:w-[18rem]"
                                    allowNumbersOnly
                                />
                                <TextInput
                                    name="eligibilityTimePeriod"
                                    placeholder="Enter leave eligibility time period"
                                    label="Leave Eligibility Time Period"
                                    type="text"
                                    classes="w-[18rem]"
                                    allowNumbersOnly
                                    showToolTip
                                    tooltipText="Enter the number of years (e.g., '1' for one year)."
                                />
                            </Flex>
                        </Flex>
                        <Button
                            className="px-12"
                            type="primary"
                            danger
                            htmlType="submit"
                            loading={isSubmitting}
                        >
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Flex>
    );
};

export default LeaveSummaryForm;
