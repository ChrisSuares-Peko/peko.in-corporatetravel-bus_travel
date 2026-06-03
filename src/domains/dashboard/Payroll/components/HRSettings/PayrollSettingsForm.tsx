import React, { useState } from 'react';

import { Alert, Button, Flex, Form, Skeleton, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import dayjs from 'dayjs';
import { Formik } from 'formik';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import ConfirmationModal from '@components/molecular/modals/ConfirmationModal';
import ShowFile from '@components/molecular/viewFiles/ShowFile';

import useSettingsApi from '../../hooks/HrSettings/useSettingsApi';
import { payrollSettingsSchema } from '../../schema/hrSettings';

const weekdayOptions = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' },
];

type LeaveFormProps = {
    setActiveTabKey: any;
};

const PayrollSettingsForm: React.FC<LeaveFormProps> = ({ setActiveTabKey }) => {
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [deletingDocName, setDeletingDocName] = useState('');
    const { postPayrollSetting, payrollData, handleDeleteDocs, isLoading } = useSettingsApi();
    const { payrollSettings, officialDocuments } = payrollData || {};
    const { organizationWorkingDays, salaryCycleDay, payrollStartsFrom, selectedWeekdaysCount } =
        payrollSettings || {};
    function isPastDate(dateString?: string) {
        if (!dateString) {
            return false;
        }
        const givenDate = dayjs(dateString);
        const currentDate = dayjs();
        return givenDate.isBefore(currentDate);
    }

    return isLoading ? (
        <Skeleton />
    ) : (
        <Flex vertical gap={20} className="pt-6">
            <Flex>
                <Alert
                    message="Note: Pay Schedule cannot be edited once you process the first pay run."
                    type="warning"
                    showIcon
                />
            </Flex>
            <Formik
                initialValues={{
                    organizationWorkingDays: organizationWorkingDays || '',
                    salaryCycleDay: salaryCycleDay || '',
                    payrollStartsFrom: payrollStartsFrom || '',
                    hrManagerName: officialDocuments?.hrManagerName || '',
                    establishmentId: officialDocuments?.establishmentId || '',
                    hrManagerSignature: officialDocuments?.hrManagerSignature || '',
                    companyOfficialStamp: officialDocuments?.companyOfficialStamp || '',
                    signatureFormat: '',
                    companyOfficialFormat: '',

                    selectedWeekdaysCount: selectedWeekdaysCount || [],
                }}
                enableReinitialize
                validationSchema={payrollSettingsSchema}
                onSubmit={async (values, { resetForm }) => {
                    await postPayrollSetting(values);

                    setActiveTabKey('2');
                }}
            >
                {({ handleSubmit, isSubmitting, setFieldValue }) => (
                    <Form onFinish={handleSubmit} layout="vertical">
                        <Flex vertical>
                            <Flex vertical gap={17} className="w-full md:w-[20rem]">
                                <Typography.Text className="font-medium">
                                    Calculate monthly salary based on
                                </Typography.Text>
                                <SelectInput
                                    name="organizationWorkingDays"
                                    placeholder="Select total working days"
                                    options={Array.from({ length: 30 }, (_, i) => ({
                                        id: i + 1,
                                        value: i + 1,
                                    }))}
                                    isRequired
                                    label="No. of working days in a month"
                                    isDisabled={!!organizationWorkingDays}
                                    showSearch
                                />

                                <SelectInputWithSearch
                                    name="selectedWeekdaysCount"
                                    options={weekdayOptions}
                                    placeholder="Select week days"
                                    label="Working days in a week"
                                    mode="multiple"
                                    isRequired
                                    isDisabled={!!selectedWeekdaysCount}
                                />
                            </Flex>
                            <Flex vertical gap={17} className="w-full md:w-[20rem] mt-6">
                                <SelectInput
                                    name="salaryCycleDay"
                                    placeholder="Select day of the month"
                                    options={Array.from({ length: 31 }, (_, i) => ({
                                        id: i + 1,
                                        value: i + 1,
                                    }))}
                                    label="Pay your employees on"
                                    isRequired
                                    isDisabled={!!salaryCycleDay}
                                    showSearch
                                    showToolTip
                                    tooltipText="This is only for recording purpose required for salary calculation."
                                />
                            </Flex>

                            <DatePickerInput
                                name="payrollStartsFrom"
                                placeholder="Select date"
                                classes="w-full md:w-[20rem]"
                                label="Start Your First Payroll From"
                                isRequired
                                isDisabled={isPastDate(payrollStartsFrom)}
                                needConfirm={false}
                            />
                            <Flex vertical>
                                <Typography.Text className="font-medium pb-5 w-full">
                                    Organization Info
                                </Typography.Text>
                                <TextInput
                                    name="establishmentId"
                                    placeholder="Enter establishment id"
                                    label="Establishment ID"
                                    type="text"
                                    isRequired
                                    classes="w-full md:w-[20rem]"
                                    allowNumbersOnly
                                    minLength={12}
                                    maxLength={12}
                                />
                            </Flex>
                            <Flex vertical>
                                <Typography.Text className="font-medium pb-5 w-full">
                                    Official Documents
                                </Typography.Text>
                                <TextInput
                                    name="hrManagerName"
                                    placeholder="Enter name"
                                    label="HR Manager Name"
                                    type="text"
                                    isRequired
                                    classes="w-full md:w-[20rem]"
                                    allowAlphabetsAndSpaceOnly
                                    minLength={3}
                                />
                                {!officialDocuments?.companyOfficialStamp && (
                                    <FileUploadInput
                                        name="companyOfficialStamp"
                                        label="Company Stamp"
                                        format="companyOfficialFormat"
                                        showNotification
                                        showFileName
                                        allowedFileTypes={['image/png']}
                                        isRequired
                                        classes="w-80"
                                    />
                                )}
                                {!officialDocuments?.hrManagerSignature && (
                                    <FileUploadInput
                                        name="hrManagerSignature"
                                        label="HR Signature"
                                        format="signatureFormat"
                                        showNotification
                                        showFileName
                                        allowedFileTypes={['image/png']}
                                        isRequired
                                        classes="w-80"
                                    />
                                )}
                                {officialDocuments && (
                                    <Content className="w-full md:w-[20rem]">
                                        {officialDocuments?.companyOfficialStamp && (
                                            <ShowFile
                                                fileName="Company Stamp"
                                                label="Company Stamp"
                                                link={officialDocuments.companyOfficialStamp}
                                                handleDeleteDocs={() => {
                                                    setDeletingDocName('companyOfficialStamp');
                                                    setOpenConfirmationModal(true);
                                                }}
                                            />
                                        )}
                                        {officialDocuments?.hrManagerSignature && (
                                            <ShowFile
                                                fileName="HR Signature"
                                                label="HR Signature"
                                                link={officialDocuments.hrManagerSignature}
                                                handleDeleteDocs={() => {
                                                    setDeletingDocName('hrManagerSignature');
                                                    setOpenConfirmationModal(true);
                                                }}
                                            />
                                        )}
                                    </Content>
                                )}
                            </Flex>
                        </Flex>
                        <Button
                            className="px-12 mt-5"
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
            <ConfirmationModal
                isOpen={openConfirmationModal}
                handleCancel={() => setOpenConfirmationModal(false)}
                title="Are you sure you want to delete this document?"
                handleSubmit={async () => {
                    await handleDeleteDocs(deletingDocName);
                    setOpenConfirmationModal(false);
                }}
                isLoading={isLoading}
            />
        </Flex>
    );
};

export default PayrollSettingsForm;
