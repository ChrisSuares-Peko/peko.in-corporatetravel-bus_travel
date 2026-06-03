import React, { useEffect } from 'react';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Select } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps, useFormikContext } from 'formik';

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
    showSearch?: boolean;
    onSearch?: (value: string) => void;
    onClear?: (setField: any) => void;
    defaultValue?: string;
    filterOption?: boolean;
    searchValue?: string;
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
    showSearch = false,
    onSearch,
    defaultValue,
    filterOption,
    onClear,
    searchValue,
}) => {
    const formikContext = useFormikContext();
    if (options.length === 1) {
        mode = undefined;
    }
    useEffect(() => {
        const { setFieldValue, values } = formikContext as {
            setFieldValue: (name: string, value: any) => void;
            values: Record<string, any>;
        };
        if (options.length === 1 && options[0].value !== values[name]) {
            setFieldValue(name, options[0].value);
        }
    }, [options, name, formikContext]);
    return (
        <Field name={name}>
            {({ form: { touched, errors, values, setFieldValue } }: FieldProps) => (
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
                >
                    <Select
                        searchValue={searchValue}
                        placeholder={placeholder}
                        disabled={isDisabled}
                        showSearch={showSearch}
                        value={values[name] !== '' ? values[name] : undefined}
                        className={classes}
                        size={size}
                        onChange={e => {
                            setFieldValue(name, e);
                            if (handleChange) handleChange(e);
                        }}
                        options={options}
                        filterOption={filterOption}
                        mode={mode}
                        allowClear
                        onClear={() => {
                            setFieldValue(name, '');
                            if (onClear) onClear(setFieldValue);
                        }}
                        onSearch={onSearch}
                    />
                </Form.Item>
            )}
        </Field>
    );
};

export default SelectInputWithSearch;
