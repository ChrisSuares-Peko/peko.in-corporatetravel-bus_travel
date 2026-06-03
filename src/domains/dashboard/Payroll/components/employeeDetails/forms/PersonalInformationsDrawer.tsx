import React from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import useGeneralApi from '../../../hooks/employeeHooks/useGetCountry';
import { useUpdateEmployeeApiNew } from '../../../hooks/employeeHooks/useUpdateEmployeeApiNew';
import { editPersonalSchema } from '../../../schema/employeeProfile';
import { ExperienceInMonth, ExperienceInYear } from '../../../utils/ExperienceSelectData';

type Props = {
    open: boolean;
    handleCancel: () => void;
    setRefState: (num: number) => void;
    initialValues: {
        id: string;
        firstName: string;
        gender: string;
        dateOfBirth: string;
        phoneNumber: string;
        personalEmail: string;
        email: string;
        emergencyNo: string;
        emergencyContactName: string;
        emergencyContactRelation: string;
        nationality: string;
        qualification?: string;
        experienceInYear?: string;
        experienceInMonth?: string;
        maritialStatus?: string;
    };
};

const PersonalInformationsDrawer = ({ handleCancel, open, initialValues, setRefState }: Props) => {
    const { countriesList } = useGeneralApi();
    const { updateEmployeePersonalDetails } = useUpdateEmployeeApiNew();

    return (
        <CustomModalWithForm
            modalTitle="Personal Information"
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const personalInformations = {
                    id: initialValues.id,
                    employeeInformation: values,
                };

                const res = await updateEmployeePersonalDetails(personalInformations);
                if (res) setRefState(new Date().valueOf());
                handleCancel();
            }}
            initialValues={{
                fullName: initialValues?.firstName ?? '',
                dateOfBirth: initialValues?.dateOfBirth ?? '',
                // gender: formatGender(initialValues?.gender) ?? '',
                gender: initialValues?.gender ?? '',

                mobileNo: initialValues?.phoneNumber,
                personalEmail: initialValues?.personalEmail ?? '',
                email: initialValues?.email ?? '',
                emergencyNo: initialValues?.emergencyNo ?? '',
                emergencyContactName: initialValues?.emergencyContactName ?? '',
                emergencyContactRelation: initialValues?.emergencyContactRelation ?? '',
                nationality: initialValues?.nationality ?? '',
                qualification: initialValues?.qualification ?? '',
                experienceInYear: initialValues?.experienceInYear ?? '',
                experienceInMonth: initialValues?.experienceInMonth ?? '',
                maritialStatus: initialValues?.maritialStatus ?? '',
            }}
            validationSchema={editPersonalSchema}
            reinitialise
        >
            <Form layout="vertical" className="">
                <TextInput
                    name="fullName"
                    label="Full Name"
                    type="text"
                    placeholder="Enter Full Name"
                    classes="rounded-sm"
                    allowAlphabetsAndSpaceOnly
                    isRequired
                    maxLength={20}
                />
                <SelectInput
                    name="gender"
                    label="Gender"
                    placeholder="Select Gender"
                    classes="rounded-sm"
                    options={[
                        { value: 'MALE', label: 'Male' },
                        { value: 'FEMALE', label: 'Female' },
                    ]}
                    isRequired
                />
                <DatePickerInput
                    name="dateOfBirth"
                    label="Date Of Birth"
                    placeholder="Select Date Of Birth"
                    classes="rounded-sm"
                    maxDate={dayjs().subtract(18, 'year')}
                    isRequired
                />
                <TextInput
                    name="mobileNo"
                    label="Mobile Number"
                    type="text"
                    placeholder="Enter Mobile Number"
                    classes="rounded-sm"
                    allowNumbersOnly
                    isRequired
                    maxLength={10}
                />
                <TextInput
                    name="personalEmail"
                    label="Official Email"
                    type="text"
                    placeholder="Enter official email"
                    classes="rounded-sm"
                    isRequired
                />
                <TextInput
                    name="email"
                    label="Personal Email"
                    type="text"
                    placeholder="Enter personal email"
                    classes="rounded-sm"
                    isRequired
                />
                <SelectInputWithSearch
                    name="nationality"
                    label="Nationality"
                    placeholder="Select Nationality"
                    classes="rounded-sm"
                    options={countriesList ?? []}
                    isRequired
                />
                <TextInput
                    name="emergencyNo"
                    label="Emergency Contact Number"
                    type="text"
                    placeholder="Enter Emergency Contact Number"
                    classes="rounded-sm"
                    allowNumbersOnly
                    maxLength={10}
                />
                <TextInput
                    name="emergencyContactName"
                    label="Emergency Contact Name"
                    type="text"
                    placeholder="Enter Emergency Contact Name"
                    classes="rounded-sm"
                    allowAlphabetsAndSpaceOnly
                    maxLength={20}
                />
                <TextInput
                    name="emergencyContactRelation"
                    label="Emergency Contact Relation"
                    type="text"
                    placeholder="Enter Emergency Contact Relation"
                    classes="rounded-sm"
                    allowAlphabetsAndSpaceOnly
                    maxLength={20}
                />
                <TextInput
                    name="qualification"
                    label="Qualification"
                    type="text"
                    placeholder="Enter Qualification"
                    classes="rounded-sm"
                    maxLength={20}
                />
                <SelectInputWithSearch
                    name="experienceInYear"
                    label="Experience In Years"
                    placeholder="Enter Experience"
                    classes="rounded-sm"
                    options={ExperienceInYear ?? []}
                />
                <SelectInputWithSearch
                    name="experienceInMonth"
                    label="Experience In Months"
                    placeholder="Enter Experience"
                    classes="rounded-sm"
                    options={ExperienceInMonth ?? []}
                />

                <SelectInputWithSearch
                    name="maritialStatus"
                    label="Marital Status"
                    placeholder="Select Marital Status"
                    classes="rounded-sm"
                    options={[
                        { value: 'Single', label: 'Single' },
                        { value: 'Married', label: 'Married' },
                    ]}
                />
            </Form>
        </CustomModalWithForm>
    );
};

export default PersonalInformationsDrawer;
