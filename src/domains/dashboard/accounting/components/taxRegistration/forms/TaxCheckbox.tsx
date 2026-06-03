import React from 'react';

import { Checkbox as AntCheckbox, Flex, Form } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { Field, FieldProps } from 'formik';

interface CheckboxProps {
    name: string;
    children: React.ReactNode;
    checked?: boolean;
    disabled?: boolean;
    onChange?: (e: CheckboxChangeEvent) => void;
    classes?: string;
    isRequired?: boolean;
}

const TaxCheckboxInput: React.FC<CheckboxProps> = ({
    name,
    children,
    checked,
    disabled,
    onChange,
    classes,
    isRequired,
}) => (
    <Field name={name}>
        {({ field, form: { touched, errors, setFieldValue } }: FieldProps) => (
            <Form.Item
                validateStatus={touched[name] && errors[name] ? 'error' : ''}
                help={touched[name] && errors[name] ? (errors[name] as React.ReactNode) : undefined}
            >
                <Flex align="flex-start">
                    <AntCheckbox
                        {...field}
                        checked={checked ?? field.value}
                        disabled={disabled}
                        required={isRequired}
                        onChange={e => {
                            field.onChange(e);
                            if (onChange) {
                                onChange(e);
                            }
                        }}
                        className={classes}
                    />
                    <div style={{ marginLeft: 8 }}>{children}</div>
                </Flex>
            </Form.Item>
        )}
    </Field>
);

export default TaxCheckboxInput;
