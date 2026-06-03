import { useEffect, type FC } from 'react';

import { Button, Flex, Form, Typography } from 'antd';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';

import CheckboxInput from '@components/atomic/inputs/CheckboxInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector, useAppDispatch } from '@src/hooks/store';
import { paths } from '@src/routes/paths';

import AdditionalDetailsForm from './AdditionalDetailsForm';
import SignerDetails from './SignerDetails';
import { setLoading, hideLoader } from '../../../../../slices/loaderSlice';
import { useESignDocument } from '../../hooks/useESignDocument';
import { eSignDocSchema } from '../../schema';

interface DetailsFormProps {}
const DetailsForm: FC<DetailsFormProps> = () => {
    const { isLoading, eSignDocument } = useESignDocument();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        docket_title,
        expiry_date,
        docket_description,
        reminder,
        reminder_interval,
        documentBase64,
        sequentialSignature,
        signers_info,
        isDisabled,
        initiator_email,
        termsofUse,
    } = useAppSelector(state => state.reducer.eSignDoc);

    const { user } = useAppSelector(state => state.reducer.user);

    const initialSigner = [
        {
            sequence: '1',
            signer_name: user?.contactPersonName || '',
            signer_email: user?.email || '',
            signer_mobile: user?.mobileNo || '',
            page_number: [],
            signer_position: [], // default to 'top-right'
        },
    ];
    const initialValues = {
        docket_title: docket_title || '',
        expiry_date: expiry_date || '',
        docket_description: docket_description || undefined,
        reminder: reminder || false,
        reminder_interval: reminder_interval || undefined,
        documentBase64,
        sequentialSignature: sequentialSignature || false, // default to 'parallel'
        signers_info: signers_info.length === 0 ? initialSigner : signers_info,
        initiator_email: isDisabled ? initiator_email || '' : user?.email || '',
        termsofUse,
    };
    useEffect(() => {
        dispatch(setLoading({ isLoading }));
        return () => {
            dispatch(hideLoader());
        };
    }, [isLoading, dispatch]);
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={eSignDocSchema}
            onSubmit={async (values, { resetForm }) => {
                const status = await eSignDocument(values);
                if (status) {
                    navigate(paths.eSign.successPage);
                }
            }}
        >
            {({ handleSubmit, values }) => (
                <Form layout="vertical" onFinish={handleSubmit}>
                    <Flex vertical className="w-full ">
                        <TextInput
                            classes="sm:1/2 md:w-1/4 "
                            label="Document Name"
                            name="docket_title"
                            placeholder="Enter document name"
                            type="text"
                            isRequired
                            isDisabled={isDisabled}
                            maxLength={60}
                        />
                        {/* this will manage array of signers */}
                        <SignerDetails values={values.signers_info} />

                        <AdditionalDetailsForm />

                        <CheckboxInput name="termsofUse" disabled={isDisabled} isRequired>
                            By clicking on this, you agree to be bound by our trusted partner’s{' '}
                            <Typography.Link
                                href="https://signdesk.com/terms-of-use"
                                target="_blank"
                            >
                                terms of use
                            </Typography.Link>{' '}
                            and{' '}
                            <Typography.Link
                                href="https://signdesk.com/privacy-policy"
                                target="_blank"
                            >
                                privacy policy
                            </Typography.Link>{' '}
                            for use of electronic signatures.
                        </CheckboxInput>

                        {!isDisabled && (
                            <Flex gap={10} justify="start" className="w-full md:max-w-5xl">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    danger
                                    className="mt-5"
                                    loading={isLoading}
                                >
                                    Send Document
                                </Button>
                                <Button
                                    type="default"
                                    danger
                                    className="mt-5"
                                    onClick={() => navigate(`/${paths.eSign.index}`)}
                                >
                                    Cancel
                                </Button>
                            </Flex>
                        )}
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default DetailsForm;
