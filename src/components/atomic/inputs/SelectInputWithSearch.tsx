import React from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Select } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps } from 'formik';

import { DropDown } from '@customtypes/general';

interface SelectInputWithSearchProps {
    name: string;
    label?: string;
    placeholder: string;
    size?: SizeType;
    isDisabled?: boolean;
    isRequired?: boolean;
    classes?: string;
    options: DropDown | any[];
    showToolTip?: boolean;
    tooltipText?: string;
    handleChange?: (value: string) => void;
    mode?: 'multiple' | 'tags' | undefined;
    disableDeselect?: boolean;
    maxCount?: number;
}

const SelectInputWithSearch: React.FC<SelectInputWithSearchProps> = ({
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
    handleChange,
    mode,
    disableDeselect,
    maxCount,
}) => (
    <Field name={name}>
        {({ field, form: { touched, errors, values, setFieldValue } }: FieldProps) => (
            <Form.Item
                label={label && <span title="">{label}</span>} // Line modified
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
                    placeholder={placeholder}
                    disabled={isDisabled}
                    value={values[name] !== '' ? values[name] || field.value : undefined}
                    className={classes}
                    size={size}
                    onChange={e => {
                        setFieldValue(name, e);
                        if (handleChange) handleChange(e);
                    }}
                    options={options}
                    filterOption={(input: string, option) =>
                        ((option?.label ?? '') as string)
                            .toLowerCase()
                            .includes(input.toLowerCase())
                    }
                    showSearch
                    mode={mode}
                    allowClear={!disableDeselect}
                    maxCount={maxCount}
                />
            </Form.Item>
        )}
    </Field>
);

export default SelectInputWithSearch;
