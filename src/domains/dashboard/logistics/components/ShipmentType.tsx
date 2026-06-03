import React from 'react';

import { Flex, Radio, Form } from 'antd';
import { Field, FieldProps } from 'formik';

type Props = {
    setSelectedValue: (id: string) => void;
    name: string;
};

const ShipmentType: React.FC<Props> = ({ setSelectedValue, name }) => (
    <Field name={name} initialValue="DOM">
        {({ field, form }: FieldProps<string>) => (
            <Form.Item
                validateStatus={form.touched[field.name] && form.errors[field.name] ? 'error' : ''}
                required
            >
                <Flex vertical align="center">
                    <Radio.Group
                        value={field.value || 'DOM'}
                        onChange={e => {
                            form.setFieldValue(field.name, e.target.value);
                            setSelectedValue(e.target.value);
                        }}
                    >
                        <Radio className="my-2 sm:my-0" value="DOM">
                            Domestic Shipment
                        </Radio>
                        <Radio className="my-2 sm:my-0" value="EXP">
                            International Shipment
                        </Radio>
                    </Radio.Group>
                </Flex>
            </Form.Item>
        )}
    </Field>
);

export default ShipmentType;
