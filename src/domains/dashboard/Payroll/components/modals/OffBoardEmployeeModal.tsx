import { Flex, Form, Typography } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

import DatePickerInput from '@components/atomic/inputs/DatePickerInput';
import InputTextArea from '@components/atomic/inputs/InputTextArea';
import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import CustomModalWithForm from '@components/molecular/modals/CustomModalWithForm';
import { useAppDispatch } from '@src/hooks/store';

import { useOffBoardEmployeeApi } from '../../hooks/employeeHooks/useOffBoardEmployeeApi';
import { offBoardEmployeeSchema } from '../../schema/offBoardSchema';
import DocumentUploadInput from '../EmployeeProfile/DocumentUploadInput';

type OffboardModalProps = {
    open: boolean;
    handleCancel: () => void;
    handleCreate: () => void;
    setRefresh: (value: any) => void;
    employeeData: any;
    setOffboardReload: React.Dispatch<React.SetStateAction<boolean>>;
};

const OffBoardEmployeeModal = ({
    open,
    handleCancel,
    handleCreate,
    setRefresh,
    employeeData,
    setOffboardReload,
}: OffboardModalProps) => {
    const { offBoardEmployee, isLoading } = useOffBoardEmployeeApi();
    const formattedDate = moment(employeeData.employeeInformation.dateOfJoin).format(
        'MMMM DD, YYYY'
    );

    const dispatch = useAppDispatch();
    const resignationTypes = [
        { key: 1, id: 1, value: 'RESIGNATION', label: 'Resignation', name: 'resignation' },
        { key: 2, id: 2, value: 'SUSPENSION', label: 'Suspension', name: 'suspension' },
    ];
    const calculateAndSetLastWorkingDay = (
        offBoardingDate: any,
        noticePeriod: any,
        setFieldValue: any,
        formikProps: any
    ) => {
        if (!offBoardingDate || !noticePeriod) return;

        const noticePeriodInt = parseInt(noticePeriod, 10);
        if (Number.isNaN(noticePeriod)) {
            console.error('Notice period is not a valid number');
            return;
        }
        const offBoardingMoment = moment.isMoment(offBoardingDate)
            ? offBoardingDate
            : moment(offBoardingDate);

        // Add notice period days to offBoardingDate
        const lastWorkingDay = offBoardingMoment.add(noticePeriodInt, 'days').format('YYYY-MM-DD');

        // Set the formatted lastWorkingDay in formik's state
        setFieldValue('lastWorkingDay', lastWorkingDay);

        // Assuming you want the date in 'YYYY-MM-DD' format
    };

    return (
        <CustomModalWithForm
            modalTitle={
                <Flex vertical>
                    <Typography.Text className="text-xl">{employeeData.fullName}</Typography.Text>
                    <Typography.Text className="text-md font-normal mb-5 mt-2">
                        {employeeData.employeeInformation.employeeId}
                    </Typography.Text>
                </Flex>
            }
            open={open}
            handleCancel={handleCancel}
            handleFormSubmit={async values => {
                const response = await offBoardEmployee(employeeData.id, {
                    ...values,

                    resignationLetter: {
                        base64: values.resignationLetter,
                        format: 'jpeg',
                    },
                });

                handleCancel();
                if (setOffboardReload) setOffboardReload(p => !p);
            }}
            initialValues={{
                lastWorkingDay: '',
                noticePeriod: 0,
                offBoardingType: '',
                reasonForOffBoarding: '',
                resignationLetter: '',
                offBoardingDate: '',
            }}
            validationSchema={offBoardEmployeeSchema}
        >
            {formikProps => (
                <Flex vertical className=" w-full">
                    <Typography.Text className="text-md mt-2" style={{ color: '#42526D' }}>
                        {formattedDate}
                    </Typography.Text>
                    <Typography.Text className="text-sm font-medium " style={{ color: '#42526D' }}>
                        Date of Joining
                    </Typography.Text>

                    <Typography.Text className="text-md mt-3 " style={{ color: '#42526D' }}>
                        {employeeData.employeeInformation.designation}
                    </Typography.Text>
                    <Typography.Text className="text-sm font-medium" style={{ color: '#42526D' }}>
                        Designation
                    </Typography.Text>
                    <Typography.Text className="text-sm mt-3 " style={{ color: '#42526D' }}>
                        {employeeData.employeeInformation.jobType.toLowerCase()}
                    </Typography.Text>
                    <Typography.Text className="text-sm font-medium" style={{ color: '#42526D' }}>
                        Job Type
                    </Typography.Text>

                    <Typography.Text className="text-md mt-3" style={{ color: '#42526D' }}>
                        {employeeData.employeeInformation.schedule}
                    </Typography.Text>

                    <Typography.Text className="text-sm font-medium " style={{ color: '#42526D' }}>
                        Work Shift
                    </Typography.Text>

                    <Form layout="vertical" className="mt-5">
                        <DatePickerInput
                            label="Date of Offboarding"
                            isRequired
                            name="offBoardingDate"
                            placeholder="Select Date"
                            classes=" rounded-sm w-full"
                            minDate={dayjs(new Date())}
                            handleChange={date => {
                                formikProps.setFieldValue('offBoardingDate', date);
                                calculateAndSetLastWorkingDay(
                                    date,
                                    formikProps.values.noticePeriod,
                                    formikProps.setFieldValue,
                                    formikProps
                                );
                            }}
                        />

                        <TextInput
                            name="noticePeriod"
                            isRequired
                            label="Notice Period"
                            type="text"
                            placeholder="Notice Period"
                            maxLength={2}
                            classes="rounded-sm"
                            allowNumbersOnly
                            handleChange={event => {
                                const noticePeriod = parseInt(event, 10); // Convert to integer
                                if (!Number.isNaN(noticePeriod)) {
                                    // Check if conversion is successful
                                    formikProps.setFieldValue('noticePeriod', noticePeriod);
                                    if (formikProps.values.offBoardingDate && noticePeriod >= 0) {
                                        const lastWorkingDay = moment(
                                            formikProps.values.offBoardingDate
                                        )
                                            .add(noticePeriod, 'days')
                                            .format('YYYY-MM-DD');
                                        formikProps.setFieldValue('lastWorkingDay', lastWorkingDay);
                                    }
                                } else {
                                    console.error('Notice period is not a valid number');
                                    // Handle invalid notice period (e.g., set an error message in your form state)
                                }
                            }}
                        />

                        {formikProps.values.offBoardingDate && formikProps.values.noticePeriod ? (
                            <DatePickerInput
                                label="Last working day of employee"
                                name="lastWorkingDay"
                                placeholder="Select Date"
                                classes="rounded-sm w-full"
                                maxDate={dayjs(new Date())}
                                isDisabled
                                isRequired // Always disabled as per your requirement
                            />
                        ) : null}

                        <SelectInput
                            isRequired
                            name="offBoardingType"
                            label="Type Of Resignation"
                            placeholder="Type Of Resignation"
                            options={resignationTypes}
                            classes="rounded-sm"
                        />
                        <DocumentUploadInput
                            isRequired
                            name="resignationLetter"
                            label="Resignation Letter"
                            format="resignationLetterFormat"
                            showNotification
                            showFileName
                        />
                        <InputTextArea
                            isRequired
                            name="reasonForOffBoarding"
                            placeholder="Reason For Resignation"
                            label="Reason For Resignation"
                            maxLength={200}
                        />
                    </Form>
                </Flex>
            )}
        </CustomModalWithForm>
    );
};

export default OffBoardEmployeeModal;
