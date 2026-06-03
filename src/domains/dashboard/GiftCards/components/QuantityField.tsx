import { InputNumber } from 'antd';
import { Field, FieldProps } from 'formik';

const QuantityField = () => {
    const checkInput = (value: null | number) => {
        if (typeof value === 'string' && Number.isNaN(Number(value))) {
            return '';
        }
        return value;
    };
    return (
        <Field name="quantity">
            {({ field, form }: FieldProps<number>) => (
                <InputNumber
                    min={2}
                    max={10}
                    size="large"
                    type="number"
                    defaultValue={2}
                    {...field}
                    onBlur={() => {
                        if (!form.touched.quantity) {
                            form.setFieldValue('quantity', field.value);
                            form.setFieldTouched('quantity', true);
                        }
                    }}
                    formatter={value => (value ? `${value}`.replace(/[^\d]/g, '') : '')} // Convert non-numeric characters to spaces
                    parser={value => parseInt(value?.replace(/[^\d]/g, '') || '', 10)} //
                    onChange={value => {
                        const newValue = value; // Save the value directly
                        checkInput(newValue);

                        form.setFieldValue('quantity', newValue);
                    }}
                    onKeyDown={e => {
                        const { key } = e;
                        // Prevent non-numeric input
                        if (
                            !/^\d$/.test(key) &&
                            key !== 'Backspace' &&
                            key !== 'Delete' &&
                            key !== 'ArrowLeft' &&
                            key !== 'ArrowRight'
                        ) {
                            e.preventDefault();
                        }
                    }}
                />
            )}
        </Field>
    );
};

export default QuantityField;
