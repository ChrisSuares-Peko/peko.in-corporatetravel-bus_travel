import { Col, Typography } from 'antd';

import SelectInput from '@components/atomic/inputs/SelectInput';
import TextInput from '@components/atomic/inputs/TextInput';
import { useAppSelector } from '@src/hooks/store';
import { accessKeys } from '@utils/accessKeys';
import { formatNumberWithLocalString } from '@utils/priceFormat';

import { RenderFormFieldProps } from '../../types';

const RenderFormField = ({ formData, limitData }: RenderFormFieldProps) => {
    const item = useAppSelector(state => state.reducer.billPayment);
    const serviceData = item ? item.vendor : null;
    const { dUPostpaid, NOL, dUPrepaid } = accessKeys;

    const { type, name, label, placeholder, options, max, supportAlphabets } = formData;

    const allowTwoDecimalsAccessKeys = [NOL, dUPrepaid];

    if (type === 'select' && options) {
        return (
            <Col className="sm:w-72 sm:mr-5">
                <SelectInput
                    key={name}
                    placeholder={placeholder}
                    label={label}
                    name={name}
                    options={options}
                    isRequired
                />
            </Col>
        );
    }
    return (
        <Col className="sm:mr-5">
            <TextInput
                key={name}
                name={name}
                label={label}
                placeholder={placeholder}
                type="text"
                classes="sm:w-[18rem]"
                maxLength={max || 15}
                allowNumbersOnly
                allowAlphabetsAndNumbersOnly={!!supportAlphabets}
                isRequired
                allowTwoDecimalsOnly={allowTwoDecimalsAccessKeys.includes(
                    serviceData?.accessKey || ''
                )}
                allowNumbersAndDots={serviceData?.accessKey === dUPostpaid}
            />
            {formData?.showMinAndMax && (
                <Typography.Text>
                    Min: AED {formatNumberWithLocalString(limitData?.minDenomination || 0)} and Max:
                    AED {`${formatNumberWithLocalString(limitData?.maxDenomination) ?? '0'}`}
                </Typography.Text>
            )}
        </Col>
    );
};

export default RenderFormField;
