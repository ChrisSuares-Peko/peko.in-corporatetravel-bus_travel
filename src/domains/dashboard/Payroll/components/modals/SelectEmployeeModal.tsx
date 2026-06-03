import { useState } from 'react';

import { Modal, Form, Button, Typography, Flex } from 'antd';
import { Formik } from 'formik';

import { useGetEmployee } from '../../hooks/dashboardHooks/useGetEmployeeApi';
import { selectEmployeeSchema } from '../../schema/bulkSchema';
import SelectInputCustom from '../EmployeeProfile/SelectInputCustom';

type BulkUploadModalProps = {
    open: boolean;
    handleCancel: () => void;
    onEmployeeSelect: (employeeData: any) => void;
};

const SelectEmployeeModal = ({ open, handleCancel, onEmployeeSelect }: BulkUploadModalProps) => {
    const { data, generateEmployeesDropdown } = useGetEmployee();

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>(''); // State to hold the search text

    const [form] = Form.useForm();
    const handleFormSubmit = async (values: any) => {};

    const onFinish = (values: any) => {
        // Process form values here, including the file
    };

    const onFileChange = (event: any) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name); // Update state with file name
            // Continue with your existing logic
        }
    };

    const handleUpload = async (values: any) => {
        const selectedFile = values.file;

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
    };

    return (
        <Modal
            title={
                <Flex justify="space-between" align="center">
                    <Typography.Text className="text-sm">Offboard Employee</Typography.Text>
                </Flex>
            }
            open={open}
            onCancel={handleCancel}
            footer={null} // Remove the footer from here
        >
            <Formik
                initialValues={{
                    employee: null,
                }}
                onSubmit={values => {
                    const selectedEmployee = data.find(emp => emp.id === values.employee);

                    if (selectedEmployee) {
                        onEmployeeSelect(selectedEmployee);
                    }
                }}
                validationSchema={selectEmployeeSchema}
            >
                {({ values, handleChange, isSubmitting, setFieldValue, errors, handleSubmit }) => (
                    <Form form={form} onFinish={onFinish} layout="vertical">
                        {' '}
                        {/* Add onSubmit handler to the Form component */}
                        <Flex vertical className=" mt-5">
                            <SelectInputCustom
                                isRequired
                                label="Select Employee"
                                name="employee"
                                placeholder="Select Employee"
                                options={generateEmployeesDropdown(data) || []}
                                onSearch={setSearchText}
                            />
                        </Flex>
                        <Flex gap={10}>
                            <Button
                                key="submit"
                                type="primary"
                                danger
                                htmlType="submit" // Specify htmlType as "submit"
                                onClick={() => handleSubmit()}
                                style={{ marginTop: '1rem' }} // Add some margin to separate it from the input
                            >
                                Submit
                            </Button>
                            <Button onClick={() => handleCancel()} style={{ marginTop: '1rem' }}>
                                Cancel
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default SelectEmployeeModal;
