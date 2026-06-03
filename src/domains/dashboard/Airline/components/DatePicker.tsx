import React, { CSSProperties } from 'react';

import '../assets/style.css';

import { DatePicker, DatePickerProps, Space } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';

interface DateProps {
    style?: CSSProperties;
    defaultDate?: string;
    dateData: any;
    disabledData?: boolean;
    placeholder?: string;
    disabledDate?: (current: any) => any;
    handleChange?: ((date: any, dates: string | string[]) => void) | undefined;
}

const Date: React.FC<DateProps> = ({
    dateData,
    style,
    disabledData,
    defaultDate,
    placeholder = 'Select Date',
    disabledDate = (current: any) => current && current < moment().startOf('day'),
    handleChange,
}) => {
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date) {
            const formattedDate = date.format('DD-MM-YYYY');
            const dayOfWeek = date.format('dddd');
            dateData({
                date: formattedDate,
                day: dayOfWeek,
            });
            if (handleChange) handleChange(date, dateString);
        }
    };
    return (
        <Space>
            <DatePicker
                value={defaultDate ? dayjs(defaultDate, 'DD-MM-YYYY') : undefined}
                format="DD MMM YYYY"
                disabled={disabledData}
                disabledDate={disabledDate}
                placement="bottomLeft"
                style={style}
                placeholder={placeholder}
                suffixIcon={false}
                onChange={onChange}
                allowClear={false}
                className="w-full custom_datepicker"
            />
        </Space>
    );
};

export default Date;
