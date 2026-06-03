import React from 'react';

import { Button, Flex, Form } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import AuthorisedPersonForm from './AuthorisedPersonForm';
import OwnerDetails from './OwnerDetails';
import useSubmitKYB from '../../hooks/useSubmitKYB';
import { useUpdateKYB } from '../../hooks/useUpdateKYB';
import { ownerDetailsSchema } from '../../schema';
import { clearKYBDetails } from '../../slices/beneficiarySlices';

type Props = {
    changeTab: (direction: 'next' | 'prev') => void;
    kybData: any;
    countryData: any;
};

const OwnershipDetails: React.FC<Props> = ({ changeTab, kybData, countryData }) => {
    const navigate = useNavigate();
    const { handleSubmitKYB, submitLoading } = useSubmitKYB();
    const { updateKYBData, isLoading } = useUpdateKYB();
    const dispatch = useAppDispatch();
    console.log(kybData?.shareholders, 'share holders');
    // const [initialValues,setInitialValues]
    const handlePersonalInformation = async (values: any) => {
        const shareHolders = values.owners.map((owner: any, index: number) => ({
            ownerNumber: index + 1,
            ownerName: owner.ownerName,
            nationality: owner.nationality,
            id: owner.id,
            designation: owner.designation,
            percentageShares: parseInt(owner.percentageShares, 10),
            document: owner.documentFormat
                ? {
                      base64: owner.document,
                      format: owner.documentFormat,
                  }
                : owner.document,
        }));

        const ownerInformation = {
            shareHolders,
            authorizedPersonName: values.authorizedPersonName,
            authorizedPersonNationality: values.authorizedPersonNationality,
            authorizedPersonID: values.authorizedPersonID,
            hasPresenceInIranOrNorthKorea: values.hasPresenceInIranOrNorthKorea,
        };

        let res;
        if (kybData?.id) {
            res = await updateKYBData(ownerInformation, kybData.id);
        } else {
            res = await handleSubmitKYB(ownerInformation);
        }

        if (res && res.status) {
            dispatch(clearKYBDetails());
            navigate(`/${paths.dashboard.vendorPayouts}`);
        }
    };
    const initialValues = {
        owners: kybData?.shareholders.map((owner: any) => ({
            ownerName: owner.ownerName || '',
            nationality: owner.nationality || '',
            id: owner.id || '',
            designation: owner.designation || '',
            percentageShares: owner.percentageShares || '',
            document: owner.document || '',
        })) || [
            {
                ownerName: '',
                nationality: '',
                id: '',
                designation: '',
                percentageShares: '',
                document: '',
            },
        ],
        authorizedPersonName: kybData?.authorizedPersonName || '',
        authorizedPersonNationality: kybData?.authorizedPersonNationality || '',
        authorizedPersonID: kybData?.authorizedPersonID || '',
        hasPresenceInIranOrNorthKorea: kybData?.hasPresenceInIranOrNorthKorea || false,
    };
    return (
        <Formik
            initialValues={initialValues}
            onSubmit={handlePersonalInformation}
            validationSchema={ownerDetailsSchema}
            enableReinitialize
        >
            {({ handleSubmit, values }) => (
                <Form onFinish={handleSubmit} layout="vertical">
                    <OwnerDetails
                        countryData={countryData}
                        values={values.owners}
                        kybData={kybData}
                    />
                    <AuthorisedPersonForm countryData={countryData} />
                    <Flex gap={10} className="mt-16">
                        <Button
                            type="primary"
                            danger
                            htmlType="submit"
                            loading={isLoading || submitLoading}
                            disabled={
                                kybData?.status !== 'RE UPLOAD' && kybData?.status !== undefined
                            }
                        >
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={() => changeTab('prev')}>
                            Previous
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default OwnershipDetails;
