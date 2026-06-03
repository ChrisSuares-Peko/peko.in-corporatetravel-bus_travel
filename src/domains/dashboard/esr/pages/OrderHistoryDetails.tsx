import { Col, Row, Flex, Skeleton, Form, Radio, Checkbox, DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import { Field, Formik } from 'formik';
import { useLocation } from 'react-router-dom';

import SelectInputWithSearch from '@components/atomic/inputs/SelectInputWithSearch';
import TextInput from '@components/atomic/inputs/TextInput';
import useScreenSize from '@src/hooks/useScreenSize';

import FormHeader from '../components/Stages/FormHeader';
import useGetEsrStageData from '../hooks/useGetEsrStageData';
import { Step } from '../types/types';

interface StepFormValues {
    [key: string]: string | number | boolean | string[]; // Define a flexible type for form values
}
const OrderHistoryDetails = () => {
    const { state } = useLocation();
    const { md } = useScreenSize();
    const { data, isLoading } = useGetEsrStageData(state);
    // Flatten the initial values
    const getInitialValues = (stepItem: Step): StepFormValues => {
        const initialValues: StepFormValues = {};
        stepItem.questionAnswers.forEach((item, index) => {
            initialValues[`answer_${index}`] = item.answer;
            if (initialValues[`answer_${index}`] === null || undefined)
                initialValues[`answer_${index}`] = '';
        });
        return initialValues;
    };

    if (isLoading || !data) {
        return (
            <>
                {Array.from({ length: md ? 4 : 3 }).map((_, idx) => (
                    <Row gutter={[20, 30]} key={idx} className="md:w-3/4 mt-5">
                        <Col span={24}>
                            <Skeleton
                                active
                                title={false}
                                paragraph={{ rows: 1 }}
                                className="w-3/4"
                            />
                        </Col>
                        <Col span={24}>
                            <Flex vertical={!md} gap={25} justify="space-between">
                                {Array.from({ length: md ? 4 : 3 }).map((leng, index) => (
                                    <Flex gap={10} key={index}>
                                        <Skeleton.Avatar size="small" active />
                                        <Skeleton.Input size="small" active />
                                    </Flex>
                                ))}
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Flex
                                vertical
                                className="relative sm-mt-4 md:border-2 md:border-gray-150 md:rounded-lg p-4 w-full pt-5 "
                            >
                                <Skeleton.Input size="small" active />
                                <Skeleton
                                    active
                                    title
                                    paragraph={{ rows: md ? 6 : 4 }}
                                    className="w-3/4 mt-5"
                                />
                            </Flex>
                        </Col>
                    </Row>
                ))}
            </>
        );
    }

    return (
        <Flex vertical key={data.stageId}>
            <Typography.Paragraph className="text-xl font-medium">
                {data.stageTitle} Preview
            </Typography.Paragraph>
            {data.steps.map((step, index) => (
                <Formik<StepFormValues>
                    initialValues={getInitialValues(step)}
                    enableReinitialize
                    onSubmit={() => {}}
                >
                    {({ handleSubmit, values, setFieldValue }) => (
                        <Form onFinish={handleSubmit} layout="vertical" className="w-full">
                            <Flex
                                vertical
                                className="relative mt-6 md:border-2 md:border-gray-150 md:rounded-lg p-4 md:w-3/4"
                            >
                                <FormHeader
                                    step={`${index + 1}/${data.steps.length}`}
                                    title={`${step.stepTitle}:`}
                                />
                                <Row className="mt-6 w-full" gutter={[20, 20]}>
                                    {step.questionAnswers.map((item, idx) => {
                                        const name = `answer_${idx}`; // Flattened field name
                                        return (
                                            <Col xs={24} md={8} key={name}>
                                                <Field name={name}>
                                                    {({ field }: any) => (
                                                        <>
                                                            {item.questionType === 'text' && (
                                                                <TextInput
                                                                    {...field}
                                                                    name={name} // Flattened name
                                                                    type={item.questionType}
                                                                    label={item.questionText}
                                                                    placeholder={
                                                                        item.placeholder || ''
                                                                    }
                                                                    allowAlphabetsAndNumbersOnly
                                                                    isDisabled
                                                                />
                                                            )}

                                                            {item.questionType === 'number' && (
                                                                <TextInput
                                                                    {...field}
                                                                    name={name} // Flattened name
                                                                    type="string"
                                                                    label={item.questionText}
                                                                    placeholder={
                                                                        item.placeholder || ''
                                                                    }
                                                                    allowNumbersOnly
                                                                    isDisabled
                                                                />
                                                            )}

                                                            {item.questionType === 'select' && (
                                                                <SelectInputWithSearch
                                                                    {...field}
                                                                    name={name}
                                                                    label={item.questionText}
                                                                    placeholder={
                                                                        item.placeholder || ''
                                                                    }
                                                                    isRequired={item.isRequired}
                                                                    options={item.options!}
                                                                    isDisabled
                                                                />
                                                            )}

                                                            {item.questionType === 'radio' && (
                                                                <Form.Item
                                                                    label={item.questionText}
                                                                >
                                                                    <Radio.Group
                                                                        disabled
                                                                        name={name}
                                                                        {...field}
                                                                    >
                                                                        {item.options?.map(
                                                                            option => (
                                                                                <Radio
                                                                                    key={String(
                                                                                        option.value
                                                                                    )}
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                >
                                                                                    {option.label}
                                                                                </Radio>
                                                                            )
                                                                        )}
                                                                    </Radio.Group>
                                                                </Form.Item>
                                                            )}

                                                            {item.questionType === 'checkbox' && (
                                                                <Form.Item
                                                                    label={item.questionText}
                                                                >
                                                                    <Checkbox.Group
                                                                        disabled
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
                                                                        {item.options?.map(
                                                                            option => (
                                                                                <Checkbox
                                                                                    key={String(
                                                                                        option.value
                                                                                    )}
                                                                                    value={
                                                                                        option.value
                                                                                    }
                                                                                >
                                                                                    {option.label}
                                                                                </Checkbox>
                                                                            )
                                                                        )}
                                                                    </Checkbox.Group>
                                                                </Form.Item>
                                                            )}

                                                            {item.questionType === 'date' && (
                                                                <Form.Item
                                                                    label={item.questionText}
                                                                >
                                                                    <DatePicker
                                                                        disabled
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
                                                                        onChange={(
                                                                            date,
                                                                            dateString
                                                                        ) => {
                                                                            setFieldValue(
                                                                                name,
                                                                                dateString
                                                                            ); // Save formatted date string to formik values
                                                                        }}
                                                                    />
                                                                </Form.Item>
                                                            )}
                                                        </>
                                                    )}
                                                </Field>
                                            </Col>
                                        );
                                    })}
                                </Row>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            ))}
        </Flex>
    );
};

export default OrderHistoryDetails;
