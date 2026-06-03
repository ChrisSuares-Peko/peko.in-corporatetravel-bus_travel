import { FC } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Form, Flex, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Formik, FieldArray, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

import { Step2Schema } from '../../../schema/index';
import { Step2Types } from '../../../types/types';
import FormHeader from '../FormHeader';

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    totalSteps: number;
    btnLoading: boolean;
    handleFormSubmit: (key: number, data: any, save?: boolean) => void;
    step2Data: Step2Types | undefined;
    fisicalYear: number;
}

interface ownerNameAndShares {
    ownerName: string;
    ownerShares: string;
}

interface StepFormValues {
    tradeLicenceName: string;
    tradeLicenceNumber: string;
    tradeLicenseAuthority: string;
    emailAddress: string;
    ownerNameAndShares: ownerNameAndShares[];
    contactNumber: string;
    officeRegisteredAddress: string;
    financialYearStartDate: string | null;
    financialYearEndDate: string | null;
    revenueEarnedPrevFY: string;
    authorizedPersonName: string;
    uaeEntityShareResident: string;
    uaeEntityShareForeign: string;
    connectedPartiesTradeLicenses: string;
}

const Step2: FC<StepsProps> = ({
    current,
    setCurrent,
    totalSteps,
    btnLoading,
    handleFormSubmit,
    step2Data,
    fisicalYear,
}) => {
    const handleSave = (values: any) => {
        handleFormSubmit(2, values, true);
    };
    // Function to generate initial form values
    const getInitialValues = (): StepFormValues => ({
        tradeLicenceName: step2Data?.tradeLicenceName || '',
        tradeLicenceNumber: step2Data?.tradeLicenceNumber || '',
        tradeLicenseAuthority: step2Data?.tradeLicenseAuthority || '',
        emailAddress: step2Data?.emailAddress || '',
        ownerNameAndShares: step2Data?.ownerNameAndShares || [{ ownerName: '', ownerShares: '' }],
        contactNumber: step2Data?.contactNumber || '',
        officeRegisteredAddress: step2Data?.officeRegisteredAddress || '',
        financialYearStartDate: step2Data?.financialYearStartDate || null,
        financialYearEndDate: step2Data?.financialYearEndDate || null,
        revenueEarnedPrevFY: step2Data?.revenueEarnedPrevFY || '',
        authorizedPersonName: step2Data?.authorizedPersonName || '',
        uaeEntityShareResident: step2Data?.uaeEntityShareResident || '',
        uaeEntityShareForeign: step2Data?.uaeEntityShareForeign || '',
        connectedPartiesTradeLicenses: step2Data?.connectedPartiesTradeLicenses || '',
    });

    return (
        <Formik<StepFormValues>
            initialValues={getInitialValues()}
            validationSchema={Step2Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                handleFormSubmit(2, values);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title="General Information about Entity:"
                        />

                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="1.Trade Licence Name"
                                    placeholder="Enter Trade Licence Name"
                                    type="text"
                                    isRequired
                                    name="tradeLicenceName"
                                />
                            </Col>

                            <Col xs={24} md={12}>
                                <TextInput
                                    label="2.Trade Licence Number"
                                    placeholder="Enter Trade Licence Number"
                                    name="tradeLicenceNumber"
                                    type="text"
                                    isRequired
                                />
                            </Col>
                        </Row>
                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="3.Trade License Authority"
                                    placeholder="Enter Trade License Authority"
                                    type="text"
                                    isRequired
                                    name="tradeLicenseAuthority"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="4.Email address"
                                    placeholder="Enter Email address"
                                    type="text"
                                    isRequired
                                    name="emailAddress"
                                />
                            </Col>
                            <Col xs={24} className="w-full">
                                <FieldArray name="ownerNameAndShares">
                                    {({ push, remove }) => (
                                        <Flex vertical>
                                            {values.ownerNameAndShares.map((owner, index) => (
                                                <Row
                                                    key={index}
                                                    style={{
                                                        marginLeft: '0 !important',
                                                        marginRight: '0 !important',
                                                        marginTop: index > 0 ? '1rem' : 0,
                                                    }}
                                                    className={`relative border-2 border-gray-150 rounded-lg py-4 w-full `}
                                                    gutter={[20, 20]}
                                                >
                                                    <Col xs={24} md={12}>
                                                        <TextInput
                                                            label={`Owner's Name ${index + 1}`}
                                                            placeholder={`Enter Owner's Name ${index + 1}`}
                                                            type="text"
                                                            isRequired
                                                            name={`ownerNameAndShares[${index}].ownerName`}
                                                        />
                                                        <ErrorMessage
                                                            name={`ownerNameAndShares[${index}].ownerName`}
                                                            render={msg => (
                                                                <div className="error-message -mt-6 text-red-500">
                                                                    {msg}
                                                                </div>
                                                            )}
                                                        />
                                                    </Col>

                                                    <Col xs={24} md={12}>
                                                        <TextInput
                                                            label={`Owner's Share ${index + 1}`}
                                                            placeholder={`Enter Owner's Share ${index + 1}`}
                                                            name={`ownerNameAndShares[${index}].ownerShares`}
                                                            type="text"
                                                            isRequired
                                                            allowNumbersOnly
                                                        />
                                                        <ErrorMessage
                                                            name={`ownerNameAndShares[${index}].ownerShares`}
                                                            render={msg => (
                                                                <div className="error-message -mt-6 text-red-500">
                                                                    {msg}
                                                                </div>
                                                            )}
                                                        />
                                                    </Col>

                                                    <DeleteOutlined
                                                        data-testid={`delete-item-${index}`}
                                                        onClick={() => remove(index)}
                                                        className={`text-xl absolute right-4 cursor-pointer text-bgOrange2 ${index === 0 ? 'invisible' : ''}`}
                                                    />
                                                </Row>
                                            ))}
                                            <Row className="w-full">
                                                <Col xs={24} md={24} className="">
                                                    <Button
                                                        className="mt-5"
                                                        danger
                                                        size="small"
                                                        onClick={() =>
                                                            push({ ownerName: '', ownerShare: '' })
                                                        }
                                                    >
                                                        Add New Owner
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Flex>
                                    )}
                                </FieldArray>
                            </Col>
                        </Row>

                        <Row className="mt-6 w-full" gutter={[20, 20]}>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="5.Contact number"
                                    placeholder="Enter Contact number"
                                    type="text"
                                    allowNumbersOnly
                                    isRequired
                                    name="contactNumber"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="6.Office Registered Address"
                                    placeholder="Enter address"
                                    type="text"
                                    isRequired
                                    name="officeRegisteredAddress"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="7.Financial Year starting date" required>
                                    <DatePicker
                                        name="financialYearStartDate"
                                        format="YYYY-MM-DD"
                                        placeholder="Select date"
                                        value={
                                            values.financialYearStartDate
                                                ? dayjs(values.financialYearStartDate, 'YYYY-MM-DD')
                                                : null
                                        }
                                        onChange={(_date, dateString) => {
                                            setFieldValue('financialYearStartDate', dateString);
                                        }}
                                    />
                                </Form.Item>
                                <ErrorMessage
                                    name="financialYearStartDate"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item label="8.Financial Year ending date" required>
                                    <DatePicker
                                        name="financialYearEndDate"
                                        format="YYYY-MM-DD"
                                        placeholder="Select date"
                                        value={
                                            values.financialYearEndDate
                                                ? dayjs(values.financialYearEndDate, 'YYYY-MM-DD')
                                                : null
                                        }
                                        onChange={(_date, dateString) => {
                                            setFieldValue('financialYearEndDate', dateString);
                                        }}
                                    />
                                </Form.Item>
                                <ErrorMessage
                                    name="financialYearEndDate"
                                    render={msg => <div className="text-red-500 -mt-5">{msg}</div>}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label={`9.Revenue Earned during FY ${fisicalYear - 1}`}
                                    placeholder={`Enter Revenue Earned during FY  ${fisicalYear - 1}`}
                                    type="text"
                                    allowNumbersOnly
                                    isRequired
                                    name="revenueEarnedPrevFY"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="10.Name of authorized person"
                                    placeholder="Enter Name of authorized person"
                                    type="text"
                                    isRequired
                                    name="authorizedPersonName"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="11.UAE entity's share in UAE resident company"
                                    placeholder="Enter UAE entity's share in UAE resident company"
                                    type="text"
                                    allowNumbersOnly
                                    isRequired
                                    name="uaeEntityShareResident"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="12.UAE entity's share in foreign resident company"
                                    placeholder="Enter UAE entity's share in foreign resident company"
                                    type="text"
                                    allowNumbersOnly
                                    isRequired
                                    name="uaeEntityShareForeign"
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <TextInput
                                    label="13.Trade licenses of Connected parties"
                                    placeholder="Enter Trade licenses of Connected parties"
                                    type="text"
                                    isRequired
                                    name="connectedPartiesTradeLicenses"
                                />
                            </Col>
                        </Row>
                    </Flex>

                    <Flex className="justify-start gap-10 mt-8">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(current - 1)}
                        >
                            Back
                        </Button>
                        <Button
                            type="default"
                            className="md:w-32 xs:w-36"
                            danger
                            onClick={() => {
                                handleSave(values);
                            }}
                            loading={btnLoading}
                        >
                            Save
                        </Button>
                        <Button
                            type="primary"
                            className="md:w-32 xs:w-36"
                            danger
                            htmlType="submit"
                            loading={btnLoading}
                        >
                            Next
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default Step2;
