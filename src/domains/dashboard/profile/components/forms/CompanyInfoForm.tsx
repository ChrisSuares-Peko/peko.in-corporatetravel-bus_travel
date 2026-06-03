import { useEffect, useState } from 'react';

import { Flex, Form } from 'antd';
import dayjs from 'dayjs';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import FileUploadInput from '@components/atomic/inputs/FileUploadInput';
import TextInput from '@components/atomic/inputs/TextInput';

interface CompanyInfoFormProps {
    activities: any[];
    values: any;
}

const CompanyInfoForm = ({ activities, values }: CompanyInfoFormProps) => {
    const [_, setFile] = useState<any>('');

    useEffect(() => {
        if (!values.tradeLicenseNo) {
            values.tradeLicenseExpiry = '';
        }
        if (!values.trnNo) {
            values.trnExpiry = '';
        }
    }, [values]);
    return (
        <Flex vertical className="mt-6 w-full">
            <Form layout="vertical">
                <TextInput
                    name="activity"
                    label="Activity"
                    placeholder="Select Activity"
                    classes="rounded-sm"
                    type="text"
                    allowAlphabetsAndSpaceOnly
                />
                <TextInput
                    name="tradeLicenseNo"
                    label="Trade License Number"
                    type="text"
                    placeholder="Enter Trade License Number"
                    classes=" rounded-sm "
                    maxLength={10}
                />
                <DatePickerInput
                    isDisabled={values.tradeLicenseNo === '' && true}
                    name="tradeLicenseExpiry"
                    label="Trade License Expiry"
                    placeholder="Enter Trade License Expiry"
                    classes="w-full"
                    minDate={dayjs(new Date())}
                />
                <TextInput
                    name="trnNo"
                    label="TRN Certificate Number"
                    type="text"
                    placeholder="Enter TRN Certificate Number"
                    classes=" rounded-sm "
                    maxLength={15}
                />
                <DatePickerInput
                    name="trnExpiry"
                    label="TRN Number Expiry Date"
                    isDisabled={values.trnNo === '' && true}
                    placeholder="Enter TRN Number Expiry Date"
                    classes="w-full"
                    minDate={dayjs(new Date())}
                />
                <FileUploadInput
                    label="Upload Trade License"
                    name="tradeLicenseDoc"
                    setFile={setFile}
                    format="trdLcnFormat"
                    showFileName
                    defaultFileName="Trade License"
                    allowedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
                />
                <FileUploadInput
                    label="Upload TRN Certificate"
                    name="trnCertificate"
                    setFile={setFile}
                    format="trnCertFormat"
                    showFileName
                    defaultFileName="TRN Certificate"
                    allowedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
                />
                <FileUploadInput
                    label="Upload Owner Emirates ID"
                    name="eidDoc"
                    setFile={setFile}
                    format="eidDocFormat"
                    showFileName
                    defaultFileName="EID"
                    allowedFileTypes={['image/png', 'image/jpeg', 'application/pdf']}
                />
            </Form>
        </Flex>
    );
};

export default CompanyInfoForm;
