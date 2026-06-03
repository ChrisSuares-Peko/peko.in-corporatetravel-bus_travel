import React, { useState } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Tag } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps } from 'formik';

interface MultiTextInputProps {
    name: string;
    label?: string;
    placeholder?: string;
    type: string;
    size?: SizeType;
    isDisabled?: boolean;
    isRequired?: boolean;
    classes?: string;
    formItemClass?: string;
    showToolTip?: boolean;
    tooltipText?: string;
    maxLength?: number;
    minLength?: number;
    allowNumbersOnly?: boolean;
    allowDecimalsOnly?: boolean;
}

const MultiTextInput: React.FC<MultiTextInputProps> = ({
    name,
    label,
    placeholder,
    type,
    size,
    isDisabled,
    isRequired,
    classes,
    formItemClass,
    showToolTip = false,
    tooltipText,
    maxLength,
    minLength,
    allowNumbersOnly = false,
    allowDecimalsOnly = false,
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: Function,
        field: any
    ) => {
        const { value } = e.target;
        let filteredValue = value;
        if (allowNumbersOnly) {
            filteredValue = value.replace(/[^\d]/g, '');
        }
        if (allowDecimalsOnly) {
            filteredValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        }
        setInputValue(filteredValue);
    };

    const handleInputKeyPress = (
        e: React.KeyboardEvent<HTMLInputElement>,
        setFieldValue: Function,
        field: any
    ) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            setFieldValue(name, [...(field.value || []), inputValue]); // Check if field.value is an array
            setInputValue('');
        }
    };

    const handleTagClose = (index: number, setFieldValue: Function, field: any) => {
        const updatedValues = [...field.value];
        updatedValues.splice(index, 1);
        setFieldValue(name, updatedValues);
    };

    return (
        <Field name={name}>
            {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
                <Form.Item
                    label={label}
                    required={isRequired}
                    validateStatus={touched[name] && errors[name] ? 'error' : ''}
                    help={
                        touched[name] && errors[name]
                            ? (errors[name] as React.ReactNode)
                            : undefined
                    }
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
                    className={formItemClass}
                >
                    <div>
                        {(field.value || []).map(
                            (
                                value: string,
                                index: number // Check if field.value is an array
                            ) => (
                                <Tag
                                    key={index}
                                    closable
                                    onClose={() => handleTagClose(index, setFieldValue, field)}
                                >
                                    {value}
                                </Tag>
                            )
                        )}
                        <Input
                            value={inputValue}
                            maxLength={maxLength}
                            minLength={minLength}
                            type={type}
                            size={size ?? 'middle'}
                            placeholder={placeholder}
                            disabled={isDisabled}
                            className={classes}
                            onPressEnter={e => handleInputKeyPress(e, setFieldValue, field)}
                            onChange={e => handleInputChange(e, setFieldValue, field)}
                        />
                    </div>
                </Form.Item>
            )}
        </Field>
    );
};

export default MultiTextInput;
