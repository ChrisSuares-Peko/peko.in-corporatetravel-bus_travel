import { useState } from 'react';

import { Flex, Form } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import DocumentUploadInput from '@src/domains/admin/hooks/DownloadUploadInput';
import TextAreaComponent from '@src/domains/dashboard/Invoice/forms/TextAreaComponent';

import { ESRSchema } from '../../schema/esrSchema';
import { ESRModalData } from '../../types/ESR';
import { selectData } from '../../utils/ESRData';

type DepartmentModalProps = {
    open: boolean;
    isLoading: boolean;
    handleCancel: () => void;
    data?: ESRModalData;
    updateESR: (payloadData: ESRModalData) => Promise<boolean>;
};

const UpdateModal = ({ open, handleCancel, data, updateESR, isLoading }: DepartmentModalProps) => {
    const [file, setFile] = useState<any>('');
    return (
        <CustomModalWithForm
            modalTitle="Peko Connect Management"
            open={open}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const res = await updateESR(values);
                if (res) {
                    handleCancel();
                }
            }}
            validationSchema={ESRSchema}
            initialValues={{
                stageId: data?.stageId || '',
                status: data?.status || '',
                remarks: data?.remarks || '',
                certificate: data?.certificate || '',
                stageNo: data?.stageNo || '',
            }}
        >
            {({ values }) => (
                <Flex vertical className="w-full ">
                    <Form layout="vertical">
                        <SelectInput
                            isRequired
                            name="status"
                            options={selectData}
                            placeholder="Please update the status"
                            label="Update Status"
                        />
                        {values?.status === 'Completed' && (
                            <DocumentUploadInput
                                existingFileUrl={data?.certificate}
                                allowAll
                                label="Upload File"
                                name="certificate"
                                setFile={setFile}
                                format="certificateFormat"
                                showNotification
                                showFileName
                                maxFileSize={100 * 1024}
                            />
                        )}
                        <TextAreaComponent
                            name="remarks"
                            label="Remarks"
                            placeholder="Enter your remark"
                            size="large"
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};
export default UpdateModal;
