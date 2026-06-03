import { useEffect, useState } from 'react';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import useEsimPlanUpdate from '../../hooks/useEsimPlanUpdate';
import { esimPlanSchema } from '../../schema/eSIMPlans';
import { EsimPlan } from '../../types/eSIM';
import PlanForm from '../forms/eSIMPlansForm';

type DepartmentModalProps = {
    open: boolean;
    handleCancel: () => void;
    data?: EsimPlan;
    handleRefresh: () => void;
};

const CreateUpdateModal = ({ open, handleCancel, data, handleRefresh }: DepartmentModalProps) => {
    const [searchCountry, setSearchCountry] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string>(data?.country || '');
    const {
        isLoading,
        handleEsimPlanCreation,
        updateEsimPlanDetails,
        countryData,
        countryLoading,
    } = useEsimPlanUpdate(searchCountry);

    useEffect(() => {
        if (data?.country) {
            setSelectedCountry(data.country);
        }
    }, [data]);

    return (
        <CustomModalWithForm
            modalTitle="eSIM Management"
            open={open}
            isDisabled={countryLoading}
            isLoading={isLoading}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                let result;
                const found = countryData?.find(
                    item => values.country === item.value || values.country === item.label
                );
                values.country = found?.label;
                values.coverageId = found?.value;
                if (found) setSelectedCountry(found.label);

                if (values.id) {
                    result = await updateEsimPlanDetails(values);
                } else {
                    result = await handleEsimPlanCreation(values);
                }
                if (result) {
                    handleCancel();
                    handleRefresh();
                }
            }}
            initialValues={{
                id: data?.id || '',
                name: data?.name || '',
                country: selectedCountry,
                dataMBs: data?.dataMBs || '',
                periodDays: data?.periodDays || '',
                amount: data?.amount || '',
            }}
            validationSchema={esimPlanSchema}
        >
            <PlanForm countryData={countryData} setSearchCountry={setSearchCountry} />
        </CustomModalWithForm>
    );
};

export default CreateUpdateModal;
