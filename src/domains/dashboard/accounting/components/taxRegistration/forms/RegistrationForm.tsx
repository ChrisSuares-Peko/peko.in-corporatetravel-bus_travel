import { useState, type FC } from 'react';

import { DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import { ErrorMessage, FieldArray, Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { OptionsArray } from '@domains/dashboard/accounting/utils/data';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import TaxCheckboxInput from './TaxCheckbox';
import TaxFileUploadInput from './TaxFileUpload';
import useCorporateTaxData from '../../../hooks/useCorporateTaxData';
import { taxRegistrationSchema } from '../../../schema';
import { resetTaxData, setDetails } from '../../../slices/accountingSlice';
import '../../../assets/style.css';

interface RegistrationFormProps {}

const RegistrationForm: FC<RegistrationFormProps> = () => {
    const navigate = useNavigate();
    const { taxData, amount, taxDetails, formDetails } = useAppSelector(
        state => state.reducer.accounting
    );
    const { user } = useAppSelector(state => state.reducer.user);
    const { updateDetails, isLoading } = useCorporateTaxData();

    const [file, setFile] = useState<any>('');
    const dispatch = useAppDispatch();

    const regex = /^(.*?) - (.*?)$/;

    return (
        <Formik
            initialValues={{
                tradeLicenseDoc: taxDetails?.tradeLicenseDoc
                    ? taxDetails.tradeLicenseDoc.map((doc: any, index: number) => ({
                          tradeLicenseDoc_1: doc[`tradeLicenseDoc_${index + 1}`],
                      }))
                    : [{ tradeLicenseDoc_1: '' }],
                corporateGovernanceDoc:
                    formDetails?.corporateGovernanceDoc || taxDetails?.corporateGovernanceDoc || '',
                emiratesIDDoc: taxDetails?.emiratesIDDoc || '',
                passportDoc: taxDetails?.passportDoc || '',
                contactPerson:
                    formDetails?.contactPerson ||
                    taxDetails?.contactPerson ||
                    user?.contactPersonName,
                startMonth: taxDetails?.taxPeriod.match(regex)[1] || '',
                endMonth: taxDetails?.taxPeriod.match(regex)[2] || '',
                companyName: taxDetails?.companyName || user?.companyName,
                phoneNumber: taxDetails?.phoneNumber || user?.mobileNo,
                email: taxDetails?.email || user?.email,
                selfDeclaration: taxDetails?.selfDeclaration || false,
            }}
            validationSchema={taxRegistrationSchema}
            // context={{ $isFirstField: true }}
            onSubmit={async values => {
                let res: boolean;
                const cleanedValues = {
                    ...values,
                    tradeLicenseDoc: values.tradeLicenseDoc.filter(
                        (doc: any) => Object.values(doc)[0] !== ''
                    ),
                };

                if (!taxDetails) {
                    dispatch(setDetails(cleanedValues));
                    navigate(paths.accounting.TaxRegisterReview);
                } else {
                    const Period = `${values.startMonth} - ${values.endMonth}`;
                    const qty = values.tradeLicenseDoc.length;
                    const docs = values.tradeLicenseDoc;
                    const totalAmount = qty * amount;
                    const transformedDoc = docs.map((obj: any, index: any) => {
                        const key = `tradeLicenseDoc_${index + 1}`;
                        return { [key]: obj.tradeLicenseDoc_1 };
                    });

                    res = await updateDetails({
                        ...values,
                        taxPeriod: Period,
                        quantity: qty,
                        amount: totalAmount,
                        accessKey: 'corporateTaxRegistration',
                        id: taxDetails.id,
                        tradeLicenseDoc: transformedDoc,
                    });
                    if (res) {
                        navigate(paths.accounting.TaxHistory);
                        dispatch(resetTaxData());
                    }
                }
            }}
        >
            {({ handleSubmit, values, setFieldValue, errors }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <Row className="mt-6" gutter={[20, 20]}>
                        <Col xs={24} md={16}>
                            <Row>
                                <Col className="mb-2">
                                    <FieldArray name="tradeLicenseDoc">
                                        {({ push, remove }) => (
                                            <>
                                                {values.tradeLicenseDoc.map(
                                                    (doc: any, index: any) => (
                                                        <div key={index}>
                                                            <Flex className="">
                                                                {taxDetails ? (
                                                                    <TaxFileUploadInput
                                                                        // existingFileUrl={`tradeLicenseDoc[${index}].tradeLicenseDoc_${index + 1}`}
                                                                        existingFileUrl={
                                                                            Object.values(doc)[0]
                                                                        }
                                                                        label={`Copy of Trade License ${index + 1}`}
                                                                        name={`tradeLicenseDoc[${index}].tradeLicenseDoc_1.base64`}
                                                                        setFile={setFile}
                                                                        format={`tradeLicenseDoc[${index}].tradeLicenseDoc_1.format`}
                                                                        showNotification
                                                                        showFileName
                                                                        classes=""
                                                                        isrequired
                                                                        existingFilName={`TradeLicense_${index + 1}`}
                                                                    />
                                                                ) : (
                                                                    <TaxFileUploadInput
                                                                        existingFileUrl=""
                                                                        label={`Copy of Trade License ${index + 1}`}
                                                                        name={`tradeLicenseDoc[${index}].tradeLicenseDoc_1.base64`}
                                                                        setFile={setFile}
                                                                        format={`tradeLicenseDoc[${index}].tradeLicenseDoc_1.format`}
                                                                        showNotification
                                                                        showFileName
                                                                        classes=""
                                                                        isrequired
                                                                    />
                                                                )}

                                                                {index > 0 && !taxDetails ? (
                                                                    <DeleteOutlined
                                                                        onClick={() =>
                                                                            remove(index)
                                                                        }
                                                                        className="mt-1 text-xl text-bgOrange2"
                                                                    />
                                                                ) : null}
                                                            </Flex>
                                                            <ErrorMessage
                                                                name={`tradeLicenseDoc[${index}].tradeLicenseDoc_1`}
                                                                render={msg => (
                                                                    <div
                                                                        className="mb-0 -mt-5 error-message"
                                                                        style={{ color: '#FF3A3A' }}
                                                                    >
                                                                        {msg}
                                                                    </div>
                                                                )}
                                                            />
                                                        </div>
                                                    )
                                                )}

                                                {/* {
                                                    !taxDetails&&(
                                                        <Typography.Text
                                                        className="text-xs font-medium text-red-400 cursor-pointer"
                                                        onClick={() => {
                                                            push({ tradeLicenseDoc_1: '' });
                                                        }}
                                                    >
                                                        Add more
                                                    </Typography.Text>
                                                    )
                                                } */}
                                            </>
                                        )}
                                    </FieldArray>
                                </Col>
                                <Col>
                                    <FieldArray name="tradeLicenseDoc">
                                        {({ push }) =>
                                            !taxDetails &&
                                            values.tradeLicenseDoc.length < 10 && (
                                                <Typography.Text
                                                    className="text-xs font-medium text-red-400 cursor-pointer"
                                                    onClick={() => {
                                                        if (values.tradeLicenseDoc.length < 10) {
                                                            push({ tradeLicenseDoc_1: '' });
                                                        }
                                                    }}
                                                >
                                                    Add more
                                                </Typography.Text>
                                            )
                                        }
                                    </FieldArray>
                                </Col>
                            </Row>
                            <Flex vertical className="">
                                <TaxFileUploadInput
                                    existingFileUrl={taxDetails?.corporateGovernanceDoc}
                                    label="Memorandum of Association or Articles of Association"
                                    name="corporateGovernanceDoc.base64"
                                    setFile={setFile}
                                    format="corporateGovernanceDoc.format"
                                    showNotification
                                    showFileName
                                    isrequired
                                    classes=""
                                    existingFilName="MOA"
                                />
                                <ErrorMessage
                                    name="corporateGovernanceDoc"
                                    render={msg => (
                                        <div
                                            className="-mt-5 error-message"
                                            style={{ color: '#FF3A3A' }}
                                        >
                                            {msg}
                                        </div>
                                    )}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TaxFileUploadInput
                                    existingFileUrl={taxDetails?.emiratesIDDoc}
                                    label="Copy of Emirates ID (Owner)"
                                    name="emiratesIDDoc.base64"
                                    setFile={setFile}
                                    format="emiratesIDDoc.format"
                                    showNotification
                                    showFileName
                                    classes=""
                                    isrequired
                                    existingFilName="EmiratesID"
                                />

                                <ErrorMessage
                                    name="emiratesIDDoc"
                                    render={msg => (
                                        <div
                                            className="-mt-6 error-message "
                                            style={{ color: '#FF3A3A' }}
                                        >
                                            {msg}
                                        </div>
                                    )}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TaxFileUploadInput
                                    existingFileUrl={taxDetails?.passportDoc}
                                    isrequired
                                    label="Copy of Passport (Owner)"
                                    name="passportDoc.base64"
                                    setFile={setFile}
                                    format="passportDoc.format"
                                    showNotification
                                    showFileName
                                    classes=""
                                    existingFilName="Passport"
                                />
                                <ErrorMessage
                                    name="passportDoc"
                                    render={msg => (
                                        <div
                                            className="-mt-6 error-message "
                                            style={{ color: '#FF3A3A' }}
                                        >
                                            {msg}
                                        </div>
                                    )}
                                />
                            </Flex>

                            <Flex vertical className="">
                                <Flex align="center">
                                    <Typography.Text
                                        className="text-center text-md"
                                        style={{ color: '#FF3A3A' }}
                                    >
                                        *
                                    </Typography.Text>
                                    <Typography.Text className="ml-1">
                                        Corporate Tax Period
                                    </Typography.Text>
                                </Flex>

                                <Row gutter={10}>
                                    <Col span={12}>
                                        <SelectInput
                                            options={OptionsArray}
                                            name="startMonth"
                                            isRequired
                                            // label="Tax Period"
                                            placeholder="From"
                                            classes=" rounded-sm  "
                                            handleChange={monthValue => {
                                                const months = [
                                                    'January',
                                                    'February',
                                                    'March',
                                                    'April',
                                                    'May',
                                                    'June',
                                                    'July',
                                                    'August',
                                                    'September',
                                                    'October',
                                                    'November',
                                                    'December',
                                                ];
                                                const startIndex = months.findIndex(
                                                    month => month === monthValue
                                                );
                                                const endIndex = (startIndex - 1 + 12) % 12;
                                                setFieldValue('endMonth', months[endIndex]);
                                            }}
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <SelectInput
                                            options={OptionsArray}
                                            name="endMonth"
                                            // label="Tax Period"
                                            // isRequired
                                            placeholder="To"
                                            classes=" rounded-sm  "
                                            handleChange={monthValue => {
                                                const months = [
                                                    'January',
                                                    'February',
                                                    'March',
                                                    'April',
                                                    'May',
                                                    'June',
                                                    'July',
                                                    'August',
                                                    'September',
                                                    'October',
                                                    'November',
                                                    'December',
                                                ];
                                                const startIndex = months.findIndex(
                                                    month => month === monthValue
                                                );
                                                const startMonthIndex = (startIndex - 11 + 12) % 12;
                                                setFieldValue(
                                                    'startMonth',
                                                    months[startMonthIndex]
                                                );
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Flex>

                            <Flex vertical className="">
                                <TextInput
                                    isRequired
                                    name="contactPerson"
                                    type="text"
                                    label="Authorized Contact Person"
                                    placeholder="Enter Contact Person Name"
                                    classes=""
                                    allowAlphabetsAndSpaceOnly
                                    maxLength={50}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="companyName"
                                    type="text"
                                    label="Company Name"
                                    placeholder="Enter Company Name"
                                    classes=""
                                    isRequired
                                    maxLength={50}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="phoneNumber"
                                    type="text"
                                    label="Mobile Number"
                                    placeholder="Enter Mobile Number"
                                    classes=""
                                    isRequired
                                    allowNumbersOnly
                                    maxLength={12}
                                />
                            </Flex>
                            <Flex vertical className="">
                                <TextInput
                                    name="email"
                                    type="text"
                                    label="Email ID"
                                    placeholder="Enter Email ID"
                                    classes=""
                                    allowLowerCaseOnly
                                    isRequired
                                    maxLength={50}
                                />
                            </Flex>

                            <Flex vertical className="">
                                <TaxCheckboxInput name="selfDeclaration" classes="">
                                    {' '}
                                    I verify that I am an authorized representative of this
                                    organization and have the right to provide the required
                                    information{' '}
                                </TaxCheckboxInput>
                            </Flex>
                        </Col>
                    </Row>
                    {/* <Link to="/accounting/tax-review"> */}
                    <Flex gap={10} className="mt-5">
                        <Button type="primary" danger htmlType="submit" loading={isLoading}>
                            Submit
                        </Button>
                    </Flex>
                    {/* </Link> */}
                </Form>
            )}
        </Formik>
    );
};
export default RegistrationForm;
