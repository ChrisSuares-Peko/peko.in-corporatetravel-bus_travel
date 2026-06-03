import { useState } from 'react';

import { Flex, Form, Skeleton } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextAreaInput from '@components/atomic/inputs/TextAreaInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import DocumentUploadInput from '@src/domains/admin/hooks/DownloadUploadInput';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';

import useEdocAltering from '../../hooks/useEdocAltering';
import edocsSchema from '../../schema/edocsSchema';
import { Document, refresh } from '../../types/edocTypes';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Document;
};

const Edocmodal = ({ open, handleCancel, data, setRefresh }: DepartmentModalProps & refresh) => {
    const [file, setFile] = useState<any>('');
    const { createDoc, updateDoc, categoryData, isLoading } = useEdocAltering();
    const dispatch = useAppDispatch();
    return (
        <CustomModalWithForm
            isLoading={isLoading}
            modalTitle="Document Management"
            open={open}
            validationSchema={edocsSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: any;
                if (data) {
                    res = await updateDoc({
                        ...values,
                        categoryName: categoryData?.find(
                            item => item.value === values.categoryId?.toString()
                        )?.label,
                    });
                } else {
                    res = await createDoc({
                        ...values,
                        categoryName: categoryData?.find(
                            item => item.value === values.categoryId?.toString()
                        )?.label,
                    });
                }
                if (res.status === true) {
                    dispatch(
                        showToast({
                            description: `${res.message} `,
                            variant: 'success',
                        })
                    );
                    setRefresh(true);
                    handleCancel();
                }
                if (res.status === false) {
                    dispatch(
                        showToast({
                            description: `${res.message}`,
                            variant: 'error',
                        })
                    );
                }
            }}
            initialValues={{
                id: data?.id || '',
                categoryId: data?.categoryId.toString() || '',
                documentName: data?.documentName || '',
                description: data?.description || '',
                documentBase: data?.documentUrl || '',
            }}
        >
            <Flex vertical className="w-full ">
                <Form layout="vertical">
                    {categoryData ? (
                        <SelectInput
                            isRequired
                            name="categoryId"
                            options={categoryData}
                            placeholder="Please select a category"
                            label="Select Category"
                        />
                    ) : (
                        <Skeleton.Input active block />
                    )}
                    <TextInput
                        name="documentName"
                        label="Document Name"
                        type="text"
                        placeholder="Please enter document name "
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextAreaInput
                        name="description"
                        label="Description"
                        placeholder="please enter description"
                        isRequired
                    />
                    <DocumentUploadInput
                        existingFileUrl={data?.documentUrl}
                        isrequired
                        allowAll
                        // accept=".pdf"
                        label="Upload File"
                        name="documentBase"
                        setFile={setFile}
                        format="documentFormat"
                        showNotification
                        showFileName
                        maxFileSize={100 * 1024}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default Edocmodal;
