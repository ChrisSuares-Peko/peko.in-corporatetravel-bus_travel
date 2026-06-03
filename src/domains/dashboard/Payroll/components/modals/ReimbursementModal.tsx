import { useState } from 'react';

import { Flex } from 'antd';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppSelector } from '@src/hooks/store';

import useReimbursementCreate from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useAddReimbursementApi';
import { useUpdateReimbursement } from '../../hooks/employeeSalaryHooks/ReimbursementHooks/useUpdateReimbursementApi';
import { payrollReimbursementSchema } from '../../schema/EmployeeSalary';
import {
    ReimbursementRequestFormType,
    reimbursementTableType,
} from '../../types/salaryProfileTypes/ReimbursementTypes/index';
import ReimbursementForm from '../Forms/ReimbursementForm';

type ReimbursementModalProps = {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: reimbursementTableType | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    employeeIdFromProfile?: string;
    month?: number;
    year?: number;
};

const ReimbursementModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
    employeeIdFromProfile,
    month,
    year,
}: ReimbursementModalProps) => {
    const { handleReimbursementCreation } = useReimbursementCreate(handleCancel);
    const { updateReimbursementId } = useUpdateReimbursement(handleCancel);
    const { dateOfJoin } = useAppSelector(state => state.reducer.payrollSalary);
    const [dateOfJoined, setDateOfJoin] = useState<string | undefined>();
    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Reimbursement' : 'Add Reimbursement'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async (values: ReimbursementRequestFormType) => {
                if (selectedRecordData) {
                    await updateReimbursementId(values, selectedRecordData);
                } else {
                    await handleReimbursementCreation(values);
                }
                if (reloadTable) reloadTable(p => !p);
            }}
            initialValues={{
                employeeId: selectedRecordData?.employeeId || employeeIdFromProfile || '',
                expenseDate: selectedRecordData?.expenseDate ?? '',
                managerEmail: selectedRecordData?.managerEmail || '',
                expenseDetails: selectedRecordData?.expenseDetails || '',
                totalPay: selectedRecordData?.amountPaid || '',
            }}
            validationSchema={payrollReimbursementSchema}
        >
            <Flex vertical className="w-full">
                <Flex className="text-gray-500 text-[.8rem] mb-4">
                    The total reimbursement amount to be credited to the employee, in addition to
                    their salary
                </Flex>

                <ReimbursementForm
                    selectedRecordData={selectedRecordData}
                    employeeIdFromProfile={employeeIdFromProfile}
                    dateOfJoin={dateOfJoin}
                    dateOfJoined={dateOfJoined}
                    setDateOfJoin={setDateOfJoin}
                    month={month}
                    year={year}
                />
            </Flex>
        </CustomModalWithForm>
    );
};

export default ReimbursementModal;
