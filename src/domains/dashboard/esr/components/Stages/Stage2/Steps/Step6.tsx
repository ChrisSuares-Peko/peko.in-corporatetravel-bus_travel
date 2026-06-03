import type { FC } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Row, Form, Grid, Flex, Typography, Radio } from 'antd';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';

import TextInput from '@components/atomic/inputs/TextInput';

// import FormHeader from '../../FormHeader';

const { useBreakpoint } = Grid;
const { Title, Paragraph } = Typography;

interface StepsProps {
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<any>>;
    btnLoading: boolean;
}
interface CompanyInfo {
    name: string;
    taxIdentificationNumber: string;
    address: string;
    countryOfTaxResidence: string;
}
interface uboList {
    uboType: string;
    name: string;
    taxIdentificationNumber: string;
    address: string;
    countryOfTaxResidence: string;
}

interface StepFormValues {
    parentCompany: CompanyInfo;
    ultimateParentCompany: CompanyInfo;
    uboGeneralInfo: string;
    uboList: uboList[];
}

const Step6: FC<StepsProps> = ({ setCurrent, setFormSubmitData, btnLoading }) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    const initialValues: StepFormValues = {
        parentCompany: {
            name: '',
            taxIdentificationNumber: '',
            address: '',
            countryOfTaxResidence: '',
        },
        ultimateParentCompany: {
            name: '',
            taxIdentificationNumber: '',
            address: '',
            countryOfTaxResidence: '',
        },
        uboGeneralInfo: '',
        uboList: [
            {
                uboType: '',
                name: '',
                taxIdentificationNumber: '',
                address: '',
                countryOfTaxResidence: '',
            },
        ],
    };

    return (
        <Formik<StepFormValues>
            initialValues={initialValues}
            // validationSchema={Stage2Step6Schema}
            onSubmit={values => {
                console.log('Form Values:', values);
                setFormSubmitData((prev: any) => ({
                    ...prev,
                    answers: values,
                    isCompleted: false,
                }));
                // setFormSubmitData(values);
                setCurrent(6);
            }}
            enableReinitialize
        >
            {({ handleSubmit, values, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex vertical gap={3}>
                        {/* Section 1: Parent Company */}
                        <Flex
                            vertical
                            className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                        >
                            {/* <FormHeader step="6" title="Ownership information" /> */}
                            <Title level={5} style={{ fontSize: '14px' }}>
                                Ownership information
                            </Title>
                            <Title level={5}>1. Parent Company</Title>
                            <Paragraph>
                                The Parent Company of the Licensee is the entity that directly:
                                <br />
                                (a) holds a majority of voting rights in the Licensee; or
                                <br />
                                (b) has the right to appoint or remove a majority of the boards of
                                directors of the Licensee; or
                                <br />
                                (c) controls alone, pursuant to a joint arrangement with other
                                shareholders or members, a majority of the voting rights in the
                                Licensee; or
                                <br />
                                (d) has the right to exercise, or actually exercises, dominant
                                direct influence or control over the Licensee.
                            </Paragraph>

                            <Row className="mt-6 w-full" gutter={value}>
                                <Col xs={24} md={12}>
                                    <Field name="parentCompany.name">
                                        {({ field }: any) => (
                                            <Form.Item label="1.1 Name" required>
                                                <TextInput
                                                    // {...field}
                                                    placeholder="Enter Name"
                                                    isRequired
                                                    allowAlphabetsOnly
                                                    name="parentCompany.name"
                                                    type="text"
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="parentCompany.name"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <Field name="parentCompany.taxIdentificationNumber">
                                        {({ field }: any) => (
                                            <Form.Item
                                                label="1.2 Tax Identification Number"
                                                required
                                            >
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Identification Number"
                                                    isRequired
                                                    allowNumbersOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="parentCompany.taxIdentificationNumber"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-6 w-full" gutter={value}>
                                <Col xs={24} md={12}>
                                    <Field name="parentCompany.address">
                                        {({ field }: any) => (
                                            <Form.Item label="1.3 Address" required>
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Address"
                                                    isRequired
                                                    allowAlphabetsSpaceAndNumbersOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="parentCompany.address"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <Field name="parentCompany.countryOfTaxResidence">
                                        {({ field }: any) => (
                                            <Form.Item label="1.4 Country Of Residence" required>
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Country Of Residence"
                                                    isRequired
                                                    allowAlphabetsOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="parentCompany.countryOfTaxResidence"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                            </Row>

                            {/* Section 2: Ultimate Parent Company */}

                            {/* <FormHeader step="6" title="Ownership information" /> */}
                            <Title level={5} style={{ fontSize: '14px' }}>
                                Ownership information
                            </Title>
                            <Title level={5}>2. Ultimate Parent Company</Title>
                            <Paragraph>
                                The Ultimate Parent Company of the Licensee is an entity of a group
                                that:
                                <br />
                                (a) owns directly or indirectly a sufficient interest in the
                                Licensee such that it is required to prepare consolidated financial
                                statements under applicable accounting standards or would be so
                                required if its equity interests were traded on a public securities
                                exchange in its jurisdiction of tax residence; and
                                <br />
                                (b) there is no other entity in the group that owns directly or
                                indirectly a sufficient interest in such entity such that it is
                                required to prepare consolidated financial statements under
                                applicable accounting standards, or would be so required if its
                                equity interests were traded on a public securities exchange in its
                                jurisdiction of tax residence.
                            </Paragraph>

                            <Row className="mt-6 w-full" gutter={value}>
                                <Col xs={24} md={12}>
                                    <Field name="ultimateParentCompany.name">
                                        {({ field }: any) => (
                                            <Form.Item label="2.1 Name" required>
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Name"
                                                    isRequired
                                                    allowAlphabetsOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ultimateParentCompany.name"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <Field name="ultimateParentCompany.taxIdentificationNumber">
                                        {({ field }: any) => (
                                            <Form.Item
                                                label="2.2 Tax Identification Number"
                                                required
                                            >
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Identification Number"
                                                    isRequired
                                                    allowNumbersOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ultimateParentCompany.taxIdentificationNumber"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-6 w-full" gutter={value}>
                                <Col xs={24} md={12}>
                                    <Field name="ultimateParentCompany.address">
                                        {({ field }: any) => (
                                            <Form.Item label="2.3 Address" required>
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Address"
                                                    isRequired
                                                    allowAlphabetsSpaceAndNumbersOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ultimateParentCompany.address"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                                <Col xs={24} md={12}>
                                    <Field name="ultimateParentCompany.countryOfTaxResidence">
                                        {({ field }: any) => (
                                            <Form.Item label="2.4 Country Of Residence" required>
                                                <TextInput
                                                    {...field}
                                                    placeholder="Enter Country Of Residence"
                                                    isRequired
                                                    allowAlphabetsOnly
                                                />
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="ultimateParentCompany.countryOfTaxResidence"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>
                            </Row>

                            {/* Section 3: Ultimate Beneficial Owner */}

                            {/* <FormHeader step="6" title="Ownership information" /> */}
                            <Title level={5} style={{ fontSize: '14px' }}>
                                Ownership information
                            </Title>

                            <Title level={5}>3. Ultimate Beneficial Owner</Title>
                            <Paragraph>
                                The Ultimate Beneficial Owner of the Licensee is an individual who
                                owns directly or indirectly twenty five percent (25%) or more of the
                                share capital of a Licensee. A Licensee may have one or more
                                Ultimate Beneficial Owners.
                            </Paragraph>

                            <Row className="mt-6 w-full" gutter={value}>
                                <Col xs={24} md={12}>
                                    <Field name="uboGeneralInfo">
                                        {({ field }: any) => (
                                            <Form.Item
                                                label="Is there an individual who owns directly or indirectly twenty five percent (25%) or more of the share capital of a Licensee?"
                                                required
                                            >
                                                <Radio.Group
                                                    {...field}
                                                    value={values.uboGeneralInfo}
                                                    onChange={e =>
                                                        setFieldValue(
                                                            'uboGeneralInfo',
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <Radio value="yes">Yes</Radio>
                                                    <Radio value="no">No</Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        )}
                                    </Field>
                                    <ErrorMessage
                                        name="uboGeneralInfo"
                                        render={msg => (
                                            <div className="text-red-500 -mt-5">{msg}</div>
                                        )}
                                    />
                                </Col>

                                {/* Branch details */}
                                <Flex vertical gap={4} className="ps-4">
                                    <FieldArray name="uboList">
                                        {({ push, remove }) => (
                                            <>
                                                {values.uboGeneralInfo === 'yes' &&
                                                    values.uboList.map((_, index) => (
                                                        <Flex
                                                            key={index}
                                                            vertical
                                                            className="mt-4 w-full"
                                                        >
                                                            <Row className="relative border-2 border-gray-150 rounded-lg p-4 w-full">
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].uboType`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="UBO Type"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter UBO Type"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].uboType`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-5">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].name`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Name"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Name"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].name`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-5">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].taxIdentificationNumber`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Tax Identification Number"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Identification Number"
                                                                                    isRequired
                                                                                    allowNumbersOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].taxIdentificationNumber`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-5">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].address`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Address"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Address"
                                                                                    isRequired
                                                                                    allowAlphabetsSpaceAndNumbersOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].address`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-5">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <Col xs={24} md={12}>
                                                                    <Field
                                                                        name={`uboList[${index}].countryOfTaxResidence`}
                                                                    >
                                                                        {({ field }: any) => (
                                                                            <Form.Item
                                                                                label="Country of Residence"
                                                                                required
                                                                            >
                                                                                <TextInput
                                                                                    {...field}
                                                                                    placeholder="Enter Country of Residence"
                                                                                    isRequired
                                                                                    allowAlphabetsOnly
                                                                                />
                                                                            </Form.Item>
                                                                        )}
                                                                    </Field>
                                                                    <ErrorMessage
                                                                        name={`uboList[${index}].countryOfTaxResidence`}
                                                                        render={msg => (
                                                                            <div className="text-red-500 -mt-5">
                                                                                {msg}
                                                                            </div>
                                                                        )}
                                                                    />
                                                                </Col>
                                                                <DeleteOutlined
                                                                    data-testid={`delete-item-${index}`}
                                                                    onClick={() => remove(index)}
                                                                    className={`text-xl absolute right-3 cursor-pointer text-bgOrange2 ${index === 0 ? 'invisible' : ''}`}
                                                                />
                                                            </Row>
                                                        </Flex>
                                                    ))}

                                                {values.uboGeneralInfo === 'yes' && (
                                                    <Button
                                                        onClick={() =>
                                                            push({
                                                                uboType: '',
                                                                name: '',
                                                                taxIdentificationNumber: '',
                                                                address: '',
                                                                countryOfTaxResidence: '',
                                                            })
                                                        }
                                                        danger
                                                    >
                                                        + Add UBO
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </FieldArray>
                                </Flex>
                            </Row>
                        </Flex>
                    </Flex>

                    <Flex justify="space-between" className="mt-4">
                        <Button
                            htmlType="button"
                            className="md:w-32 xs:w-36"
                            onClick={() => setCurrent(4)}
                        >
                            Back
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

export default Step6;
