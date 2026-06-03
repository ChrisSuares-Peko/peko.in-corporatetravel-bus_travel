import React, { useState } from 'react';

import { Button, Form, Skeleton } from 'antd';
import { Formik } from 'formik';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import TextInput from '@components/atomic/inputs/TextInput';

import useSettingsApi from '../../hooks/HrSettings/useSettingsApi';
import { wpsSettingsSchema } from '../../schema/hrSettings';

const WpsSettingsForm: React.FC = () => {
    const { postWPSSetting, wpsData, isLoading } = useSettingsApi();
    const [isFreeZoneCompany, setIsFreeZoneCompany] = useState(wpsData?.isFreeZoneCompany || false);

    return isLoading ? (
        <Skeleton />
    ) : (
        <Formik
            initialValues={{
                employerId: wpsData?.employerId || '',
                employerRoutingCode: wpsData?.employerRoutingCode || '',
                employerReference: wpsData?.employerReference || '',
                isFreeZoneCompany,
            }}
            enableReinitialize
            validationSchema={wpsSettingsSchema(isFreeZoneCompany)}
            onSubmit={async values => {
                await postWPSSetting(values);
            }}
        >
            {({ handleSubmit, isSubmitting, values }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <CheckboxInput
                        name="isFreeZoneCompany"
                        onChange={e => setIsFreeZoneCompany(e.target.checked)}
                    >
                        Mark the checkbox if your company is registered in freezone
                    </CheckboxInput>
                    <TextInput
                        name="employerId"
                        placeholder="Enter employer ID"
                        label="Add Employer ID"
                        type="text"
                        classes="w-full md:w-[18rem]"
                        isRequired
                        showToolTip
                        allowNumbersOnly
                        isDisabled={values.isFreeZoneCompany}
                    />
                    <TextInput
                        name="employerRoutingCode"
                        placeholder="Enter Routing Code"
                        label="Employer Routing Code"
                        type="text"
                        classes="w-full md:w-[18rem]"
                        isRequired
                        showToolTip
                        allowAlphabetsAndNumbersOnly
                        isDisabled={values.isFreeZoneCompany}
                    />
                    <TextInput
                        name="employerReference"
                        placeholder="Enter Employer Reference"
                        label="Employer Reference "
                        type="text"
                        classes="w-full md:w-[18rem]"
                        isRequired
                        showToolTip
                        allowAlphabetsAndNumbersOnly
                        isDisabled={values.isFreeZoneCompany}
                    />
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
    );
};

export default WpsSettingsForm;
