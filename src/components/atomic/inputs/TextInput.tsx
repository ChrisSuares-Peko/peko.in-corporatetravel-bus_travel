import React, { ReactNode } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps } from 'formik';

interface TextInputProps {
    name: string;
    label?: string | ReactNode;
    placeholder?: string;
    type: string;
    size?: SizeType;
    isDisabled?: boolean;
    isRequired?: boolean;
    classes?: string;
    formItemClass?: string;
    addonBefore?: any;
    showToolTip?: boolean;
    disablePaste?: boolean;
    tooltipText?: string;
    suffix?: any;
    prefix?: any;
    maxLength?: number;
    minLength?: number;
    allowNumbersOnly?: boolean;
    allowDecimalsOnly?: boolean;
    allowTwoDecimalsOnly?: boolean;
    allowAlphabetsAndSpaceOnly?: boolean;
    allowAlphabetsOnly?: boolean;
    allowAlphabetsAndNumbersOnly?: boolean;
    allowAlphabetsSpaceAndNumbersOnly?: boolean;
    allowNumbersAndDots?: boolean;
    allowLowerCaseOnly?: boolean;
    allowEmailsOnly?: boolean;
    handleChange?: (value: string) => void;
    allowedInputKeys?: (value: string) => string;
    readOnly?: boolean;
    values?: string;
}

const TextInput: React.FC<TextInputProps> = ({
    name,
    label,
    placeholder,
    type,
    size,
    isDisabled,
    isRequired,
    addonBefore,
    classes,
    formItemClass,
    showToolTip = false,
    disablePaste = false,
    tooltipText,
    suffix,
    maxLength,
    minLength,
    allowNumbersOnly = false,
    allowDecimalsOnly = false,
    allowTwoDecimalsOnly = false,
    allowAlphabetsOnly = false,
    allowAlphabetsAndSpaceOnly = false,
    allowAlphabetsAndNumbersOnly = false,
    allowAlphabetsSpaceAndNumbersOnly = false,
    allowNumbersAndDots = false,
    allowLowerCaseOnly = false,
    allowEmailsOnly = false,
    allowedInputKeys,
    prefix,
    handleChange,
    readOnly = false,
    values,
}) => (
    <Field name={name}>
        {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
            <Form.Item
                label={label && <span title="">{label}</span>} // Modified line
                colon={false} // Added line
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
                className={formItemClass}
            >
                <Input
                    {...field}
                    value={values ?? field.value}
                    maxLength={maxLength}
                    minLength={minLength}
                    type={type}
                    size={size ?? 'middle'}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    className={classes}
                    addonBefore={addonBefore}
                    suffix={suffix}
                    prefix={prefix}
                    readOnly={readOnly}
                    onPaste={e => {
                        if (disablePaste) e.preventDefault();
                    }}
                    onChange={e => {
                        const { value } = e.target;
                        let filteredValue = value;
                        if (allowNumbersOnly) {
                            filteredValue = value.replace(/[^\d]/g, '');
                        }
                        if (allowDecimalsOnly) {
                            filteredValue = value
                                .replace(/[^0-9.]/g, '')
                                .replace(/(\..*?)\..*/g, '$1');
                        }
                        if (allowTwoDecimalsOnly) {
                            filteredValue = value.replace(
                                /[^\d.]+|(?<=\.\d{2})\d+|\.(?=.*\.)/g,
                                ''
                            );
                        }
                        if (allowAlphabetsOnly) {
                            filteredValue = value.replace(/[^a-zA-Z]/g, '');
                        }
                        if (allowAlphabetsAndSpaceOnly) {
                            filteredValue = value.replace(/[^a-zA-Z ]/g, '');
                        }
                        if (allowAlphabetsAndNumbersOnly) {
                            filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
                        }
                        if (allowAlphabetsSpaceAndNumbersOnly) {
                            filteredValue = value.replace(/[^a-zA-Z0-9 ]/g, '');
                        }
                        if (allowNumbersAndDots) {
                            filteredValue = value.replace(/[^\d.]/g, '');
                        }
                        if (allowLowerCaseOnly) {
                            filteredValue = value.toLowerCase();
                        }
                        if (allowEmailsOnly) {
                            filteredValue = value
                                .replace(/[^a-zA-Z0-9@._-]/g, '') // Allow only valid email characters
                                .replace(/[^@]*@[^.]*\./g, match =>
                                    match.replace(/[^a-zA-Z0-9@._-]/g, '')
                                ); // Keep valid email format
                        }
                        if (allowedInputKeys) {
                            filteredValue = allowedInputKeys(value);
                        }
                        setFieldValue(name, filteredValue);
                        if (handleChange) handleChange(e.target.value);
                    }}
                />
            </Form.Item>
        )}
    </Field>
);

export default TextInput;
