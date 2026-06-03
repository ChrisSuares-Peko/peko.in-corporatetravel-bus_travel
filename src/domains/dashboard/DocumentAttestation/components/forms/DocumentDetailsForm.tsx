import { Form, Flex, Button, Select } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import SelectInput from '@components/atomic/inputs/SelectInput';
import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import useScreenSize from '@src/hooks/useScreenSize';
import { paths } from '@src/routes/paths';

import useCheckPrice from '../../hooks/useCheckPrice';
import { useGetCountries } from '../../hooks/useGetCountries';
import { useGetDocumentType } from '../../hooks/useGetDocumentType';
import { documentDetailsSchema } from '../../schema';
import CheckPrice from '../sections/CheckPrice';

interface DocumentDetailsFormType {
    form1Ref: any;
}
const DocumentDetailsForm = ({ form1Ref }: DocumentDetailsFormType) => {
    const navigate = useNavigate();
    const { countryData } = useGetCountries();
    const { data, handleGetDocument } = useGetDocumentType();
    const { handleCheckPrice, docPriceData } = useCheckPrice();
    const { md } = useScreenSize();
    const handleGetDoc = (val: string) => {
        handleGetDocument(val);
    };

    return (
        <Formik
            innerRef={form1Ref}
            initialValues={{
                documentType: '',
                issuedCountry: '',
                submissionCountry: '',
                promoCode: '',
            }}
            validationSchema={documentDetailsSchema}
            onSubmit={values => {
                const country: any = countryData.find(
                    (item: { value: string; label: string }) => item?.value === values.issuedCountry
                );
                const postData = {
                    documentType: values.documentType,
                    countryCode: values.issuedCountry,
                    promoCode: values.promoCode,
                };
                handleCheckPrice(postData, country?.label);
                if (!md) {
                    navigate(paths.documentAttestation.deliveryDetails);
                }
            }}
        >
            {({ handleSubmit, touched, errors, setFieldValue, values }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex>
                        <Flex vertical className="w-full md:w-1/2">
                            <Form.Item
                                label="Document Issued Country"
                                required
                                help={
                                    touched.issuedCountry && errors.issuedCountry
                                        ? (errors.issuedCountry as React.ReactNode)
                                        : undefined
                                }
                                validateStatus={
                                    touched.issuedCountry && errors.issuedCountry ? 'error' : ''
                                }
                            >
                                <Select
                                    showSearch
                                    placeholder="Select Issued Country"
                                    options={countryData}
                                    onChange={val => {
                                        setFieldValue('issuedCountry', val);
                                        handleGetDoc(val);
                                    }}
                                    filterOption={(input: string, option) =>
                                        (
                                            (option &&
                                                // @ts-ignore
                                                option?.label.toLowerCase()) ??
                                            ''
                                        ).includes(input.toLowerCase())
                                    }
                                />
                            </Form.Item>

                            <SelectInputWithSearch
                                placeholder="Select Type of Document"
                                options={data ?? []}
                                label="Type of Document"
                                name="documentType"
                                isRequired
                            />

                            <SelectInput
                                placeholder="Select Submission Country"
                                name="submissionCountry"
                                label="Submission Country"
                                isRequired
                                options={[
                                    {
                                        value: 'AE',
                                        label: 'United Arab Emirates',
                                    },
                                ]}
                            />
                            {/* 
                            <TextInput
                                label="Have a discount/ promo code to redeem?"
                                placeholder="Enter Promo Code"
                                type="text"
                                size="middle"
                                name="promoCode"
                            /> */}

                            <Button
                                className="mb-6 mt-3 w-28 xs:hidden md:block"
                                htmlType="submit"
                                type="default"
                                danger
                            >
                                Check Price
                            </Button>
                        </Flex>
                        <Flex vertical className="hidden md:flex w-1/2 pl-10" gap={5}>
                            {docPriceData && (
                                <CheckPrice
                                    data={docPriceData}
                                    issuedCountry={values.issuedCountry}
                                />
                            )}
                        </Flex>
                    </Flex>
                    <Button
                        className="w-full mt-6 flex justify-center md:hidden"
                        htmlType="submit"
                        type="primary"
                        danger
                    >
                        Check Price
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default DocumentDetailsForm;
