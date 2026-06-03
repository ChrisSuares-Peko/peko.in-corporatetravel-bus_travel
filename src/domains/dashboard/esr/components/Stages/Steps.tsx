import type { FC } from 'react';

import { Button, Col, Row, Form, Grid, Flex, Radio, Checkbox, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { Formik, Field } from 'formik';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';

import FormHeader from './FormHeader';
import { Stage, Step } from '../../types/types';

const { useBreakpoint } = Grid;

interface StepsProps {
    current: number;
    setCurrent: (key: number) => void;
    setFormSubmitData: React.Dispatch<React.SetStateAction<Stage>>;
    stepData: Step;
    totalSteps: number;
    btnLoading: boolean;
}
interface StepFormValues {
    [key: string]: string | number | boolean | string[]; // Define a flexible type for form values
}
const Steps: FC<StepsProps> = ({
    current,
    setCurrent,
    stepData,
    totalSteps,
    setFormSubmitData,
    btnLoading,
}) => {
    const screens = useBreakpoint();
    const value: [number, number] = screens.md ? [30, 40] : [5, 10];

    // Flatten the initial values
    const getInitialValues = (data: Step): StepFormValues => {
        const initialValues: StepFormValues = {};
        data.questionAnswers.forEach((item, index) => {
            initialValues[`answer_${index}`] = item.answer;
            if (initialValues[`answer_${index}`] === null || undefined)
                initialValues[`answer_${index}`] = '';
        });
        return initialValues;
    };

    return (
        <Formik<StepFormValues>
            initialValues={getInitialValues(stepData)}
            onSubmit={values => {
                console.log('🚀 ~ values:', values);

                // Update the form data without storing values in questionAnswers array
                setFormSubmitData(prev => ({
                    ...prev,
                    steps: prev.steps.map((step, stepIndex) => {
                        if (stepIndex === current) {
                            // Store answers directly from values, not in the questionAnswers array
                            step.questionAnswers = step.questionAnswers.map((data, index) => ({
                                ...data,
                                answer: values[`answer_${index}`], // Store directly as flattened values
                            }));
                        }
                        return step;
                    }),
                    isCompleted: current + 1 === totalSteps ? true : prev.isCompleted,
                }));

                if (current + 1 !== totalSteps) setCurrent(current + 1);
            }}
            // validationSchema={() => getValidationSchema(stepData)} // Validation logic
            enableReinitialize
        >
            {({ handleSubmit, values, errors, touched, setFieldValue }) => (
                <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                    <Flex
                        vertical
                        className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full"
                    >
                        <FormHeader
                            step={`${current + 1}/${totalSteps}`}
                            title={`${stepData.stepTitle}:`}
                        />
                        <Row className="mt-6 w-full" gutter={value}>
                            {stepData.questionAnswers.map((item, index) => {
                                const name = `answer_${index}`; // Flattened field name
                                return (
                                    <Col xs={24} md={12} key={item.questionId}>
                                        <Field name={name}>
                                            {({ field }: any) => (
                                                <>
                                                    {item.questionType === 'text' && (
                                                        <TextInput
                                                            {...field}
                                                            name={name} // Flattened name
                                                            type={item.questionType}
                                                            label={item.questionText}
                                                            placeholder={item.placeholder || ''}
                                                            isRequired={item.isRequired}
                                                            allowAlphabetsAndNumbersOnly
                                                            allowEmailsOnly
                                                        />
                                                    )}

                                                    {item.questionType === 'number' && (
                                                        <TextInput
                                                            {...field}
                                                            name={name} // Flattened name
                                                            type="string"
                                                            label={item.questionText}
                                                            placeholder={item.placeholder || ''}
                                                            isRequired={item.isRequired}
                                                            allowNumbersOnly
                                                        />
                                                    )}

                                                    {item.questionType === 'select' && (
                                                        <SelectInputWithSearch
                                                            {...field}
                                                            name={name}
                                                            label={item.questionText}
                                                            placeholder={item.placeholder || ''}
                                                            isRequired={item.isRequired}
                                                            options={item.options!}
                                                        />
                                                    )}

                                                    {item.questionType === 'radio' && (
                                                        <Form.Item
                                                            label={item.questionText}
                                                            required={item.isRequired}
                                                        >
                                                            <Radio.Group name={name} {...field}>
                                                                {item.options?.map(option => (
                                                                    <Radio
                                                                        key={String(option.value)}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </Radio>
                                                                ))}
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    )}

                                                    {item.questionType === 'checkbox' && (
                                                        <Form.Item
                                                            label={item.questionText}
                                                            required={item.isRequired}
                                                        >
                                                            <Checkbox.Group
                                                                name={name}
                                                                value={
                                                                    values[name] as
                                                                        | string[]
                                                                        | undefined
                                                                }
                                                                onChange={checkedValues => {
                                                                    setFieldValue(
                                                                        name,
                                                                        checkedValues
                                                                    ); // Set the selected values directly
                                                                }}
                                                            >
                                                                {item.options?.map(option => (
                                                                    <Checkbox
                                                                        key={String(option.value)}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </Checkbox>
                                                                ))}
                                                            </Checkbox.Group>
                                                        </Form.Item>
                                                    )}

                                                    {item.questionType === 'date' && (
                                                        <Form.Item
                                                            label={item.questionText}
                                                            required={item.isRequired}
                                                        >
                                                            <DatePicker
                                                                value={
                                                                    values[name]
                                                                        ? dayjs(
                                                                              values[
                                                                                  name
                                                                              ] as string,
                                                                              'YYYY-MM-DD'
                                                                          )
                                                                        : null
                                                                } // Handle null or empty values
                                                                name={name}
                                                                format="YYYY-MM-DD" // Adjust format as needed
                                                                onChange={(date, dateString) => {
                                                                    setFieldValue(name, dateString); // Save formatted date string to formik values
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    )}

                                                    {(item.questionType === 'checkbox' ||
                                                        item.questionType === 'date' ||
                                                        item.questionType === 'radio') &&
                                                        touched[name] &&
                                                        errors[name] && (
                                                            <div className="text-red-500 -mt-5">
                                                                {errors[name]}
                                                            </div>
                                                        )}
                                                </>
                                            )}
                                        </Field>
                                    </Col>
                                );
                            })}
                        </Row>
                    </Flex>

                    {/* Navigation section */}
                    <Flex className="justify-start gap-10 mt-8">
                        {current >= 1 && (
                            <Button
                                htmlType="button"
                                className="md:w-32 xs:w-36"
                                onClick={() => setCurrent(current - 1)}
                                loading={btnLoading}
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            type="primary"
                            className="md:w-32 xs:w-36"
                            danger
                            htmlType="submit"
                            loading={btnLoading}
                        >
                            Next
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    );
};

export default Steps;
