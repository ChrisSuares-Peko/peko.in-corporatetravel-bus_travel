import { DatePickerProps, PaginationProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';
import { Dayjs } from 'dayjs';

import { filterState } from '../types/table';

interface Props {
    setFilters: (value: any) => void;
    initalStartDate: string;
    initalEndDate: string;
}

const useFilter = ({ setFilters, initalStartDate, initalEndDate }: Props) => {
    const handleChangeModule = (selectedOption: string) => {
        setFilters((prevState: filterState) => ({
            ...prevState,
            module: selectedOption,
            page: 1,
        }));
    };
    const handleChangeStatus = (selectedOption: string) => {
        setFilters((prevState: filterState) => ({
            ...prevState,
            status: selectedOption,
            page: 1,
        }));
    };
    const handlePageChange: PaginationProps['onChange'] = page => {
        setFilters((prevState: filterState) => ({
            ...prevState,
            page,
        }));
    };

    const handleDateChange: RangePickerProps<Dayjs>['onChange'] = (dates, dateStrings) => {
        if (dates === null) {
            setFilters((prevState: filterState) => ({
                ...prevState,
                from: initalStartDate,
                to: initalEndDate,
                page: 1,
            }));
        } else {
            setFilters((prevState: filterState) => ({
                ...prevState,
                from: dateStrings[0],
                to: dateStrings[1],
                page: 1,
            }));
        }
    };

    const handleFromChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date === null) {
            setFilters((prevState: filterState) => ({
                ...prevState,
                from: initalStartDate,
                page: 1,
            }));
        } else {
            setFilters((prevState: filterState) => ({
                ...prevState,
                from: dateString,
                page: 1,
            }));
        }
    };
    const handleToChange: DatePickerProps['onChange'] = (date, dateString) => {
        if (date === null) {
            setFilters((prevState: filterState) => ({
                ...prevState,
                to: initalEndDate,
                page: 1,
            }));
        } else {
            setFilters((prevState: filterState) => ({
                ...prevState,
                to: dateString,
                page: 1,
            }));
        }
    };
    return {
        handleChangeModule,
        handlePageChange,
        handleDateChange,
        handleFromChange,
        handleToChange,
        handleChangeStatus,
    };
};

export default useFilter;
