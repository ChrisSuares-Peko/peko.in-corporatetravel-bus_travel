import { Flex, Form, Skeleton } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import usePartnersForCorporate from '@src/domains/admin/users/hooks/usePartnersForCorporate';
import { useAppDispatch } from '@src/hooks/store';
import { showToast } from '@src/slices/apiSlice';
import { formatNumberWithoutCommas } from '@utils/priceFormat';

import useUpdateCashback from '../../hooks/useUpdateCashback';
import cashbackSchema from '../../schema/cashbackSchema';
import { ServiceData, refresh } from '../../types/cashback';

type CashbackModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: ServiceData;
    handlePartnerChange: (e: string) => void;
    partnerId: string;
};

const CashbackModal = ({
    open,
    handleCancel,
    data,
    setRefresh,
    packageData,
    serviceData,
    handlePartnerChange,
    partnerId,
}: CashbackModalProps & refresh) => {
    const dispatch = useAppDispatch();
    const { createNewCashback, updateCurrentCashback, isLoading } = useUpdateCashback();
    const { partnerData } = usePartnersForCorporate('');

    return (
        <CustomModalWithForm
            reinitialise={!isLoading}
            modalTitle="Cashback Management"
            open={open}
            validationSchema={cashbackSchema}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let res: any;
                delete values.partnerId;
                if (data) {
                    res = await updateCurrentCashback({
                        ...values,
                    });
                } else {
                    res = await createNewCashback({
                        ...values,
                    });
                }
                if (res.status === true) {
                    setRefresh(prevRefresh => !prevRefresh);
                    if (data)
                        dispatch(
                            showToast({
                                description: `Cashback updated successfully`,
                                variant: 'success',
                            })
                        );
                    else
                        dispatch(
                            showToast({
                                description: `Cashback added successfully`,
                                variant: 'success',
                            })
                        );
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
                packageId: data?.packageId.toString() || '',
                serviceOperatorId: data?.serviceOperatorId.toString() || '',
                cashbackType: data?.cashbackType || '',
                cashback: formatNumberWithoutCommas(data?.cashback) || '',
                surcharge: formatNumberWithoutCommas(data?.surcharge) || '',
                unitPrice: formatNumberWithoutCommas(data?.unitPrice) || '0',
                baseLimit: formatNumberWithoutCommas(data?.baseLimit) || '0',
                partnerId: partnerId || '',
            }}
        >
            <Flex vertical className="w-full ">
                <Form layout="vertical">
                    {partnerData ? (
                        <SelectInput
                            name="partnerId"
                            options={partnerData}
                            placeholder="Please select a partner"
                            label="Select Partner"
                            handleChange={e => handlePartnerChange(e)}
                        />
                    ) : (
                        <Skeleton.Input active block />
                    )}
                    {packageData ? (
                        <SelectInput
                            isRequired
                            name="packageId"
                            options={packageData}
                            placeholder="Please select a package"
                            label="Package Name"
                            showToolTip
                            tooltipText="The default packages are for the Peko platform. If you want to assign cashback for partners, please select the dropdown above first."
                        />
                    ) : (
                        <Skeleton.Input active block />
                    )}
                    {serviceData ? (
                        <SelectInput
                            isRequired
                            name="serviceOperatorId"
                            options={serviceData}
                            placeholder="Please select an operator"
                            label="Select Operator"
                        />
                    ) : (
                        <Skeleton.Input active block className="my-2" />
                    )}
                    <SelectInput
                        name="cashbackType"
                        isRequired
                        options={[
                            { value: 'PERCENTAGE', label: 'Percentage' },
                            { value: 'FLAT', label: 'Flat' },
                        ]}
                        placeholder="Please select a commision"
                        label="Commission Type"
                    />

                    <TextInput
                        allowTwoDecimalsOnly
                        maxLength={8}
                        name="cashback"
                        label="Cashback"
                        type="text"
                        placeholder="Please enter cashback "
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        allowTwoDecimalsOnly
                        maxLength={8}
                        name="surcharge"
                        label="Surcharge"
                        type="text"
                        placeholder="Please enter surcharge"
                        isRequired
                        classes=" rounded-sm"
                    />
                    <TextInput
                        allowDecimalsOnly
                        name="unitPrice"
                        label="Unit Price"
                        type="text"
                        placeholder="Please enter unit price "
                        classes=" rounded-sm"
                        maxLength={5}
                    />
                    <TextInput
                        allowDecimalsOnly
                        name="baseLimit"
                        label="Base Limit"
                        type="text"
                        placeholder="Please enter base limit "
                        classes=" rounded-sm"
                        maxLength={5}
                    />
                </Form>
            </Flex>
        </CustomModalWithForm>
    );
};

export default CashbackModal;
