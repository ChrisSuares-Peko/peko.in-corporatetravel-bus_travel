import React from 'react';

import { Form, Input } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps } from 'formik';

interface PinInputProps {
    name: string;
    label?: string;
    placeholder: string;
    type: string;
    size?: SizeType;
    isDisabled?: boolean;
    isRequired?: boolean;
    disablePaste?: boolean;
    classes?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    allowAllExceptSpace?: boolean;
    maxLength?: number;
}

const PinInput: React.FC<PinInputProps> = ({
    name,
    label,
    placeholder,
    type,
    size,
    isDisabled,
    isRequired,
    classes,
    disablePaste = false,
    onChange,
    maxLength,
}) => {
    const { Password } = Input;
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
                >
                    <Password
                        {...field}
                        type={type}
                        size={size ?? 'middle'}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        className={classes}
                        maxLength={maxLength}
                        onPaste={e => {
                            if (disablePaste) e.preventDefault();
                        }}
                        onChange={e => {
                            const { value } = e.target;
                            let filteredValue = value;
                            filteredValue = value.replace(/[^0-9]/g, '');
                            setFieldValue(name, filteredValue);
                        }}
                    />
                </Form.Item>
            )}
        </Field>
    );
};

export default PinInput;
