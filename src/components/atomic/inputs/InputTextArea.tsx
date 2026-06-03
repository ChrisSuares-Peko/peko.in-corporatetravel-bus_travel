import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { Field, FieldProps } from 'formik';

interface InputTextAreaProps {
    name: string;
    label?: string;
    placeholder: string;
    size?: SizeType;
    isDisabled?: boolean;
    isRequired?: boolean;
    autoSize?: boolean | { minRows?: number; maxRows?: number };
    maxLength?: number;
    showToolTip?: boolean;
    tooltipText?: string;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({
    name,
    label,
    placeholder,
    size,
    isDisabled,
    isRequired,
    autoSize,
    maxLength = 500,
    showToolTip = false,
    tooltipText,
}) => (
    <Field name={name}>
        {({ field, form: { touched, errors } }: FieldProps) => (
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
                <Input.TextArea
                    {...field}
                    id={name}
                    size={size ?? 'middle'}
                    placeholder={placeholder}
                    disabled={isDisabled}
                    autoSize={autoSize}
                    maxLength={maxLength}
                />
            </Form.Item>
        )}
    </Field>
);

export default InputTextArea;
