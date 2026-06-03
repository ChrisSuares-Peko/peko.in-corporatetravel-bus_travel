import React from 'react';

import { Flex, Switch, Typography } from 'antd';
import { Field, FieldProps, useFormikContext } from 'formik';

interface SwitchInputProps {
    name: string;
    label?: string;
    isDisabled?: boolean;
    classes?: string;
    labelClasses?: string;
    onChange?: (checked: boolean) => void;
}

const SwitchInput: React.FC<SwitchInputProps> = ({
    name,
    label,
    isDisabled,
    classes,
    labelClasses,
    onChange,
}) => {
    const { setFieldValue } = useFormikContext();
    const handleChange = (checked: boolean) => {
        if (onChange) {
            onChange(checked);
        }
        setFieldValue(name, checked);
    };

    return (
        <Field name={name}>
            {({ field, form: { values } }: FieldProps) => (
                <Flex className="w-full mb-6 " align="center" justify="space-between">
                    <Typography.Text className={labelClasses}>{label}</Typography.Text>
                    <Switch
                        defaultValue={field.value !== '' ? field.value : undefined}
                        disabled={isDisabled}
                        className={classes}
                        onChange={handleChange}
                        checked={values[name]}
                    />
                </Flex>
            )}
        </Field>
    );
};

export default SwitchInput;
