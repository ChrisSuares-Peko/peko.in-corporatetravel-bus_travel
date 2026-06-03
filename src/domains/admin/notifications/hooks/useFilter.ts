import { DatePickerProps, PaginationProps } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker/generatePicker/interface';
import { TableProps } from 'antd/lib';
import { Dayjs } from 'dayjs';

import { filterState } from '../types';

interface Props {
    setFilters: (value: any) => void;
    initalStartDate: string;
    initalEndDate: string;
}

const useFilter = ({ setFilters, initalStartDate, initalEndDate }: Props) => {
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

    const handleSearch = (e: any) => {
        setFilters((prevState: filterState) => ({
            ...prevState,
            search: e.target.value,
            page: 1,
        }));
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

    const handleTableChange: TableProps<any>['onChange'] = (pagination, filter, sorter) => {
        let sort;
        let field;

        if (Array.isArray(sorter)) {
            if (sorter.length > 0) {
                field = sorter[0].field;
                sort = sorter[0].order === 'ascend' ? 'ASC' : 'DESC';
            }
        } else {
            field = sorter.field;
            sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
        }

        if (field) {
            handleSort(field.toString(), sort);
        }
    };

    const handleSort = (sortField: string, sort?: string) => {
        const formattedSortField = sortField.includes(',')
            ? sortField.split(',').join('.')
            : sortField;

        setFilters((prevState: filterState) => ({
            ...prevState,
            sortField: formattedSortField,
            sort,
            page: 1,
        }));
    };

    return {
        handlePageChange,
        handleDateChange,
        handleSearch,
        handleFromChange,
        handleToChange,
        handleTableChange,
    };
};

export default useFilter;
