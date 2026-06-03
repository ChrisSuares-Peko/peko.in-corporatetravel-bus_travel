import React from 'react';

import { Flex } from 'antd';

import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';

import LeaveForm from './LeaveForm';
import { useAddLeave } from '../../hooks/leaveHooks/useAddLeaveApi';
import { useUpdateLeave } from '../../hooks/leaveHooks/useUpdateLeaveApi';
import { leaveSchema } from '../../schema/employeeLeaveSchema';
import { LeaveRequestFormType, LeaveTableRow } from '../../types/leaveSection';

interface LeaveModalProps {
    open: boolean;
    handleCancel: () => void;
    selectedRecordData?: LeaveTableRow | null;
    reloadTable?: React.Dispatch<React.SetStateAction<boolean>>;
    employeeIdFromProfile?: string;
    month?: number;
    year?: number;
}

const LeaveModal = ({
    open,
    handleCancel,
    selectedRecordData,
    reloadTable,
    employeeIdFromProfile,
    month,
    year,
}: LeaveModalProps) => {
    const { addLeaveData } = useAddLeave(handleCancel);
    const { updateLeavebyId } = useUpdateLeave(handleCancel);

    return (
        <CustomModalWithForm
            modalTitle={selectedRecordData ? 'Edit Leave' : 'Add Leave'}
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async (values: LeaveRequestFormType) => {
                if (selectedRecordData) {
                    await updateLeavebyId(values, selectedRecordData);
                } else {
                    await addLeaveData(values);
                }
                if (reloadTable) reloadTable(p => !p);
            }}
            initialValues={{
                employeeId: selectedRecordData?.employeeId || employeeIdFromProfile || '',
                typeOfLeave: selectedRecordData?.leaveType || '',
                leaveCount: selectedRecordData?.totalDays || 1,
                start: selectedRecordData?.from || '',
                end: selectedRecordData?.to || '',
                leaveSupportingDocs: '',
                supportingDocFormat: '',
            }}
            validationSchema={leaveSchema}
        >
            <Flex vertical className=" w-full">
                <LeaveForm
                    selectedRecordData={selectedRecordData}
                    employeeIdFromProfile={employeeIdFromProfile}
                    month={month}
                    year={year}
                />
            </Flex>
        </CustomModalWithForm>
    );
};

export default LeaveModal;
