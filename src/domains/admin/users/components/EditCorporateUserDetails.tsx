import { Flex, Form, Skeleton } from 'antd';
import dayjs from 'dayjs';

import UAEFlag from '@assets/svg/uaeflag.svg';
import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import SelectInput from '@components/atomic/inputs/SelectInput';
import SwitchInput from '@components/atomic/inputs/SwitchInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { DropDown } from '@customtypes/general';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import userSchema from '../schema/index';
import { Data, updateData } from '../types/corporateUserTypes';
import { formatUaeMobileNumber } from '../utils/systemUser';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Data;
    updateCorporateUserData: (payload: updateData) => Promise<boolean>;
    kycStatus: DropDown | undefined;
    packageData: DropDown | undefined;
};

const EditCorporateUserDetails = ({
    open,
    handleCancel,
    data,
    updateCorporateUserData,
    kycStatus,
    packageData,
}: DepartmentModalProps) => {
    const dispatch = useAppDispatch();

    return (
        <CustomModalWithForm
            modalTitle="Corporate User Management"
            open={open}
            handleCancel={handleCancel}
            validationSchema={userSchema}
            handleFormSubmit={async (values: updateData) => {
                // if (!values.tradeLicenseExpiry) delete values.tradeLicenseExpiry;
                // if (!values.trnExpiry) delete values.trnExpiry;
                if (!values.activity) delete values.activity;
                if (!values.trnNo) delete values.trnNo;
                if (!values.tradeLicenseNo) delete values.tradeLicenseNo;
                const updatedValues = {
                    ...values,
                    tradeLicenseExpiry: values.tradeLicenseExpiry || null,
                    trnExpiry: values.trnExpiry || null,
                };

                const res: boolean = await updateCorporateUserData(updatedValues);

                if (res === true) {
                    dispatch(
                        showToast({
                            description: `Corporate user info updated successfully`,
                            variant: 'success',
                        })
                    );
                    handleCancel();
                }
                if (res === false) {
                    dispatch(
                        showToast({
                            description: `Something went wrong while updating corporate user,Please try again later.`,
                            variant: 'error',
                        })
                    );
                }
            }}
            initialValues={{
                id: data?.credentialId,
                activity: data?.activity || '',
                city: data?.city || '',
                email: data?.email || '',
                kycStatus: data?.kycStatus || '',
                mobileNo: formatUaeMobileNumber(data?.mobileNo || ''),
                // packageId: data?.packageId.toString() || '',
                name: data?.name || '',
                designation: data?.designation || '',
                username: data?.credential.username || '',
                contactPersonName: data?.contactPersonName || '',
                tradeLicenseNo: data?.tradeLicenseNo || '',
                tradeLicenseExpiry: data?.tradeLicenseExpiry?.toString().split('T')[0] || '',
                trnNo: data?.trnNo || '',
                trnExpiry: data?.trnExpiry || '',
                passwordProtection: data?.credential?.passwordProtection !== 0,
            }}
        >
            <Flex vertical className="w-full ">
                <Form layout="vertical">
                    <TextInput
                        name="username"
                        label="Account ID"
                        type="text"
                        placeholder=""
                        classes=" rounded-sm"
                        isDisabled
                    />
                    <TextInput
                        name="contactPersonName"
                        label="Full Name"
                        type="text"
                        placeholder="Enter full name"
                        classes="rounded-sm"
                        isRequired
                        maxLength={50}
                    />
                    <TextInput
                        name="name"
                        label="Company Name"
                        type="text"
                        placeholder="Enter company name"
                        classes="rounded-sm"
                        isRequired
                        maxLength={50}
                    />
                    <TextInput
                        name="email"
                        label="Email ID"
                        type="text"
                        placeholder="Enter email address"
                        isRequired
                        classes="rounded-sm"
                        maxLength={50}
                    />
                    <TextInput
                        name="designation"
                        label="Designation"
                        type="text"
                        placeholder="Enter designation"
                        isRequired
                        classes="rounded-sm"
                        maxLength={50}
                    />
                    <TextInput
                        name="mobileNo"
                        label="Mobile Number"
                        type="text"
                        placeholder="Enter mobile number"
                        isRequired
                        classes="rounded-sm"
                        allowNumbersOnly
                        maxLength={10}
                        prefix={
                            <Flex
                                align="center"
                                gap={6}
                                className="h-full p-1 cursor-not-allowed border-e me-2"
                            >
                                <img src={UAEFlag} alt="" />
                                <p>+971</p>
                            </Flex>
                        }
                    />
                    <TextInput
                        name="city"
                        label="City"
                        type="text"
                        placeholder="Enter city"
                        isRequired
                        classes="rounded-sm"
                        maxLength={50}
                    />
                    <TextInput
                        name="activity"
                        label="Activity"
                        type="text"
                        placeholder="Enter activity"
                        classes="rounded-sm"
                        maxLength={50}
                    />
                    <TextInput
                        name="tradeLicenseNo"
                        label="Trade License No"
                        type="text"
                        placeholder="Enter trade license number"
                        classes="rounded-sm"
                    />
                    <DatePickerInput
                        name="tradeLicenseExpiry"
                        label="Trade License Expiry"
                        placeholder="Select trade license expiry"
                        classes="rounded-sm w-full"
                        minDate={dayjs(new Date())}
                    />
                    <TextInput
                        name="trnNo"
                        label="TRN Certificate Number"
                        type="text"
                        placeholder="Enter TRN certificate number"
                        classes="rounded-sm"
                    />
                    <DatePickerInput
                        name="trnExpiry"
                        label="TRN Number Expiry"
                        placeholder="Select TRN number expiry"
                        classes="rounded-sm w-full"
                        minDate={dayjs(new Date())}
                    />
                    {kycStatus ? (
                        <SelectInput
                            isRequired
                            name="kycStatus"
                            options={kycStatus}
                            placeholder="Please update Kyc status"
                            label="KYC status"
                        />
                    ) : (
                        <Skeleton.Input active block />
                    )}
                    {/* {packageData ? (
                        <SelectInput
                            isRequired
                            name="packageId"
                            options={packageData}
                            placeholder="Please select a package"
                            label="Package"
                        />
                    ) : (
                        <Skeleton.Input active block />
                    )} */}
                    <SwitchInput label="Enable Password Protection" name="passwordProtection" />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default EditCorporateUserDetails;
