import { Flex, Form } from 'antd';
import { ErrorMessage } from 'formik';

import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import usePartnersForCorporate from '@src/domains/admin/users/hooks/usePartnersForCorporate';
import { packageAccessKeys } from '@utils/packageAccessKeys';
import { formatNumberWithoutCommas } from '@utils/priceFormat';

import usePackageUpdate from '../../hooks/usePackageUpdate';
import { packageSchema } from '../../schema/package';
import { Packages } from '../../types/package';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: Packages;
    handleRefresh: () => void;
};

const CreateUpdateModal = ({ open, handleCancel, data, handleRefresh }: DepartmentModalProps) => {
    const { isLoading, handlePackageCreation, updatePackageDetails } = usePackageUpdate();
    const { categoryDatas } = usePartnersForCorporate('');
    return (
        <CustomModalWithForm
            modalTitle="Package Management"
            open={open}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let result;
                if (values.id) {
                    result = await updatePackageDetails(values);
                } else {
                    result = await handlePackageCreation(values);
                }
                if (result) {
                    handleCancel();
                    handleRefresh();
                }
            }}
            initialValues={{
                id: data?.id || '',
                packageName: data?.packageName || '',
                packagePrices: {
                    monthly: formatNumberWithoutCommas(data?.packagePrices?.monthly) || '',
                    annually: formatNumberWithoutCommas(data?.packagePrices?.annually) || '',
                },
                discount: {
                    monthly: formatNumberWithoutCommas(data?.discount?.monthly) || '',
                    annually: formatNumberWithoutCommas(data?.discount?.annually) || '',
                },
                description: data?.description || '',
                packageType: data?.packageType || '',
                accessCode: data?.accessCode || '',
                partnerId: data?.partnerId || '',
            }}
            validationSchema={packageSchema}
        >
            {({ values, setFieldValue }) => (
                <Flex vertical className="w-full ">
                    <Form layout="vertical">
                        <TextInput
                            name="packageName"
                            label="Package Name"
                            type="text"
                            placeholder="Enter Package Name"
                            isRequired
                            classes=" rounded-sm"
                            maxLength={30}
                        />
                        <TextInput
                            name="packagePrices.monthly"
                            label="Package Price (monthly)"
                            type="text"
                            placeholder="Enter Monthly Price"
                            isRequired
                            classes="rounded-sm"
                            maxLength={15}
                            allowDecimalsOnly
                        />
                        <ErrorMessage
                            name="packagePrices.monthly"
                            render={msg => (
                                <div className="-mt-6 text-red-500 error-message">{msg}</div>
                            )}
                        />
                        <TextInput
                            name="packagePrices.annually"
                            label="Package Price (annually)"
                            type="text"
                            placeholder="Enter annual Price"
                            isRequired
                            classes="rounded-sm"
                            maxLength={15}
                            allowDecimalsOnly
                        />
                        <ErrorMessage
                            name="packagePrices.annually"
                            render={msg => (
                                <div className="-mt-6 text-red-500 error-message">{msg}</div>
                            )}
                        />
                        <SelectInput
                            label="Package Type"
                            isRequired
                            name="packageType"
                            placeholder="Select Package Type"
                            options={[
                                {
                                    value: 'INDIVIDUAL',
                                    label: 'Individual',
                                },
                                {
                                    value: 'GROUP',
                                    label: 'Group',
                                },
                            ]}
                            handleChange={e => setFieldValue('accessCode', '')}
                        />
                        {values.packageType === 'INDIVIDUAL' && (
                            <SelectInput
                                label="Access Code"
                                isRequired
                                name="accessCode"
                                placeholder="Select Package Type"
                                options={Object.entries(packageAccessKeys).map(
                                    ([label, value]) => ({
                                        label,
                                        value,
                                    })
                                )}
                            />
                        )}
                        <TextInput
                            name="discount.monthly"
                            label="Discount (monthly)"
                            type="text"
                            placeholder="Enter Monthly Discount "
                            isRequired
                            classes="rounded-sm"
                            maxLength={15}
                            allowDecimalsOnly
                        />
                        <ErrorMessage
                            name="discount.monthly"
                            render={msg => (
                                <div className="-mt-6 text-red-500 error-message">{msg}</div>
                            )}
                        />
                        <TextInput
                            name="discount.annually"
                            label="Discount(annually)"
                            type="text"
                            placeholder="Enter Annual Discount "
                            isRequired
                            classes="rounded-sm"
                            maxLength={15}
                            allowDecimalsOnly
                        />
                        <ErrorMessage
                            name="discount.annually"
                            render={msg => (
                                <div className="-mt-6 text-red-500 error-message">{msg}</div>
                            )}
                        />

                        <SelectInput
                            label="Select Partner"
                            name="partnerId"
                            placeholder="Select Partner"
                            options={
                                categoryDatas
                                    ? categoryDatas.map(item => ({
                                          value: item.id.toString(),
                                          label: item.name,
                                      }))
                                    : []
                            }
                            tooltipText="Please select this option if you are adding a package for a partner. If not, you can leave this field empty."
                            showToolTip
                        />

                        <InputTextArea
                            name="description"
                            label="Description"
                            placeholder="Enter Description"
                            autoSize={{ minRows: 4 }}
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default CreateUpdateModal;
