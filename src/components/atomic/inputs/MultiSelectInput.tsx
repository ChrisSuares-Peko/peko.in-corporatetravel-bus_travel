import React, { ReactNode } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Select, Form, Tooltip, Flex } from 'antd';
import { Field, FieldProps } from 'formik';

interface ItemProps {
    label: string;
    value: string;
}

interface MultiSelectInputProps {
    name: string;
    label?: string | ReactNode;
    placeholder: string;
    size?: 'small' | 'middle' | 'large';
    isDisabled?: boolean;
    isRequired?: boolean;
    classes?: string;
    options: ItemProps[];
    showToolTip?: boolean;
    tooltipText?: string;
    maxCount?: number;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
    name,
    label,
    placeholder,
    size = 'middle',
    isDisabled,
    isRequired,
    classes,
    options,
    showToolTip = false,
    tooltipText,
    maxCount = options.length || 100,
}) => (
    <Field name={name}>
        {({ field, form: { touched, errors, setFieldValue } }: FieldProps<string[]>) => (
            <Form.Item
                label={label}
                required={isRequired}
                validateStatus={touched[name] && errors[name] ? 'error' : ''}
                help={touched[name] && errors[name] ? (errors[name] as React.ReactNode) : undefined}
                tooltip={
                    showToolTip && {
                        title: tooltipText,
                        color: 'white',
                        placement: 'right',
                        icon: <InfoCircleOutlined />,
                        overlayInnerStyle: {
                            color: '#171717',
                        },
                        overlayStyle: {
                            minWidth: 300,
                        },
                    }
                }
            >
                <Select
                    {...field}
                    mode="multiple"
                    maxCount={maxCount}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    className={classes}
                    allowClear
                    size={size}
                    onChange={(selectedValues: string[]) => {
                        setFieldValue(name, selectedValues);
                    }}
                    maxTagCount="responsive"
                    maxTagPlaceholder={omittedValues => (
                        <Tooltip title={omittedValues.map(({ label: l2 }) => l2).join(', ')}>
                            <Flex className="cursor-pointer">{`+${omittedValues.length}...`}</Flex>
                        </Tooltip>
                    )}
                >
                    {options.map((option, index) => (
                        <Select.Option key={index} value={option.value}>
                            {option.label}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        )}
    </Field>
);

export default MultiSelectInput;
