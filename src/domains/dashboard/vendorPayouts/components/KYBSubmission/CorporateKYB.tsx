import { Button, Flex, Form, Row } from 'antd';
import { Formik } from 'formik';

import { setKYBDetails } from '@src/domains/dashboard/vendorPayouts/slices/beneficiarySlices';
import { useAppDispatch, useAppSelector } from '@src/hooks/store';

import AddressInfoForm from './AddressInfoForm';
import CompanyInfoForm from './CompanyInfoForm';
import { kybDetailsSchema } from '../../schema';

type Props = {
    changeTab: (direction: 'next' | 'prev') => void;
    kybData: any;
    countryData: any;
};

const CorporateKYB = ({ changeTab, kybData, countryData }: Props) => {
    const { kybDetails } = useAppSelector(state => state.reducer.vendorBeneficiary);
    const dispatch = useAppDispatch();
    const handleKybInformation = async (values: any) => {
        const transformedValues = {
            icRegNumber: values.icRegNumber,
            companyName: values.companyName,
            tradeName: values.tradeName,
            offWebsite: values.offWebsite,
            offEmail: values.offEmail,
            contactPersonName: values.contactPersonName,
            phoneNumber: values.phoneNumber,
            legalStatus: values.legalStatus,
            OtherlegalStatus: values.OtherlegalStatus,
            natureOfBusiness: values.natureOfBusiness,
            countryOfIncorporation: values.countryOfIncorporation,
            dateOfIncorporation: values.dateOfIncorporation,
            TLNumber: values.TLNumber,
            TLIssuingAuthority: values.tlIssuingAuthority,
            expiryDateofTL: values.expiryDateofTL,
            VATTRN: values.VATTRN,
            tradeLicense: values.format
                ? { base64: values.tradeLicense, format: values.format }
                : kybData.tradeLicense,
            corporateAddress: {
                poBox: values.poBox,
                buildingName: values.buildingName,
                streetName: values.streetName,
                city: values.city,
                country: values.country,
            },
        };

        // Dispatch the structured data
        dispatch(setKYBDetails(transformedValues));
        changeTab('next');
    };
    return (
        <Formik
            initialValues={{
                icRegNumber: kybData?.icRegNumber || kybDetails?.icRegNumber || '',
                companyName: kybData?.companyName || kybDetails?.companyName || '',
                tradeName: kybData?.tradeName || kybDetails?.tradeName || '',
                legalStatus: kybData?.legalStatus || kybDetails?.legalStatus || undefined,
                otherLegalStatus: kybData?.otherLegalStatus || undefined,
                natureOfBusiness: kybData?.natureOfBusiness || kybDetails?.natureOfBusiness || '',
                countryOfIncorporation:
                    kybData?.countryOfIncorporation || kybDetails?.countryOfIncorporation || '',
                dateOfIncorporation:
                    kybData?.dateOfIncorporation || kybDetails?.dateOfIncorporation || '',
                TLNumber: kybData?.TLNumber || kybDetails?.TLNumber || '',
                tlIssuingAuthority:
                    kybData?.TLIssuingAuthority || kybDetails?.TLIssuingAuthority || '',
                expiryDateofTL: kybData?.expiryDateofTL || kybDetails?.expiryDateofTL || '',
                VATTRN: kybData?.VATTRN || kybDetails?.VATTRN || '',
                poBox:
                    kybData?.corporateAddress?.poBox || kybDetails?.corporateAddress?.poBox || '',
                buildingName:
                    kybData?.corporateAddress?.buildingName ||
                    kybDetails?.corporateAddress?.buildingName ||
                    '',
                streetName:
                    kybData?.corporateAddress?.streetName ||
                    kybDetails?.corporateAddress?.streetName ||
                    '',
                city: kybData?.corporateAddress?.city || kybDetails?.corporateAddress?.city || '',
                country:
                    kybData?.corporateAddress?.country ||
                    kybDetails?.corporateAddress?.country ||
                    undefined,
                offWebsite: kybData?.offWebsite || kybDetails?.offWebsite || '',
                offEmail: kybData?.offEmail || kybDetails?.offEmail || '',
                phoneNumber: kybData?.phoneNumber || kybDetails?.phoneNumber || '',
                contactPersonName:
                    kybData?.contactPersonName || kybDetails?.contactPersonName || '',
                tradeLicense: kybData?.tradeLicense || '',
            }}
            validationSchema={kybDetailsSchema}
            onSubmit={handleKybInformation}
        >
            {({ handleSubmit, values }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <Row className=" " gutter={[50, 40]}>
                        <CompanyInfoForm
                            countryData={countryData}
                            values={values}
                            kybData={kybData}
                        />
                        <AddressInfoForm countryData={countryData} kybData={kybData} />
                    </Row>

                    <Flex gap={10} className="mt-16">
                        <Button type="primary" danger htmlType="submit">
                            Next
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default CorporateKYB;
